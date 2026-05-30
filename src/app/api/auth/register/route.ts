import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password, name, otp } = await req.json();

    if (!email || !password || !otp) {
      return NextResponse.json({ error: "Email, password, and OTP are required" }, { status: 400 });
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

    // Delete the used OTP so it can't be used again
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: email,
          token: otp,
        },
      },
    });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.password) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      } else {
        // User exists but only via OAuth. We can add a password to them.
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: { password: hashedPassword, name: name || existingUser.name },
        });
        return NextResponse.json({ message: "Password added to existing OAuth account" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
      },
    });

    return NextResponse.json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
