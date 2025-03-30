import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/shared/header";
import { Banner } from "@/components/shared/banner";

const lato = Lato({
  weight: "400",
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eisenflow",

  description: "Eisenflow is a project management tool for developers",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eisenflow",
    description: "Eisenflow is a project management tool for developers",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eisenflow",
      },
    ],
    creator: "@surydev",
  },
  openGraph: {
    title: "Eisenflow",
    description: "Eisenflow is a project management tool for developers",
    url: "https://eisenflow.surydev.site/",
    siteName: "Eisenflow",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eisenflow",
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable}  antialiased min-h-screen bg-primary/10 p-4 sm:p-8`}>
        <Toaster richColors position="top-center" />
        {/* <Banner
          title="We are live on Peerlist"
          message="Make sure to upvote us on Peerlist"
          variant="default"
        /> */}
        {children}
      </body>
    </html>
  );
}
