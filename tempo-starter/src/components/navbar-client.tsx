"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavbarClientProps {
  user: User | null;
  children?: React.ReactNode;
}

export default function NavbarClient({ user, children }: NavbarClientProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Update scroll state
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setHasScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);
  
  // Pages with dark backgrounds where navbar should be light
  const darkBackgroundPages = ["/"];
  const isDarkBackground = darkBackgroundPages.includes(pathname) && !hasScrolled;
  
  const navColorClasses = isDarkBackground
    ? {
        bg: "bg-transparent",
        text: "text-white hover:text-gray-300",
        textHover: "text-white hover:text-gray-300",
        buttonBg: "text-black bg-white hover:bg-gray-100",
        logoColor: "text-white",
      }
    : {
        bg: "bg-white/90 backdrop-blur-md shadow-sm",
        text: "text-gray-900 hover:text-black",
        textHover: "text-gray-900 hover:text-black",
        buttonBg: "text-white bg-black hover:bg-gray-900",
        logoColor: "text-black",
      };

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ${navColorClasses.bg}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container mx-auto px-6 md:px-8 py-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              prefetch
              className={`font-display text-2xl md:text-3xl font-extralight tracking-tight uppercase transition-all duration-300 ${navColorClasses.logoColor}`}
            >
              sxcndhxnd
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <Link
                href="/about"
                className={`text-sm font-light tracking-wide transition-all duration-300 ${navColorClasses.textHover} relative group`}
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/gallery"
                className={`text-sm font-light tracking-wide transition-all duration-300 ${navColorClasses.textHover} relative group`}
              >
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/commissions"
                className={`text-sm font-light tracking-wide transition-all duration-300 ${navColorClasses.textHover} relative group`}
              >
                Commissions
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </Link>
              
              {/* Auth Section */}
              <div className="flex items-center gap-6 ml-6">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`text-sm font-light tracking-wide transition-all duration-300 ${navColorClasses.textHover} relative group`}
                    >
                      Account
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    {children}
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className={`text-sm font-light tracking-wide transition-all duration-300 ${navColorClasses.textHover}`}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className={`text-sm font-normal tracking-wide px-6 py-3 transition-all duration-300 ${navColorClasses.buttonBg} border border-current hover:transform hover:scale-105`}
                    >
                      Join
                    </Link>
                  </>
                )}
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden ${navColorClasses.logoColor} transition-colors duration-300`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : "100%" }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white z-40 overflow-y-auto"
      >
        <div className="p-8 pt-24">
          <div className="flex flex-col gap-8">
            <Link
              href="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-light tracking-wide text-gray-900 hover:text-black transition-colors"
            >
              About
            </Link>
            <Link
              href="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-light tracking-wide text-gray-900 hover:text-black transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/commissions"
              onClick={() => setIsMenuOpen(false)}
              className="text-2xl font-light tracking-wide text-gray-900 hover:text-black transition-colors"
            >
              Commissions
            </Link>
            <div className="border-t pt-8 mt-4">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-light tracking-wide text-gray-900 hover:text-black transition-colors"
                >
                  Account
                </Link>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-2xl font-light tracking-wide text-gray-900 hover:text-black transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block text-center text-lg font-normal tracking-wide px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}