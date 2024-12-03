import { writeFile, unlink, mkdir } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ContentType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { error: "이미지를 선택해주세요." },
        { status: 400 }
      );
    }

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드 가능합니다." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileName = `${uuidv4()}${path.extname(file.name)}`;
    const contentsDir = path.join(process.cwd(), "public/contents");
    const filePath = path.join(contentsDir, fileName);

    // Create contents directory if it doesn't exist
    try {
      await mkdir(contentsDir, { recursive: true });
    } catch (error) {
      console.error("Error creating directory:", error);
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Delete existing popup image if exists
    const existingContent = await prisma.content.findFirst({
      where: { type: ContentType.POPUP },
    });

    if (existingContent) {
      try {
        await unlink(
          path.join(process.cwd(), "public/contents", existingContent.path)
        );
      } catch (error) {
        console.error("Error deleting old file:", error);
      }
      await prisma.content.delete({ where: { id: existingContent.id } });
    }

    // Save new file to disk
    await writeFile(filePath, buffer);

    // Save to database
    const content = await prisma.content.create({
      data: {
        type: ContentType.POPUP,
        path: fileName,
      },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Error uploading popup image:", error);
    return NextResponse.json(
      { error: "이미지 업로드에 실패했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "이미지 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const content = await prisma.content.findUnique({
      where: { id },
    });

    if (!content) {
      return NextResponse.json(
        { error: "이미지를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      await unlink(path.join(process.cwd(), "public/contents", content.path));
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    // Delete from database
    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting popup image:", error);
    return NextResponse.json(
      { error: "이미지 삭제에 실패했습니다." },
      { status: 500 }
    );
  }
}
