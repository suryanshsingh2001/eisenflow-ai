"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navigation = [
  { name: "Matrix", href: "/" },
  { name: "About", href: "/about" },
  { name: "GitHub", href: "https://github.com/yourusername/ai-productivity" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm container flex h-16 items-center max-w-3xl mx-auto">
      <div className="mr-4 hidden md:flex">
        <Link
          href="/"
          className="mr-8 flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
            <Image src="/logo.svg" alt="AI Productivity" width={24} height={24} />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI Productivity
          </span>
        </Link>
        <nav className="flex items-center space-x-8 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "transition-all hover:text-primary hover:scale-105 text-foreground/70"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <Sheet>
        <SheetTrigger asChild className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 hover:bg-primary/10"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Productivity
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-all hover:text-primary hover:translate-x-1"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
        <div className="w-full flex-1 md:w-auto md:flex-none">
          <Button
            variant="default"
            className="ml-auto hidden md:flex hover:scale-105 transition-transform bg-gradient-to-r from-primary to-primary/80"
          >
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
