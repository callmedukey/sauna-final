import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { SignatureDialog } from "./_components/signature-dialog";
import { SignatureList } from "../../reservations/[id]/_components/signature-list";

interface PageProps {
  params: { id: string };
}

export default async function NaverReservationDetailPage({ params }: PageProps) {
  const { id } = params;

  const reservation = await prisma.naverReservation.findUnique({
    where: { id },
    include: {
      signedAgreement: true,
    },
  });

  if (!reservation) {
    redirect("/admin/naver");
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">예약 상세</h1>
        <SignatureDialog
          reservationId={id}
          userName={reservation.name}
          naverReservationId={reservation.id}
        />
      </div>
      <SignatureList signatures={reservation.signedAgreement} />
    </main>
  );
} 