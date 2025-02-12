"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomInfo } from "@/definitions/constants";

import { createNaverReservation } from "../_actions";
import { NaverReservationSchema } from "../_constants";

export function CreateReservationDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof NaverReservationSchema>>({
    resolver: zodResolver(NaverReservationSchema),
    defaultValues: {
      name: "",
      date: "",
      time: "",
      reservationNumber: "",
      roomType: "WOMEN60",
    },
  });

  const onSubmit = async (values: z.infer<typeof NaverReservationSchema>) => {
    try {
      setIsLoading(true);
      await createNaverReservation(values);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert("예약 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>네이버 예약 추가</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>네이버 예약 추가</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이름</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예약자 이름" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>날짜</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 2024/01/24" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>시간</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="예: 10:00" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>예약 번호</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="네이버 예약 번호" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roomType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>객실 타입</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="객실 타입을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEN60">
                          {RoomInfo.MEN60.name}
                        </SelectItem>
                        <SelectItem value="MEN60WEEKEND">
                          {RoomInfo.MEN60.name} (주말)
                        </SelectItem>
                        <SelectItem value="MEN90">
                          {RoomInfo.MEN90.name}
                        </SelectItem>
                        <SelectItem value="MEN90WEEKEND">
                          {RoomInfo.MEN90.name} (주말)
                        </SelectItem>
                        <SelectItem value="WOMEN60">
                          {RoomInfo.WOMEN60.name}
                        </SelectItem>
                        <SelectItem value="WOMEN60WEEKEND">
                          {RoomInfo.WOMEN60.name} (주말)
                        </SelectItem>
                        <SelectItem value="WOMEN90">
                          {RoomInfo.WOMEN90.name}
                        </SelectItem>
                        <SelectItem value="WOMEN90WEEKEND">
                          {RoomInfo.WOMEN90.name} (주말)
                        </SelectItem>
                        <SelectItem value="MEN_FAMILY">
                          {RoomInfo.MEN_FAMILY.name}
                        </SelectItem>
                        <SelectItem value="MEN_FAMILYWEEKEND">
                          {RoomInfo.MEN_FAMILY.name} (주말)
                        </SelectItem>
                        <SelectItem value="WOMEN_FAMILY">
                          {RoomInfo.WOMEN_FAMILY.name}
                        </SelectItem>
                        <SelectItem value="WOMEN_FAMILYWEEKEND">
                          {RoomInfo.WOMEN_FAMILY.name} (주말)
                        </SelectItem>
                        <SelectItem value="MIX">{RoomInfo.MIX.name}</SelectItem>
                        <SelectItem value="MIXWEEKEND">
                          {RoomInfo.MIX.name} (주말)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "생성 중..." : "생성"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
