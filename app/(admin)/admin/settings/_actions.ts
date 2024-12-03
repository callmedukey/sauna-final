"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSpecialDate({
  date,
  type,
  discount,
}: {
  date: string;
  type: "BLOCKED" | "DISCOUNT";
  discount: number | null;
}) {
  console.log('Received date in action:', date);
  
  await prisma.specialDate.create({
    data: {
      date,
      type,
      discount,
    },
  });
  revalidatePath("/admin/settings");
}

export async function getSpecialDates() {
  const dates = await prisma.specialDate.findMany({
    orderBy: {
      date: "asc",
    },
  });

  console.log('Dates from database:', dates);
  
  const formattedDates = dates.map(date => ({
    ...date,
    date: date.date.replace(/-/g, '/')
  }));

  console.log('Formatted dates:', formattedDates);
  
  return formattedDates;
}

export async function deleteSpecialDate(id: string) {
  await prisma.specialDate.delete({
    where: { id },
  });
  revalidatePath("/admin/settings");
}
