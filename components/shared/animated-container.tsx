// components/ui/animated-container.tsx
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?:
    | "fade"
    | "slide"
    | "scale"
    | "bounce"
    | "none"
    | "slideUp"
    | "slideDown";
  delay?: number;
  duration?: number;
}

export function AnimatedContainer({
  children,
  className,
  animation = "fade",
  delay = 0,
  duration = 0.5,
}: AnimatedContainerProps) {
  const animations = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay, duration },
    },
    slide: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { delay, duration },
    },
    bounce: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: [1.2, 0.9, 1] },
      transition: { delay, duration },
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration },
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay, duration },
    },
    none: {
      initial: {},
      animate: {},
      transition: {},
    },
  };

  return (
    <motion.div
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={animations[animation].transition}
      className={cn("transform-gpu", className)}
    >
      {children}
    </motion.div>
  );
}
