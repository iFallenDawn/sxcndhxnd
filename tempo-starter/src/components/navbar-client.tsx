"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface NavbarClientProps {
  user: User | null;
  children?: React.ReactNode;
}

export default function NavbarClient({ user, children }: NavbarClientProps) {
  const pathname = usePathname();
  
  // Pages with dark backgrounds where navbar should be light
  const darkBackgroundPages = ["/"];
  const isDarkBackground = darkBackgroundPages.includes(pathname);
  
  const navColorClasses = isDarkBackground
    ? {
        bg: "bg-transparent backdrop-blur-sm",
        text: "text-white hover:text-gray-200",
        textHover: "text-white hover:text-gray-300",
        buttonBg: "text-black bg-white hover:bg-gray-200",
      }
    : {
        bg: "bg-white/95 backdrop-blur-sm border-b border-gray-100",
        text: "text-black hover:text-gray-600",
        textHover: "text-black hover:text-gray-600",
        buttonBg: "text-white bg-black hover:bg-gray-800",
      };

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full py-4 z-50 transition-all duration-300 ${navColorClasses.bg}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className={`font-display text-2xl font-light tracking-tightest uppercase transition-colors ${navColorClasses.text}`}
        >
          sxcndhxnd
        </Link>
        <div className="flex gap-8 items-center">
          <Link
            href="/about"
            className={`text-xs font-normal tracking-wider uppercase transition-colors ${navColorClasses.textHover}`}
          >
            About
          </Link>
          <Link
            href="/gallery"
            className={`text-xs font-normal tracking-wider uppercase transition-colors ${navColorClasses.textHover}`}
          >
            Gallery
          </Link>
          <Link
            href="/commissions"
            className={`text-xs font-normal tracking-wider uppercase transition-colors ${navColorClasses.textHover}`}
          >
            Commissions
          </Link>
          <Link
            href="/store"
            className={`text-xs font-normal tracking-wider uppercase transition-colors ${navColorClasses.textHover}`}
          >
            Store
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-xs font-normal tracking-wider uppercase transition-colors ${navColorClasses.textHover}`}
              >
                Account
              </Link>
              {children}
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={`text-xs font-normal tracking-wider uppercase transition-colors ${navColorClasses.textHover}`}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={`text-xs font-medium tracking-wider uppercase px-4 py-2 transition-colors ${navColorClasses.buttonBg}`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}