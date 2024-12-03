"use client";

import { Content } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ImageUploaderProps {
  currentImage: Content | null;
}

export function ImageUploader({ currentImage }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      const response = await fetch("/api/contents", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "이미지 업로드에 실패했습니다.");
      }

      router.refresh();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  }, [router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleDelete = async () => {
    if (!currentImage || !confirm("팝업 이미지를 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/contents?id=${currentImage.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "이미지 삭제에 실패했습니다.");
      }

      router.refresh();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert(error instanceof Error ? error.message : "이미지 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <p>업로드 중...</p>
            ) : isDragActive ? (
              <p>이미지를 여기에 놓아주세요</p>
            ) : (
              <p>
                이미지를 드래그하여 놓거나 클릭하여 선택해주세요
                <br />
                <span className="text-sm text-muted-foreground">
                  (PNG, JPG, GIF)
                </span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {currentImage && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="mx-auto max-w-[600px]">
                <Image
                  src={`/contents/${currentImage.path}`}
                  alt="Current popup"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isUploading}
                className="w-full"
              >
                삭제
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 