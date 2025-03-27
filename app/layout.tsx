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
