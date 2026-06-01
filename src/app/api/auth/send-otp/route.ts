import { NextResponse } from "next/server";
import { Resend } from "resend";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists with a password
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.password) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Clear any existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Save the new OTP to the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
      },
    });

    // Send the email using Resend
    // Note: On Resend's free tier, you must use onboarding@resend.dev as the sender
    // and you can only send to the email address you signed up to Resend with.
    const { data, error } = await resend.emails.send({
      from: "Virtual Stream Deck <onboarding@resend.dev>",
      to: [email],
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
          <h2 style="color: #00ed64; background-color: #001e2b; padding: 10px; border-radius: 8px;">Virtual Stream Deck</h2>
          <p style="font-size: 16px; color: #333;">Welcome! Here is your verification code to complete your registration:</p>
          <div style="margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #000; padding: 15px 30px; background-color: #f4f4f4; border-radius: 8px; border: 1px solid #ddd;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #666;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
