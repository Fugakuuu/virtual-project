import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const type = formData.get("type") as any; // IMAGE, AUDIO, VIDEO, GIF
    const durationInput = formData.get("duration");
    const chromaKey = formData.get("chromaKey") === "true";
    const chromaColor = formData.get("chromaColor") as string || "#00ff00";
    const exitAnimation = formData.get("exitAnimation") as string || "fade";
    
    if (!file || !name || !type) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    let finalDuration: number | null = null;
    if (durationInput && durationInput !== "null" && durationInput !== "0") {
      const parsedDuration = parseInt(durationInput as string);
      
      if (!isNaN(parsedDuration)) {
        // Clamp audio duration to 30s max
        finalDuration = type === "AUDIO" ? Math.min(parsedDuration, 30) : parsedDuration;
      }
    }
    
    // Save File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure dir exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/${fileName}`;

    // Save to DB
    const asset = await prisma.asset.create({
      data: {
        name,
        type,
        path: publicPath,
        userId: userId,
        scale: 1.0,
        duration: finalDuration,
        volume: 1.0,
        exitAnimation: exitAnimation,
        chromaKey: chromaKey,
        chromaColor: chromaColor,
      },
    });

    return NextResponse.json(asset);
  } catch (error: any) {
    console.error("[ASSET_UPLOAD] Detailed Error:", {
      message: error.message,
      stack: error.stack,
      prismaError: error.code
    });
    return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
  }
}
