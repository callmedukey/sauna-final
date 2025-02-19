"use client";

import { pdf } from "@react-pdf/renderer";
import Image from "next/image";
import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";

import { saveSignature } from "@/actions/signatures";
import { ConditionsPDF } from "@/components/pdf/ConditionsPDF";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ConditionImage from "@/public/final-condition.webp";

type Props = {
  reservationId: string;
  userName: string;
  naverReservationId: string;
};

export function SignatureDialog({
  reservationId,
  userName,
  naverReservationId,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const signaturePadRef = useRef<SignaturePad>(null);

  const handleSave = async () => {
    if (!signaturePadRef.current) return;
    if (signaturePadRef.current.isEmpty()) {
      alert("서명을 해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      const signatureData = signaturePadRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      // Generate PDF blob
      const blob = await pdf(
        <ConditionsPDF
          key={new Date().getTime()}
          signatureImage={signatureData}
          userName={userName}
        />
      ).toBlob();

      // Create FormData
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], "agreement.pdf", { type: "application/pdf" })
      );
      formData.append("reservationId", reservationId);
      formData.append("naverReservationId", naverReservationId);

      const result = await saveSignature(formData);

      if (!result.success) {
        throw new Error(result.message);
      }

      setOpen(false);
    } catch (error) {
      console.error("Error saving signature:", error);
      alert(
        error instanceof Error ? error.message : "서명 저장에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    signaturePadRef.current?.clear();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>약관 추가</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[95vh] max-w-4xl flex-col p-4">
          <DialogHeader className="flex-none px-2">
            <DialogTitle>약관 동의 및 서명</DialogTitle>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col gap-4">
            <div className="min-h-0 flex-1">
              <div className="relative size-full">
                <Image
                  src={ConditionImage}
                  alt="약관"
                  className="object-contain"
                  fill
                  sizes="(max-width: 4xl) 100vw"
                />
              </div>
            </div>

            <div className="flex h-[25vh] flex-col gap-2">
              <div className="min-h-0 flex-1 rounded-md border">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "w-full h-full",
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClear}>
                  다시 그리기
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "저장 중..." : "서명 저장"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
