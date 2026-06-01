import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Verify OTP
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: email,
            token: otp,
          },
        },
      });
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Delete the used OTP
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
    });

    // Update user's emailVerified field
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
