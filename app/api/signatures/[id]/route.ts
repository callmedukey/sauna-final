import { readFile, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  
  try {
    const session = await auth();
    if (!session?.user || !session.user.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const signature = await prisma.signedAgreement.findUnique({
      where: { id },
    });

    if (!signature) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const filePath = path.join(process.cwd(), "admin/signatures", signature.path);
    const file = await readFile(filePath);

    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="agreement-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error downloading signature:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  
  try {
    const session = await auth();
    if (!session?.user || !session.user.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const signature = await prisma.signedAgreement.findUnique({
      where: { id },
    });

    if (!signature) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete file
    const filePath = path.join(process.cwd(), "admin/signatures", signature.path);
    await unlink(filePath);

    // Delete from database
    await prisma.signedAgreement.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting signature:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 