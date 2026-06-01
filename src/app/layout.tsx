import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Archivo_Black, JetBrains_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NavigationWrapper } from "@/components/layout/NavigationWrapper";
import NextTopLoader from "nextjs-toploader";
import "@/styles/globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: 'swap',
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  display: 'swap',
  weight: '400',
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Virtual Stream Deck | Professional Asset Management",
  description: "The streaming engine with unlimited potential. Secure, Low-Latency, Premium.",
  icons: {
    icon: [
      { url: "/assets/favicon.ico" },
      { url: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/assets/icon-192-maskable.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#001e2b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" className="h-full scroll-smooth dark relative" data-scroll-behavior="smooth" suppressHydrationWarning>
        <body
          className={`${geist.variable} ${archivoBlack.variable} ${jetBrainsMono.variable} antialiased h-full overflow-x-hidden font-sans`}
        >
          <NextTopLoader color="#00ed64" showSpinner={false} />
          <NavigationWrapper>
            {children}
          </NavigationWrapper>
        </body>
      </html>
    </SessionProvider>
  );
}
