import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { parseRoomInfo } from "@/lib/parseRoomName";
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

  const roomInfo = parseRoomInfo(reservation.roomType);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">예약 상세</h1>
        <SignatureDialog reservationId={id} userName={reservation.user.name} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="mb-1 font-semibold">예약자명</h2>
          <p>{reservation.user.name}</p>
        </div>
        <div>
          <h2 className="mb-1 font-semibold">예약일시</h2>
          <p>
            {reservation.date} {reservation.time}
          </p>
        </div>
        <div>
          <h2 className="mb-1 font-semibold">룸 타입</h2>
          <p>{roomInfo.name}</p>
        </div>
        <div>
          <h2 className="mb-1 font-semibold">이용 시간</h2>
          <p>{roomInfo.time}분</p>
        </div>
        <div>
          <h2 className="mb-1 font-semibold">인원</h2>
          <p>
            {reservation.men > 0 && `남자 ${reservation.men}명 `}
            {reservation.women > 0 && `여자 ${reservation.women}명 `}
            {reservation.children > 0 && `어린이 ${reservation.children}명 `}
            {reservation.infants > 0 && `유아 ${reservation.infants}명`}
          </p>
        </div>
        <div>
          <h2 className="mb-1 font-semibold">요금</h2>
          <p>{reservation.price.toLocaleString()}원</p>
        </div>
        {reservation.message && (
          <div className="col-span-2">
            <h2 className="mb-1 font-semibold">메시지</h2>
            <p className="whitespace-pre-wrap">{reservation.message}</p>
          </div>
        )}
      </div>
      <div className="mt-8">
        <h2 className="mb-2 text-xl font-bold">서명 내역</h2>
        <SignatureList signatures={reservation.signedAgreement} />
      </div>
    </main>
  );
}
