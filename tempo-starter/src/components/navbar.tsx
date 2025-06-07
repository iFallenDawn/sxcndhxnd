import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "@chakra-ui/react";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-xl font-light tracking-wide uppercase"
        >
          sxcndhxnd
        </Link>
        <div className="flex gap-8 items-center">
          <Link
            href="/about"
            className="text-sm font-light tracking-wide uppercase hover:text-gray-600 transition-colors"
          >
            About
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-light tracking-wide uppercase hover:text-gray-600 transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/commissions"
            className="text-sm font-light tracking-wide uppercase hover:text-gray-600 transition-colors"
          >
            Commissions
          </Link>
          <Link
            href="/store"
            className="text-sm font-light tracking-wide uppercase hover:text-gray-600 transition-colors"
          >
            Store
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-light tracking-wide uppercase hover:text-gray-600 transition-colors"
              >
                Account
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-light tracking-wide uppercase hover:text-gray-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-light tracking-wide uppercase text-white bg-black px-4 py-2 hover:bg-gray-800 transition-colors"
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
