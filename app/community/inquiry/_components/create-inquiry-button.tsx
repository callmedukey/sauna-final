"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PenSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry } from "../_actions";

const formSchema = z.object({
  title: z.string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자를 초과할 수 없습니다"),
  content: z.string()
    .min(1, "내용을 입력해주세요")
    .max(1000, "내용은 1000자를 초과할 수 없습니다"),
});

export function CreateInquiryButton() {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createInquiry(values);
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <PenSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-xl p-0">
        <div className="border-b border-gray-200 bg-gray-50 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              문의하기
            </DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="문의 제목" 
                          maxLength={100}
                          {...field} 
                        />
                        <div className="absolute right-0 top-0 -translate-y-6 text-sm text-gray-500">
                          {field.value.length}/100
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>내용</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="문의 내용"
                          className="min-h-[300px] resize-none"
                          maxLength={1000}
                          {...field}
                        />
                        <div className="absolute right-0 top-0 -translate-y-6 text-sm text-gray-500">
                          {field.value.length}/1000
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit">작성하기</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 