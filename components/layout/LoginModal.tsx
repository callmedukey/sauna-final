import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginSchema } from "@/definitions/zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "../ui/form";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isRecover, setIsRecover] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        overlayClassName="bg-transparent opacity-100"
        className="rounded-3xl ~px-[2.8125rem]/[3.75rem] ~py-[1.875rem]/[5rem]"
      >
        <DialogHeader>
          <DialogTitle className="text-center font-normal ~text-base/xl ~mb-[1.875rem]/[3rem]">
            로그인
          </DialogTitle>
          <DialogDescription className="sr-only">
            로그인 해주세요
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col ~gap-y-[1.875rem]/[3.75rem]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">이메일</FormLabel>
                  <FormControl>
                    <input
                      placeholder="이메일"
                      type="email"
                      className="w-full border-b font-normal text-siteTextGray2 ~text-xs/base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    이메일을 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">비밀번호</FormLabel>
                  <FormControl>
                    <input
                      placeholder="비밀번호"
                      type="password"
                      className="w-full border-b font-normal text-siteTextGray2 ~text-xs/base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    비밀번호를 입력해주세요
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
