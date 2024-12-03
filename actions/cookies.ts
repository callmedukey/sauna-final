"use server";

import { cookies } from "next/headers";

export async function hidePopup() {
  const hideUntil = new Date();
  hideUntil.setDate(hideUntil.getDate() + 7);

  const cookiesStore = await cookies();
  cookiesStore.set("popup_hide_until", hideUntil.toISOString(), {
    expires: hideUntil,
    path: "/",
  });
}

export async function getPopupHideUntil() {
  const cookiesStore = await cookies();
  return cookiesStore.get("popup_hide_until")?.value;
}
