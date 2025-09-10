import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

import {
  ClerkProvider,
} from '@clerk/nextjs';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vibe.juliusbiascan.me'),
  title: "Vibe - AI Website Builder",
  description: "Vibe is an AI-powered website builder that allows users to create stunning websites effortlessly using artificial intelligence.",
  keywords: "AI website builder, no-code development, website design, artificial intelligence, web development",
  authors: [{ name: "Vibe Team" }],
  openGraph: {
    title: "Vibe - AI Website Builder",
    description: "AI-powered website builder for stunning websites",
    url: "https://vibe.juliusbiascan.me",
    siteName: "Vibe",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vibe Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibe - AI Website Builder",
    description: "AI-powered website builder for stunning websites",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-16x16.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <Toaster />
              {children}
            </ThemeProvider>

          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
