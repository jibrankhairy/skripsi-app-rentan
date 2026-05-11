import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const testTypeId = url.searchParams.get("testTypeId");
    const userId = url.searchParams.get("userId");

    if (!testTypeId || !userId) {
      return NextResponse.json(
        { error: "Missing testTypeId or userId" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.findFirst({
      where: {
        testTypeId: Number(testTypeId),
        userId: Number(userId),
        status: "SUCCESS",
      },
      orderBy: { createdAt: "desc" },
      include: {
        attempts: {
          orderBy: { reservedAt: "desc" },
          take: 1,
          select: {
            id: true,
            status: true,
            reservedAt: true,
          },
        },
      },
    });

    console.log("💰 Payment latest:", payment);

    return NextResponse.json({
      payment: payment
        ? {
            ...payment,
            attemptUsed: payment.attempts.length > 0,
            attempt: payment.attempts[0] || null,
          }
        : null,
    });
  } catch (err: any) {
    console.error("❌ Error di /api/payment/latest:", err);
    return NextResponse.json(
      { error: "Gagal ambil payment terakhir", message: err.message },
      { status: 500 },
    );
  }
}
