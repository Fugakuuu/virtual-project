export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@supabase/supabase-js";

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
    
    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    
    // Initialize Supabase Admin Client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not found in environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('assets')
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('assets')
      .getPublicUrl(fileName);

    const publicPath = publicUrlData.publicUrl;

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

