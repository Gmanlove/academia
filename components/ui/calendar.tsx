"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.HTMLAttributes<HTMLDivElement>

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="text-center">Calendar component placeholder</div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
