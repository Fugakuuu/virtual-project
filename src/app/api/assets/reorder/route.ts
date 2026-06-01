export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const { assets } = await request.json();
    
    // assets should be an array of { id: string, order: number }
    if (!Array.isArray(assets)) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    // Bulk update orders using a transaction
    await prisma.$transaction(
      assets.map((asset) =>
        prisma.asset.update({
          where: { 
            id: asset.id,
            userId, // Security check
          },
          data: { order: asset.order },
        })
      )
    );

    return new NextResponse("Updated", { status: 200 });
  } catch (error) {
    console.error("[ASSETS_REORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

