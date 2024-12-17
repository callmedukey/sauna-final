"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useWarning } from "./WarningProvider";

const WarningDialog = () => {
  const { warningOpen, setWarningOpen } = useWarning();
  return (
    <Dialog open={warningOpen} onOpenChange={setWarningOpen}>
      <DialogContent className="3xl:max-w-screen-2xl max-h-[min(80vh,60rem)] max-w-[90%] overflow-y-auto rounded-lg ~px-4/8">
        <DialogHeader>
          <DialogTitle className="w-full text-center text-2xl font-bold">
            주의사항
          </DialogTitle>
          <DialogDescription className="sr-only">
            주의사항 내용
          </DialogDescription>
        </DialogHeader>
        <div className="">Insert Here</div>
      </DialogContent>
    </Dialog>
  );
};

export default WarningDialog;
