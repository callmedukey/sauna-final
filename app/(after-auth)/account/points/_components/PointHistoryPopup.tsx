import { User } from "next-auth";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

import PointCheckout from "./PointCheckout";

const PointHistoryPopup = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: Omit<User, "password"> & {
    point?: number | null | undefined;
  };
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-siteBlack !p-0 xl:w-fit">
        <DialogHeader>
          <DialogTitle className="sr-only">포인트 충전</DialogTitle>
          <DialogDescription className="sr-only">포인트 충전</DialogDescription>
        </DialogHeader>
        <div className="mx-0 w-auto max-w-2xl bg-white">
          <article className="mx-auto min-h-[min(60vh,40rem)] max-w-[29rem] ~px-[1.5625rem]/[3.625rem] ~py-[1.875rem]/[2.8125rem]">
            <div className="mx-auto max-w-60 border-b border-siteBlack pb-2.5 ~mb-[1.875rem]/[2.8125rem]">
              <h1 className="text-center font-bold ~text-xs/base">
                보유 포인트
              </h1>
              <p className="text-center font-bold ~text-base/[1.875rem]">
                {user.point?.toLocaleString() ?? "0"}P
              </p>
            </div>
            <h2 className="text-center font-bold ~text-xs/base">
              포인트 충전하기
            </h2>
            <PointCheckout />
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PointHistoryPopup;
