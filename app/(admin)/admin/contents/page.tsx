import { redirect } from "next/navigation";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ContentType } from "@prisma/client";

import { ImageUploader } from "./_components/image-uploader";

export default async function ContentsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const popupImage = await prisma.content.findFirst({
    where: { type: ContentType.POPUP },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">팝업 이미지 관리</h1>
        </div>
      </div>
      <ImageUploader currentImage={popupImage} />
    </main>
  );
} 