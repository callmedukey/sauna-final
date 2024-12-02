"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateProfile } from "@/actions/auth";
import { sendVerificationSMS } from "@/actions/emails";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormLabel,
  FormItem,
  FormField,
  FormDescription,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { UpdateProfileSchema } from "@/definitions/zod";

const ProfileUpdateForm = ({ user }: { user: Omit<User, "password"> }) => {
  const session = useSession();
  console.log(session);
  const [smsSent, setSmsSent] = useState(false);
  const [validated, setValidated] = useState(false);
  const form = useForm<z.infer<typeof UpdateProfileSchema>>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: "",
      confirmPassword: "",
      verificationCode: "",
    },
  });

  const { phone } = form.watch();

  const handleSendVerificationSMS = async () => {
    if (phone.length !== 11) return;
    if (smsSent) return;
    setValidated(false);
    setSmsSent(true);
    const res = await sendVerificationSMS(phone);
    if (res?.success) {
      setSmsSent(true);
      setValidated(true);
      return;
    }
    if (res?.message) {
      alert(res.message);
      setValidated(false);
    }
  };

  const handleSubmit = async (data: z.infer<typeof UpdateProfileSchema>) => {
    if (!validated) {
      alert("인증 번호를 확인해주세요");
      return;
    }
    const res = await updateProfile(data);

    if (res?.success) {
      await session.update({
        data: {
          user: {
            ...session.data?.user,
            name: data.name,
            email: data.email,
            phone: data.phone,
          },
        },
      });
      alert("회원정보가 수정되었습니다");
      return;
    }
    if (res?.message) {
      alert(res.message);
    }
  };

  return (
    <Form {...form}>
      <form
        className="rounded-3xl bg-siteBgGray ~text-xs/base ~space-y-[1.875rem]/[3.5rem] ~px-[0.75rem]/[4rem] ~py-[2.5rem]/[3.875rem]"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <h1 className="text-center font-bold ~text-[1.125rem]/[1.5rem] ~mb-[1.875rem]/[4.5rem] lg:font-normal">
          나의 정보
        </h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-baseline">
              <FormLabel className="shrink-0 basis-28">이름</FormLabel>
              <FormControl>
                <input
                  placeholder="이름"
                  type="text"
                  className="w-full grow basis-2/3 border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
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
          name="email"
          render={({ field }) => (
            <FormItem className="">
              <div className="flex w-full items-baseline">
                <FormLabel className="shrink-0 basis-28">이메일</FormLabel>
                <FormControl>
                  <input
                    placeholder="이메일"
                    type="email"
                    className="w-full grow basis-2/3 border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  이메일을 입력해주세요
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="">
              <div className="">
                <div className="flex w-full items-baseline">
                  <FormLabel className="shrink-0 basis-28">전화번호</FormLabel>
                  <div className="relative isolate flex w-full items-center">
                    <FormControl>
                      <input
                        placeholder="전화번호"
                        type="tel"
                        className="w-full grow basis-2/3 border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
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
                                formatted.slice(0, 8) +
                                "-" +
                                formatted.slice(8);
                            }
                            e.target.value = formatted;
                            field.onChange(e);
                          }
                        }}
                      />
                    </FormControl>
                    <button
                      type="button"
                      className="absolute bottom-1 cursor-pointer bg-siteBgGray ~text-xs/base ~right-1/2 ~px-[0.625rem]/[1rem] ~py-[0.3125rem]/[0.5rem] disabled:cursor-not-allowed disabled:bg-siteBgGray/50"
                      onClick={handleSendVerificationSMS}
                      disabled={smsSent || phone.length !== 13}
                    >
                      {smsSent ? "발송 완료" : "인증 받기"}
                    </button>
                  </div>
                  <FormDescription className="sr-only">
                    전화번호를 입력해주세요
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="verificationCode"
          render={({ field }) => (
            <FormItem className="">
              <div className="flex w-full items-baseline">
                <FormLabel className="shrink-0 basis-28">인증 번호</FormLabel>
                <FormControl>
                  <input
                    placeholder="인증 번호"
                    type="text"
                    className="w-full grow basis-2/3 border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  인증 번호를 입력해주세요
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="">
              <div className="flex w-full items-baseline">
                <FormLabel className="shrink-0 basis-28">비밀번호</FormLabel>
                <FormControl>
                  <input
                    placeholder="비밀번호"
                    type="password"
                    className="w-full grow basis-2/3 border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  비밀번호를 입력해주세요
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="">
              <div className="flex w-full items-baseline">
                <FormLabel className="shrink-0 basis-28">
                  비밀번호 확인
                </FormLabel>
                <FormControl>
                  <input
                    placeholder="비밀번호 확인"
                    type="password"
                    className="w-full grow basis-2/3 border-b border-siteTextGray font-normal text-siteTextGray ~text-xs/base placeholder:text-siteTextGray"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="sr-only">
                  비밀번호를 한번 더 입력해주세요
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant={"ringHover"}
          type="submit"
          disabled={!form.formState.isValid}
          className="mx-auto flex w-full rounded-full bg-white py-8 text-base text-siteBlack hover:text-siteBlack lg:max-w-60"
        >
          수정 하기
        </Button>
      </form>
    </Form>
  );
};

export default ProfileUpdateForm;
