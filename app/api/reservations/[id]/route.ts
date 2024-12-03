import { unlink } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !session.user.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const paramsAwaited = await params;
    const { id } = paramsAwaited;

    // Get the reservation with its signatures
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        signedAgreement: true,
      },
    });

    if (!reservation) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Delete all signature files and database records
    for (const signature of reservation.signedAgreement) {
      const filePath = path.join(
        process.cwd(),
        "admin/signatures",
        signature.path
      );
      try {
        await unlink(filePath);
      } catch (error) {
        console.error(
          `Error deleting signature file: ${signature.path}`,
          error
        );
      }
    }

    // Update reservation and delete signatures in a transaction
    await prisma.$transaction([
      prisma.signedAgreement.deleteMany({
        where: { reservationId: id },
      }),
      prisma.reservation.update({
        where: { id },
        data: { canceled: true },
      }),
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error canceling reservation:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
