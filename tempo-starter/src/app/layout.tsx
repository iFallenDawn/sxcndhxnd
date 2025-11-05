import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/providers/tempo-init";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ChakraUIProvider } from "@/components/providers/chakra-provider";
import { BodyClassManager } from "@/components/ui/body-class-manager";
import Footer from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Sxcndhxnd",
  description: "Giving second life to forgotten garments",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Commented out due to SSL protocol error - replace with local script if needed */}
      {/* <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" /> */}
      <body
        className={`${inter.className} ${inter.variable} ${spaceGrotesk.variable}`}
        suppressHydrationWarning
      >
        <BodyClassManager className={inter.className} />
        <ChakraUIProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </ChakraUIProvider>
        <TempoInit />
      </body>
    </html>
  );
}
