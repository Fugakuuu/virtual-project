export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset || asset.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        name: body.name,
        scale: body.scale,
        duration: body.duration === 0 ? null : body.duration,
        volume: body.volume,
        exitAnimation: body.exitAnimation,
        chromaKey: body.chromaKey,
        chromaColor: body.chromaColor,
      },
    });

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("[ASSET_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const asset = await prisma.asset.findUnique({
      where: { id },
    });

    if (!asset || asset.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.asset.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ASSET_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
