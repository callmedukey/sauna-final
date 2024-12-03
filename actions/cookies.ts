"use server";

import { cookies } from "next/headers";

export async function setPopupHideUntil() {
  const hideUntil = new Date();
  hideUntil.setDate(hideUntil.getDate() + 7);
  
  cookies().set("popup_hide_until", hideUntil.toISOString(), {
    expires: hideUntil,
    path: "/",
  });
}

export async function getPopupHideUntil() {
  const cookieStore = await cookies();
  return cookieStore.get("popup_hide_until")?.value;
} 