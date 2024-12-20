import { redirect } from "next/navigation";

import { auth } from "@/auth";

const page = async () => {
  const session = await auth();
  if (!session || !session?.user) {
    redirect("/sign-in");
  }
  redirect("/account/profile");

  // return (
  //   <main className="px-4 ~pb-[4rem]/[6rem]">
  //     <aside className="mx-auto grid max-w-screen-lg grid-cols-2 place-items-center items-center justify-center gap-y-3.5 font-normal ~text-[1.25rem]/[1.5rem] ~mb-[2rem]/[4rem] ~gap-x-[5.625rem]/[6.25rem] lg:flex">
  //       <Link
  //         href="/account/profile"
  //         className={cn("hover:motion-preset-shake")}
  //       >
  //         계정 정보
  //       </Link>
  //       <Link
  //         href="/account/reservation"
  //         className={cn("hover:motion-preset-shake")}
  //       >
  //         예약 하기
  //       </Link>
  //       <Link
  //         href="/account/profile"
  //         className={cn("hover:motion-preset-shake")}
  //       >
  //         예약 내역
  //       </Link>
  //       <Link href="/account/point" className={cn("hover:motion-preset-shake")}>
  //         포인트
  //       </Link>
  //     </aside>
  //     <article className="mx-auto max-w-screen-md">
  //       <Skeleton className="min-h-[min(60vh,40rem)] rounded-lg" />
  //     </article>
  //   </main>
  // );
};

export default page;
