"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";

interface BannerProps {
  title?: string;
  message: string;
  variant?: "default" | "success" | "error" | "warning";
  onClose?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export function Banner({
  title,
  message,
  variant = "default",
  onClose,
  actionLabel,
  onAction,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };
  const onActionClick = () => {
    window.open("https://peerlist.com", "_blank");
  };

  return (
    <Alert
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 shadow-sm bg-card"
      )}
    >
      <div className="flex flex-col gap-1">
        {title && (
          <AlertTitle className="text-base font-semibold tracking-tight leading-6">
            {title}
          </AlertTitle>
        )}
        <AlertDescription className="text-sm font-normal leading-5 tracking-wide opacity-90">
          {message}
        </AlertDescription>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onAction} variant="default"   size="lg" className="h-8">
          Upvote
        </Button>

        <Button
          onClick={handleClose}
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-transparent"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Alert>
  );
}
