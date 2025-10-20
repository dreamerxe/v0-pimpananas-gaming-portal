"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export function RatingStars({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  }

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1
        const isFilled = starValue <= Math.floor(rating)
        const isPartial = starValue === Math.ceil(rating) && rating % 1 !== 0

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              "relative transition-all",
              interactive && "hover:scale-110 cursor-pointer",
              !interactive && "cursor-default",
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled || isPartial ? "fill-primary text-primary" : "fill-none text-muted-foreground",
              )}
            />
            {isPartial && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
                <Star className={cn(sizeClasses[size], "fill-primary text-primary")} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
