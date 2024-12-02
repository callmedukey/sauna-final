import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import React, { useEffect, useRef, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { isValid, z } from "zod";

import { signUpUser } from "@/actions/auth";
import { sendVerificationSMS } from "@/actions/emails";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RegisterSchema } from "@/definitions/zod";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "../ui/form";

const FirstScreen = ({
  form,
  setScreen,
  setLoginOpen,
  setIsOpen,
}: {
  form: UseFormReturn<z.infer<typeof RegisterSchema>>;
  setScreen: (screen: 1 | 2) => void;
  setLoginOpen: (isLoginOpen: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const email = form.watch("email");
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const isValid =
    email && password && confirmPassword && password === confirmPassword;

  const handleNext = async () => {
    if (!isValid) return;

    const emailResult = await form.trigger("email", { shouldFocus: true });
    if (!emailResult) return;
    const confirmPasswordResult = await form.trigger("confirmPassword", {
      shouldFocus: true,
    });
    if (!confirmPasswordResult) return;
    const passwordResult = await form.trigger("password", {
      shouldFocus: true,
    });
    if (!passwordResult) return;

    setScreen(2);
  };

  return (
    <DialogContent
      overlayClassName="bg-transparent opacity-100"
      className="mx-auto w-full min-w-0 max-w-[95%] rounded-3xl ~px-[2.8125rem]/[3.75rem] ~py-[1.875rem]/[4rem] sm:max-w-[35rem]"
    >
      <DialogHeader>
        <DialogTitle className="text-center font-normal ~text-base/xl ~mb-[1.875rem]/[3rem]">
          회원가입
        </DialogTitle>
        <DialogDescription className="sr-only">회원가입</DialogDescription>
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
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">비밀번호 확인</FormLabel>
                <FormControl>
                  <input
                    placeholder="비밀번호 확인"
                    type="password"
                    className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  비밀번호를 한번 더 입력해주세요
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            variant={"ringHover"}
            type="button"
            disabled={!isValid}
            className="mx-auto w-full rounded-full bg-siteBgGray py-8 text-base text-siteBlack hover:text-white lg:max-w-60"
            onClick={handleNext}
          >
            다음
          </Button>
          <p className="mx-auto flex gap-1 text-center text-base text-siteTextGray3">
            벌써 회원가입하셨나요?
            <button
              className="underline underline-offset-4"
              type="button"
              onClick={() => {
                setScreen(1);
                setIsOpen(false);
                setLoginOpen(true);
              }}
            >
              로그인하기
            </button>
          </p>
        </form>
      </Form>
    </DialogContent>
  );
};

const SecondScreen = ({
  setScreen,
  setIsOpen,
  setLoginOpen,
  form,
}: {
  setScreen: (screen: 1 | 2) => void;
  setIsOpen: (isOpen: boolean) => void;
  setLoginOpen: (isLoginOpen: boolean) => void;
  form: UseFormReturn<z.infer<typeof RegisterSchema>>;
}) => {
  const [validated, setValidated] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const timer = useRef<NodeJS.Timeout>();
  const [conditionsAgreed, setConditionsAgreed] = useState(false);
  const phone = form.watch("phone");

  useEffect(() => {
    setValidated(false);
  }, [phone]);

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      setSmsSent(false);
    }, 10000);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [smsSent]);

  const handleSendVerificationSMS = async () => {
    if (phone.length !== 13) return;
    if (smsSent) return;
    setSmsSent(true);
    setValidated(false);
    const res = await sendVerificationSMS(phone);
    if (res?.success) {
      setValidated(true);
      setSmsSent(true);
      return;
    }
    if (res?.message) {
      alert(res.message);
      setValidated(false);
    }
  };

  const handleSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    if (!conditionsAgreed) {
      alert("이용 약관에 동의해주세요");
      return;
    }

    if (!validated) {
      alert("인증 번호를 확인해주세요");
      return;
    }

    const res = await signUpUser(data);
    if (res?.success) {
      alert("회원가입이 완료되었습니다");
      setScreen(1);
      setIsOpen(false);
      setLoginOpen(true);
      return;
    }
    if (res?.message) {
      alert(res.message);
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
        onClick={() => {
          setScreen(1);
        }}
      >
        <ArrowLeftIcon />
      </button>
      <DialogHeader>
        <DialogTitle className="text-center font-normal ~text-base/xl ~mb-[1.875rem]/[3rem]">
          회원가입
        </DialogTitle>
        <DialogDescription className="sr-only">회원가입</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          className="flex flex-col ~gap-y-[1.875rem]/[3.75rem]"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">이름</FormLabel>
                <FormControl>
                  <input
                    placeholder="이름"
                    type="text"
                    className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  이름을 입력해주세요
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="sr-only">전화번호</FormLabel>
                <div className="relative isolate flex items-center">
                  <FormControl>
                    <input
                      placeholder="전화번호"
                      type="tel"
                      className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                      {...field}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/[^0-9]/g, "");
                        if (numbers.length <= 11) {
                          let formatted = numbers;
                          if (numbers.length >= 3) {
                            formatted =
                              numbers.slice(0, 3) + "-" + numbers.slice(3);
                          }
                          if (numbers.length >= 7) {
                            formatted =
                              formatted.slice(0, 8) + "-" + formatted.slice(8);
                          }
                          e.target.value = formatted;
                          field.onChange(e);
                        }
                      }}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute bottom-1 cursor-pointer bg-siteBgGray ~text-xs/base ~right-1/2 ~px-[0.625rem]/[1rem] ~py-[0.3125rem]/[0.5rem] disabled:cursor-not-allowed disabled:bg-siteBgGray/50 disabled:opacity-50"
                    onClick={handleSendVerificationSMS}
                    disabled={smsSent || phone.length !== 13}
                  >
                    {smsSent ? "발송 완료" : "인증 받기"}
                  </button>
                </div>
                <FormDescription className="sr-only">
                  전화번호를 입력해주세요
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">인증 번호</FormLabel>
                <FormControl>
                  <input
                    placeholder="인증 번호"
                    type="text"
                    className="w-full border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  인증 번호를 입력해주세요
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset className="flex items-center gap-2">
            <Checkbox
              id="conditions"
              className="size-3 rounded-none border-siteTextGray"
              checked={conditionsAgreed}
              onCheckedChange={() => setConditionsAgreed(!conditionsAgreed)}
            />
            <label htmlFor="conditions" className="text-xs">
              이용 약관 동의
            </label>
          </fieldset>
          <Button
            variant={"ringHover"}
            type="submit"
            disabled={!isValid}
            className="mx-auto w-full rounded-full bg-siteBgGray py-8 text-base text-siteBlack hover:text-white lg:max-w-60"
          >
            완료
          </Button>
          <p className="mx-auto flex gap-1 text-center text-base text-siteTextGray3">
            벌써 회원가입하셨나요?
            <button
              className="underline underline-offset-4"
              type="button"
              onClick={() => {
                setScreen(1);
                setIsOpen(false);
                setLoginOpen(true);
              }}
            >
              로그인하기
            </button>
          </p>
        </form>
      </Form>
    </DialogContent>
  );
};

const RegisterModal = ({
  isOpen,
  setIsOpen,
  setLoginOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setLoginOpen: (isLoginOpen: boolean) => void;
}) => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      verificationCode: "",
    },
  });

  const [screen, setScreen] = useState<1 | 2>(1);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {screen === 1 ? (
        <FirstScreen
          form={form}
          setScreen={setScreen}
          setLoginOpen={setLoginOpen}
          setIsOpen={setIsOpen}
        />
      ) : (
        <SecondScreen
          form={form}
          setScreen={setScreen}
          setIsOpen={setIsOpen}
          setLoginOpen={setLoginOpen}
        />
      )}
    </Dialog>
  );
};

export default RegisterModal;
