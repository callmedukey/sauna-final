"use client";

import { SignedAgreement } from "@prisma/client";

interface SignatureListProps {
  signatures: SignedAgreement[];
}

export function SignatureList({ signatures }: SignatureListProps) {
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
      // Handle error (show error message to user)
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
                  서명된 날짜: {new Date(signature.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <button
                onClick={() => handleDownload(signature.id)}
                className="rounded bg-primary px-4 py-2 text-white"
              >
                다운로드
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
