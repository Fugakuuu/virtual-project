import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, image } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        ...(name && { name }),
        ...(image && { image })
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
