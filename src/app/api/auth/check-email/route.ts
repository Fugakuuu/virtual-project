import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ exists: false });
    }

    // Check if the user has a password (local account)
    const hasPassword = !!user.password;
    
    // Get list of OAuth providers linked to this email
    const providers = user.accounts.map((acc) => acc.provider);

    return NextResponse.json({
      exists: true,
      hasPassword,
      providers,
    });
  } catch (error) {
    console.error("Check email error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

