"use client";

import { SignedAgreement } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

interface Props {
  signatures: SignedAgreement[];
}

export function SignatureList({ signatures }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async (id: string) => {
    try {
      const response = await fetch(`/api/signatures/${id}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `agreement-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading signature:', error);
      alert('서명 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (signatureId: string) => {
    if (!confirm("서명을 삭제하시겠습니까?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/signatures/${signatureId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete signature");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting signature:", error);
      alert("서명 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">서명된 약관</h2>
      {signatures.length === 0 ? (
        <p className="text-muted-foreground">해당 예약에 대한 서명이 없습니다</p>
      ) : (
        <ul className="divide-y">
          {signatures.map((signature) => (
            <li key={signature.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium">
                  서명된 날짜: {format(new Date(signature.createdAt), "yyyy/MM/dd")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleDownload(signature.id)}
                  variant="outline"
                >
                  다운로드
                </Button>
                <Button
                  onClick={() => handleDelete(signature.id)}
                  variant="outline"
                  className="text-red-500 hover:text-red-700"
                  disabled={isDeleting}
                >
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
