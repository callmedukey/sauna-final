"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import {
  AfterAuthLinks,
  AuthLinks,
  HeaderLinks,
} from "@/definitions/constants";
import { cn } from "@/lib/utils";
import HeaderLogo from "@/public/header/header-logo.svg";

import CommunityDropdown from "./CommunityDropdown";
import LoginModal from "./LoginModal";
import { useLoginRegister } from "./LoginRegisterProvider";
import MobileMenu from "./MobileMenu";
import RegisterModal from "./RegisterModal";

const Header = () => {
  const pathname = usePathname();
  const { loginOpen, setLoginOpen, registerOpen, setRegisterOpen } =
    useLoginRegister();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const session = useSession();

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // scrolling down
        setIsVisible(false);
      } else {
        // scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlHeader);

    // cleanup function
    return () => {
      window.removeEventListener("scroll", controlHeader);
    };
  }, [lastScrollY]);

  return (
    <>
      <header
        className={cn(
          "bg-siteBgGray fixed w-full transition-transform duration-300 isolate",
          pathname === "/" &&
            isVisible &&
            "top-0 left-0 right-0 z-50 bg-transparent",
          isVisible &&
            pathname !== "/" &&
            "translate-y-0 z-50 bg-siteBgGray top-0 left-0 right-0 ",
          !isVisible && "-translate-y-full"
        )}
      >
        <div
          className={cn(
            "flex-all-center relative isolate mx-auto max-w-screen-xl px-4 py-2 text-white xl:h-24 xl:py-0",
            pathname !== "/" && "text-siteBlack"
          )}
        >
          <Link href="/" className="left-0 ml-0 mr-auto xl:absolute">
            <Image
              src={HeaderLogo}
              alt="Header Logo"
              width={66}
              height={77}
              priority
              className={cn("w-12", pathname === "/" ? "invert" : "invert-0")}
            />
            <span className="sr-only">홈</span>
          </Link>
          <nav className="hidden items-center gap-14 xl:flex">
            {HeaderLinks.map((link) => {
              if (link.href === "/community") {
                return <CommunityDropdown key={link.href} />;
              }

              if (link.href === "/account/reservation") {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      if (!session || !session.data?.user) {
                        e.preventDefault();
                        setLoginOpen(true);
                      }
                    }}
                    className={cn(
                      link.href === pathname &&
                        "underline underline-offset-4 font-bold"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(

                    link.href === pathname &&
                      "underline underline-offset-4 font-bold"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <nav
            className={cn(
              "absolute right-0 hidden items-center divide-x-2 divide-white xl:flex [&>button]:px-4 [&>a]:px-4",
              pathname !== "/" && "divide-siteBlack"
            )}
          >
            {session &&
            session.status === "authenticated" &&
            session?.data?.user
              ? AfterAuthLinks.map((link) => {
                  if (link.href === "/logout") {
                    return (
                      <button
                        key={link.href}
                        className="hover:underline"
                        type="button"
                        onClick={async () => {
                          await signOut({ redirectTo: "/" });
                        }}
                      >
                        {link.label}
                      </button>
                    );
                  }
                  return (
                    <Link
                      key={link.href}
                      href={
                        session.data.user.isAdmin && link.href === "/account"
                          ? "/admin/reservations"
                          : link.href
                      }
                      className="transition-all duration-300 hover:underline"
                    >
                      {link.label}
                    </Link>
                  );
                })
              : AuthLinks.map((link) => (
                  <button
                    key={link.href}
                    className="hover:underline"
                    type="button"
                    onClick={() => {
                      if (link.href === "/login") {
                        setLoginOpen(true);
                        setRegisterOpen(false);
                      } else if (link.href === "/signup") {
                        setRegisterOpen(true);
                        setLoginOpen(false);
                      }
                    }}
                  >
                    {link.label}
                  </button>
                ))}
          </nav>
          <MobileMenu
            setLoginOpen={setLoginOpen}
            setRegisterOpen={setRegisterOpen}
          />
        </div>
      </header>
      <LoginModal
        isOpen={loginOpen}
        setIsOpen={setLoginOpen}
        setIsRegisterOpen={setRegisterOpen}
      />
      <RegisterModal
        isOpen={registerOpen}
        setIsOpen={setRegisterOpen}
        setLoginOpen={setLoginOpen}
      />
    </>
  );
};

export default Header;
