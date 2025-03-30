"use client";

import { useState } from "react";
import { RocketIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedContainer } from "./animated-container";
import Image from "next/image";

export default function Component() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatedContainer
      animation="fade"
      duration={0.5}
      className="dark bg-muted text-foreground px-4 py-3"
    >
      <div className="flex gap-2 md:items-center">
        <div className="flex grow gap-3 md:items-center">
          <div
            className="bg-primary/15 flex size-9 shrink-0 items-center justify-center rounded-full max-md:mt-0.5"
            aria-hidden="true"
          >
            <RocketIcon className="opacity-80" size={16} />
          </div>
          <div className="flex grow flex-col justify-between gap-3 md:flex-row md:items-center">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                We're live on Peerlist LaunchPad! 🎉
              </p>
              <p className="text-muted-foreground text-sm">
                Give us a vote and help us reach more people!
              </p>
            </div>
            <div className="flex gap-2 max-md:flex-wrap">
              <Button
                variant={"outline"}
                size="sm"
                className=" text-sm flex items-center gap-2"
                onClick={() =>
                  window.open(
                    "https://peerlist.io/surydev/project/eisenflow",
                    "_blank"
                  )
                }
              >
                <Image
                  src="/peerlist.svg"
                  alt="Peerlist"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                />
                Upvote on Peerlist
              </Button>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => setIsVisible(false)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </AnimatedContainer>
  );
}
