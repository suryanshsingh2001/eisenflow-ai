import * as React from "react";
import { cn } from "@/lib/utils";
import { Frown } from "lucide-react";
import { motion } from "framer-motion";

interface FrogSelectorProps {
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
  count?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FrogSelector({
  value = 1,
  onChange,
  disabled = false,
  count = 5,
  className,
  size = "md",
}: FrogSelectorProps) {
  const [hoveredValue, setHoveredValue] = React.useState<number | null>(null);

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  return (
    <div
      className={cn("flex gap-2 items-center", className)}
      onMouseLeave={() => setHoveredValue(null)}
    >
      {Array.from({ length: count }).map((_, index) => {
        const frogValue = index + 1;
        const isActive = (hoveredValue ?? value) >= frogValue;

        return (
          <motion.button
            key={frogValue}
            type="button"
            className={cn(
              "rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50",
              !disabled && "cursor-pointer"
            )}
            disabled={disabled}
            onClick={() => onChange?.(frogValue)}
            onMouseEnter={() => setHoveredValue(frogValue)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              y: isActive ? [-5, 0] : 0,
              transition: {
                duration: 0.3,
                repeat: isActive ? Infinity : 0,
                repeatType: "reverse",
              },
            }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.1 : 1,
                rotate: isActive ? [0, -15, 15, 0] : 0,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
            >
              <Frown
                className={cn(
                  sizeClasses[size],
                  isActive
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-300 dark:text-gray-600"
                )}
              />
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}