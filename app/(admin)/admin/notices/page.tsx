import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { NoticesTable } from "./_components/notices-table";
import { CreateNoticeButton } from "./_components/create-notice-button";

export default async function NoticesPage() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const notices = await prisma.notice.findMany({
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <CreateNoticeButton />
      </div>
      <NoticesTable notices={notices} />
    </div>
  );
} 