import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import Banner from "@/components/shared/banner";

const lato = Lato({
  weight: "400",
  variable: "--font-lato",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eisenflow",

  description: "AI-powered task categorization based on the Eisenhower Matrix. Prioritize tasks efficiently and focus on what truly matters.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eisenflow",
    description: "AI-powered task categorization based on the Eisenhower Matrix. Prioritize tasks efficiently and focus on what truly matters.",
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
    description: "AI-powered task categorization based on the Eisenhower Matrix. Prioritize tasks efficiently and focus on what truly matters.",
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
      <body className={`${lato.variable}  antialiased bg-background`}>
        <Toaster richColors position="top-center" />
        <Banner
          
        />
        {children}
      </body>
     
    </html>
  );
}
