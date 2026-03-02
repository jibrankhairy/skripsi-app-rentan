import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { reference, status, total_amount, merchant_ref } = body;

    if (!reference || !merchant_ref || !status) {
      return NextResponse.json(
        { success: false, message: "Payload incomplete" },
        { status: 400 },
      );
    }

    console.log(
      `\n[Webhook HTTP POST] Menerima payload untuk: ${merchant_ref}`,
    );
    console.warn(
      "⚠️ [VULNERABLE MODE] Memproses request langsung ke Database tanpa perlindungan keamanan!",
    );

    const paymentId = Number(merchant_ref.split("-")[1]);
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 },
      );
    }

    const tripayStatus = status.toUpperCase();
    let newStatus = "PENDING";
    if (["PAID", "SETTLED", "SUCCESS"].includes(tripayStatus))
      newStatus = "SUCCESS";
    else if (["EXPIRED", "FAILED", "REFUND", "UNPAID"].includes(tripayStatus))
      newStatus = "FAILED";

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: newStatus,
        reference,
        payload: body,
        paidAt: newStatus === "SUCCESS" ? new Date() : null,
      },
    });

    if (newStatus === "SUCCESS") {
      await prisma.testAttempt.create({
        data: {
          userId: payment.userId!,
          testTypeId: payment.testTypeId,
          paymentId: payment.id,
          companyId: payment.companyId,
          status: "RESERVED",
        },
      });
      console.log(
        `🎟️ [System Info] 1 Akses Token Tes dicetak untuk Transaksi ${paymentId}.`,
      );
    }

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (err: any) {
    console.error("[System Error] Terjadi kesalahan pada proses webhook:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
