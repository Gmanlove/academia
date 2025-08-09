"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Popover = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div className="relative">
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  </div>
))
Popover.displayName = "Popover"

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("", className)}
    {...props}
  />
))
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
