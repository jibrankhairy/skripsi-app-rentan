import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
const TRIPAY_API_KEY = process.env.TRIPAY_API_KEY;
const TRIPAY_MERCHANT_CODE = process.env.TRIPAY_MERCHANT_CODE;
const TRIPAY_PRIVATE_KEY = process.env.TRIPAY_PRIVATE_KEY;
const TRIPAY_CALLBACK_URL = process.env.TRIPAY_CALLBACK_URL;

export async function POST(req: NextRequest) {
  try {
    const {
      testTypeId,
      quantity = 1,
      userId: targetUserId,
      method = "BRIVA",
      guestToken,
      promoId,
    } = await req.json();
    console.log("DEBUG method from client:", method);

    const methodMap: Record<string, string> = {
      briva: "BRIVA",
      qris: "QRIS",
      shopeepay: "SHOPEEPAY",
      dana: "DANA",
      ovo: "OVO",
      mandiri: "MANDIRIVA",
      mandiriva: "MANDIRIVA",
      bca: "BCAVA",
      bcava: "BCAVA",
      bni: "BNIVA",
      bniva: "BNIVA",
    };
    const normalized = method.toString().trim().toLowerCase();
    const payMethod = methodMap[normalized] || "BRIVA";

    console.log("DEBUG normalized method:", normalized, "=>", payMethod);

    let userId: number | undefined;
    let role: "USER" | "PERUSAHAAN" | "GUEST" | undefined;

    if (guestToken) {
      const tokenData = await prisma.token.findUnique({
        where: { token: guestToken },
        include: { User: true },
      });

      if (!tokenData || !tokenData.userId || !tokenData.User) {
        return NextResponse.json(
          { error: "Guest token tidak valid" },
          { status: 401 },
        );
      }

      userId = tokenData.userId;
      role = "GUEST";

      const existingAttempt = await prisma.testAttempt.findFirst({
        where: {
          userId,
          testTypeId,
        },
      });

      if (existingAttempt) {
        return NextResponse.json({
          success: true,
          startTest: true,
          attempt: existingAttempt,
          message: "Sudah ada attempt untuk user ini",
        });
      }

      const attempt = await prisma.testAttempt.create({
        data: {
          userId,
          testTypeId,
          tokenId: tokenData.id,
          status: "RESERVED",
          companyId: tokenData.User.companyId || null,
        },
      });

      await prisma.token.update({
        where: { id: tokenData.id },
        data: { used: true, usedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        startTest: true,
        attempt,
        message: "Guest token valid, langsung mulai test",
      });
    }

    if (!testTypeId)
      return NextResponse.json({ error: "testTypeId wajib" }, { status: 400 });

    const cookie = req.headers.get("cookie");
    const token = cookie
      ?.split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      role: string;
    };
    if (decoded.role === "GUEST")
      return NextResponse.json(
        { error: "Role GUEST tidak bisa bayar" },
        { status: 403 },
      );

    const test = await prisma.testType.findUnique({
      where: { id: Number(testTypeId) },
    });
    if (!test)
      return NextResponse.json(
        { error: "Tes tidak ditemukan" },
        { status: 404 },
      );

    const basePrice = test.price ?? 0;

    let finalPrice = basePrice;

    if (decoded.role === "PERUSAHAAN") {
      const companyPricing = await prisma.companyPricing.findFirst({
        where: { companyId: decoded.id, testTypeId: test.id },
      });

      if (companyPricing?.customPrice != null) {
        finalPrice = companyPricing.customPrice;
      }

      if (companyPricing?.discountNominal != null) {
        finalPrice = Math.round(
          finalPrice - (finalPrice * companyPricing.discountNominal) / 100,
        );
        if (finalPrice < 0) finalPrice = basePrice;
      }
    } else {
      if (test.priceDiscount != null) {
        finalPrice = test.priceDiscount > 0 ? test.priceDiscount : basePrice;
      } else if (test.percentDiscount != null) {
        finalPrice =
          test.percentDiscount > 0
            ? Math.round(basePrice - (basePrice * test.percentDiscount) / 100)
            : basePrice;
      }
    }

    if (!finalPrice || finalPrice <= 0) finalPrice = basePrice;

    let totalAmount = finalPrice * quantity;

    if (promoId) {
      const promoRecord = await prisma.promo.findUnique({
        where: { id: Number(promoId) },
      });

      if (promoRecord && promoRecord.isActive) {
        let discountAmount = 0;
        if (promoRecord.type === "PERCENT") {
          discountAmount = (totalAmount * promoRecord.value) / 100;
          if (
            promoRecord.maxDiscount &&
            discountAmount > promoRecord.maxDiscount
          ) {
            discountAmount = promoRecord.maxDiscount;
          }
        } else {
          discountAmount = promoRecord.value;
        }

        totalAmount -= discountAmount;
        if (totalAmount < 0) totalAmount = 0;
      }
    }

    const finalUserId =
      decoded.role === "PERUSAHAAN" && targetUserId ? targetUserId : decoded.id;

    const existingPayment = await prisma.payment.findFirst({
      where: {
        testTypeId: Number(testTypeId),
        userId: finalUserId,
        status: "SUCCESS",
        attempts: { none: {} },
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingPayment) {
      const finalUser = await prisma.user.findUnique({
        where: { id: finalUserId },
      });

      const attempt = await prisma.testAttempt.create({
        data: {
          userId: finalUserId,
          testTypeId: test.id,
          paymentId: existingPayment.id,
          companyId: finalUser?.companyId
            ? finalUser.companyId
            : decoded.role === "PERUSAHAAN"
              ? decoded.id
              : null,
          status: "RESERVED",
        },
      });

      return NextResponse.json({
        success: true,
        payment: existingPayment,
        attempt,
        message: "Sudah bayar, langsung mulai test",
        startTest: true,
      });
    }

    let companyPricingRecord = null;

    if (decoded.role === "PERUSAHAAN") {
      companyPricingRecord = await prisma.companyPricing.findFirst({
        where: { companyId: decoded.id, testTypeId: test.id },
        select: { id: true },
      });
    }

    const payment = await prisma.payment.create({
      data: {
        testTypeId: test.id,
        amount: totalAmount,
        status: totalAmount === 0 ? "FREE" : "PENDING",
        userId: finalUserId,
        companyId: decoded.role === "PERUSAHAAN" ? decoded.id : null,
        companyPricingId: companyPricingRecord?.id ?? null,
        quantity,
        method: payMethod,
      },
    });

    if (totalAmount === 0) {
      const finalUser = await prisma.user.findUnique({
        where: { id: finalUserId },
      });

      const attempt = await prisma.testAttempt.create({
        data: {
          userId: finalUserId,
          testTypeId: test.id,
          paymentId: payment.id,
          companyId: finalUser?.companyId
            ? finalUser.companyId
            : decoded.role === "PERUSAHAAN"
              ? decoded.id
              : null,
          status: "RESERVED",
        },
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      });
      return NextResponse.json({
        success: true,
        payment,
        attempt,
        startTest: true,
        reason: "FREE",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: finalUserId } });
    if (!TRIPAY_API_KEY || !TRIPAY_MERCHANT_CODE || !TRIPAY_PRIVATE_KEY) {
      throw new Error(
        "Tripay credentials tidak lengkap di environment variables",
      );
    }

    const merchantRef = `PSY-${payment.id}-${Date.now()}`;
    const signature = crypto
      .createHmac("sha256", TRIPAY_PRIVATE_KEY)
      .update(`${TRIPAY_MERCHANT_CODE}${merchantRef}${totalAmount}`) // ✅ Signature pake 100rb
      .digest("hex");

    const payload: any = {
      method: payMethod,
      merchant_ref: merchantRef,
      amount: totalAmount, // ✅ Tagihan aslinya 100rb
      customer_name: user?.fullName || `User ${finalUserId}`,
      customer_email: user?.email || "no-reply@example.com",
      customer_phone: user?.phone || "081234567890",
      order_items: [
        {
          sku: `TEST-${test.id}`,
          name: `${test.name} ${promoId ? "(Promo)" : ""}`, // ✅ Indikator barang promo
          price: Math.round(totalAmount / quantity), // ✅ Wajib price * qty = totalAmount
          quantity,
        },
      ],

      return_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/return`,
      expired_time: Math.floor(Date.now() / 1000) + 3600,
      signature,
    };

    if (TRIPAY_CALLBACK_URL) payload.callback_url = TRIPAY_CALLBACK_URL;

    const response = await fetch(
      "https://tripay.co.id/api-sandbox/transaction/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TRIPAY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    const data: any = await response.json();

    if (!data.success || !data.data) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED", payload: data },
      });
      return NextResponse.json(
        { error: data.message || "Payment gateway error", details: data },
        { status: 400 },
      );
    }

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        reference: data.data.reference,
        paymentUrl: data.data.checkout_url,
        payload: data.data,
        status: "PENDING",
      },
    });

    const mockWebhookPayload = {
      reference: data.data.reference,
      merchant_ref: data.data.merchant_ref,
      payment_method: data.data.payment_name, // Dinamis ngambil nama metode (Misal: BRI Virtual Account)
      payment_method_code: data.data.payment_method, // Dinamis ngambil kode (Misal: BRIVA)
      total_amount: data.data.amount, // Dinamis ngambil total tagihan
      fee_merchant: data.data.fee_merchant, // Dinamis ngambil fee merchant
      fee_customer: data.data.fee_customer, // Dinamis ngambil fee customer
      total_fee: data.data.total_fee, // Dinamis ngambil total fee
      amount_received: data.data.amount_received, // Dinamis ngambil uang bersih
      is_closed_payment: data.data.is_closed_payment ?? 1,
      status: "UNPAID", // Tetap UNPAID agar bisa didemokan mengubah status menjadi PAID di Postman
      paid_at: null, // Karena masih unpaid, waktu bayarnya null
      note: "Simulated webhook payload for penetration testing",
    };

    console.log("\n[DEBUG] --- GENERATED MOCK WEBHOOK PAYLOAD ---");
    console.log(
      "Description: Payload generated for Webhook Spoofing simulation.",
    );
    console.log("Action: Copy the JSON below for API testing.");
    console.log(JSON.stringify(mockWebhookPayload, null, 2));
    console.log("----------------------------------------------\n");

    return NextResponse.json({
      success: true,
      payment: updated,
      paymentUrl: data.data.checkout_url,
      reference: data.data.reference,
    });
  } catch (err: any) {
    console.error("❌ Error di payment/start:", err);
    return NextResponse.json(
      { error: "Gagal membuat pembayaran", message: err.message },
      { status: 500 },
    );
  }
}
