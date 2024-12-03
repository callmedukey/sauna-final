import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SignatureDialog } from "./_components/signature-dialog";
import { SignatureList } from "./_components/signature-list";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReservationDetailPage({ params }: PageProps) {
  const session = await auth();
  const paramsAwaited = await params;
  const { id } = paramsAwaited;

  if (!session?.user?.isAdmin) {
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
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold mb-2">예약자명</h2>
          <p>{reservation.user.name}</p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">예약일시</h2>
          <p>
            {reservation.date} {reservation.time}
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">인원</h2>
          <p>
            {reservation.men > 0 && `남자 ${reservation.men}명 `}
            {reservation.women > 0 && `여자 ${reservation.women}명 `}
            {reservation.children > 0 && `어린이 ${reservation.children}명 `}
            {reservation.infants > 0 && `유아 ${reservation.infants}명`}
          </p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">요금</h2>
          <p>{reservation.price.toLocaleString()}원</p>
        </div>
        {reservation.message && (
          <div>
            <h2 className="font-semibold mb-2">메시지</h2>
            <p>{reservation.message}</p>
          </div>
        )}
      </div>
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">서명 내역</h2>
        <SignatureList signatures={reservation.signedAgreement} />
      </div>
    </main>
  );
}
