"use client";
import { Star } from "lucide-react";
import { type KeyboardEvent, useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
} as const;

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  className = "",
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);
  const effective = hover ?? value;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (readOnly || !onChange) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(0, (value || 0) - 1));
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      role="radiogroup"
      aria-label="Puan"
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={onKey}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const index = i + 1;
        const filled = index <= effective;
        return (
          <button
            key={index}
            type="button"
            className="p-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded transition-transform"
            onMouseEnter={() => !readOnly && setHover(index)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(index)}
            aria-checked={value === index}
            role="radio"
            disabled={readOnly}
            title={`${index} yıldız`}
          >
            <Star
              className={`${sizeMap[size]} ${filled
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
                }`}
            />
          </button>
        );
      })}
    </div>
  );
}
