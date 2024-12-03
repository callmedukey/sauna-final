"use client";

import { Content } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

import { hidePopup } from "@/actions/cookies";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PopupDialogProps {
  content: Content | null;
  hideUntil: string | undefined;
}

export function PopupDialog({ content, hideUntil }: PopupDialogProps) {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!content) return;

    // Check if popup should be hidden
    if (hideUntil) {
      const hideUntilDate = new Date(hideUntil);
      if (hideUntilDate > new Date()) {
        return;
      }
    }

    setOpen(true);
  }, [content, hideUntil]);

  const handleClose = async () => {
    if (dontShowAgain) {
      await hidePopup();
    }
    setOpen(false);
  };

  if (!content) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">공지사항</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full">
          <Image
            src={`/contents/${content.path}`}
            alt="Popup"
            width={600}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
        <DialogFooter className="flex-row items-center justify-between px-2 py-1.5 border-t min-h-[32px]">
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                setDontShowAgain(checked as boolean)
              }
              className="h-3.5 w-3.5"
            />
            <label
              htmlFor="dont-show"
              className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              7일 동안 보지 않기
            </label>
          </div>
          <Button
            onClick={handleClose}
            size="sm"
            variant="ghost"
            className="h-6 px-2"
          >
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
