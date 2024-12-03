import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await req.formData();
    const file = data.get("file") as File;
    const reservationId = data.get("reservationId") as string;

    if (!file || !reservationId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Generate unique filename
    const fileName = `${uuidv4()}.pdf`;
    const filePath = path.join(process.cwd(), "admin/signatures", fileName);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to disk
    await writeFile(filePath, buffer);

    // Save to database
    const signedAgreement = await prisma.signedAgreement.create({
      data: {
        path: fileName,
        reservation: {
          connect: { id: reservationId }
        }
      }
    });

    return NextResponse.json(signedAgreement);
  } catch (error) {
    console.error("Error saving signature:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 