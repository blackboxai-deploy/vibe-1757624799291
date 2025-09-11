"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 to-pink-500 mask-radial",
        sizeClasses[size]
      )}>
        <div className={cn(
          "rounded-full bg-slate-900 m-0.5",
          size === "sm" ? "h-3 w-3" : size === "md" ? "h-7 w-7" : "h-11 w-11"
        )} />
      </div>
      <style jsx>{`
        .mask-radial {
          mask: radial-gradient(transparent 35%, black 36%);
        }
      `}</style>
    </div>
  )
}