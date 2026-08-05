export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Data Anda belum lengkap. Pastikan email, kode OTP, dan kata sandi baru telah diisi." }, { status: 400 });
    }

    // Verify OTP
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: otp,
        expires: {
          gt: new Date(), // must not be expired
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: "Kode OTP salah atau telah melewati batas waktu yang ditentukan. Silakan minta kode baru." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
    });

    return NextResponse.json({ message: "Password reset successfully", userId: user.id });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Tidak dapat memperbarui kata sandi Anda akibat kendala teknis pada sistem internal." }, { status: 500 });
  }
}
