"use client";

import { useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { pdf } from "@react-pdf/renderer";

import { saveSignature } from "@/actions/signatures";
import { Button } from "@/components/ui/button";
import { ConditionsPDF } from "@/components/pdf/ConditionsPDF";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConditionsText } from "@/components/conditions-text";

type Props = {
  reservationId: string;
  userName: string;
};

export function SignatureDialog({ reservationId, userName }: Props) {
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
        <ConditionsPDF signatureImage={signatureData} userName={userName} />
      ).toBlob();

      // Create FormData
      const formData = new FormData();
      formData.append(
        "file",
        new File([blob], "agreement.pdf", { type: "application/pdf" })
      );
      formData.append("reservationId", reservationId);

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
        <DialogContent className="max-h-screen max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>약관 동의 및 서명</DialogTitle>
          </DialogHeader>

          <div className="space-y-8">
            <div className="max-h-[40vh] overflow-y-auto rounded-md border p-4">
              <ConditionsText />
            </div>

            <div className="space-y-4">
              <div className="rounded-md border">
                <SignaturePad
                  ref={signaturePadRef}
                  canvasProps={{
                    className: "w-full h-[200px]",
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
