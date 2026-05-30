import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("Missing file", { status: 400 });
    }

    // Save File
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split(".").pop();
    const fileName = `avatar-${uuidv4()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
    
    // Ensure dir exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicPath = `/uploads/avatars/${fileName}`;

    return NextResponse.json({ url: publicPath });
  } catch (error) {
    console.error("[AVATAR_UPLOAD]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
