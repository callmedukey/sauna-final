import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { sendVerificationEmail } from "@/actions/emails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoginSchema, RecoverAccountSchema } from "@/definitions/zod";

import { Button } from "../ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "../ui/form";

const LoginContent = ({
  form,
  setRecover,
  setIsRegisterOpen,
  setIsOpen,
}: {
  form: UseFormReturn<z.infer<typeof LoginSchema>>;
  setRecover: (isRecover: boolean) => void;
  setIsRegisterOpen: (isRegisterOpen: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const handleLogin = async (data: z.infer<typeof LoginSchema>) => {
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: "/",
      redirect: false,
    });

    if (response?.error) {
      alert(response.error);
    } else {
      setIsOpen(false);
    }
  };
  return (
    <DialogContent
      overlayClassName="bg-transparent opacity-100"
      className="mx-auto w-full min-w-0 max-w-[95%] rounded-3xl ~px-[2.8125rem]/[3.75rem] ~py-[1.875rem]/[4rem] sm:max-w-[35rem]"
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
        <form
          className="flex flex-col ~gap-y-[1.875rem]/[3.75rem]"
          onSubmit={form.handleSubmit(handleLogin)}
        >
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
                    className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
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
                    className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
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
          <button
            className="text-xs text-siteBlack underline underline-offset-4 lg:!-mt-6 lg:self-start"
            type="button"
            onClick={() => setRecover(true)}
          >
            비밀번호 찾기
          </button>

          <Button
            variant={"ringHover"}
            type="submit"
            className="mx-auto w-full rounded-full bg-siteBgGray py-8 text-base text-siteBlack hover:text-white lg:max-w-[11.875rem]"
          >
            로그인
          </Button>
          <p className="mx-auto flex gap-1 text-center text-base text-siteTextGray3">
            계정이 없나요?
            <button
              className="underline underline-offset-4"
              type="button"
              onClick={() => {
                setRecover(false);
                setIsRegisterOpen(true);
                setIsOpen(false);
              }}
            >
              회원가입
            </button>
          </p>
        </form>
      </Form>
    </DialogContent>
  );
};

const RecoverContent = ({
  setRecover,
}: {
  setRecover: (isRecover: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof RecoverAccountSchema>>({
    resolver: zodResolver(RecoverAccountSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof RecoverAccountSchema>) => {
    const response = await sendVerificationEmail(data.email);
    if (response?.message) {
      alert(response.message);
    }
  };

  return (
    <DialogContent
      overlayClassName="bg-transparent opacity-100"
      className="mx-auto w-full min-w-0 max-w-[95%] rounded-3xl ~px-[2.8125rem]/[3.75rem] ~py-[1.875rem]/[4rem] sm:max-w-[35rem]"
    >
      <button
        className="absolute left-4 top-4"
        type="button"
        onClick={() => setRecover(false)}
      >
        <ArrowLeftIcon />
      </button>
      <DialogHeader>
        <DialogTitle className="text-center font-normal ~text-base/xl ~mb-[1.875rem]/[3rem]">
          계정 이메일을 입력해주세요
        </DialogTitle>
        <DialogDescription className="sr-only">
          계정 이메일을 입력해주세요
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col ~gap-y-[1.875rem]/[3.75rem]"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
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
                    className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
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

          <Button
            variant={"ringHover"}
            type="submit"
            className="mx-auto w-full rounded-full bg-siteBgGray py-8 text-base text-siteBlack hover:text-white lg:max-w-[11.875rem]"
          >
            인증 이메일 받기
          </Button>
        </form>
      </Form>
    </DialogContent>
  );
};

const LoginModal = ({
  isOpen,
  setIsOpen,
  setIsRegisterOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsRegisterOpen: (isRegisterOpen: boolean) => void;
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
      {isRecover ? (
        <RecoverContent setRecover={setIsRecover} />
      ) : (
        <LoginContent
          form={form}
          setRecover={setIsRecover}
          setIsRegisterOpen={setIsRegisterOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </Dialog>
  );
};

export default LoginModal;
