import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { SignatureDialog } from "./_components/signature-dialog";
import { SignatureList } from "./_components/signature-list";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservationDetailPage({ params }: PageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user || !session.user.isAdmin) {
    redirect("/");
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: {
      user: true,
      signedAgreement: true,
    },
  });

  if (!reservation) {
    redirect("/admin/reservations");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">예약 상세</h1>
        <SignatureDialog reservationId={id} userName={reservation.user.name} />
      </div>
      <SignatureList signatures={reservation.signedAgreement} />
    </main>
  );
}
