"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  badge?: {
    text: string
    variant?: "default" | "secondary" | "destructive" | "outline"
  }
  className?: string
  onClick?: () => void
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  badge,
  className,
  onClick,
}: StatsCardProps) {
  const TrendIcon = trend
    ? trend.value > 0
      ? TrendingUp
      : trend.value < 0
      ? TrendingDown
      : Minus
    : undefined

  return (
    <Card
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium truncate pr-2">{title}</CardTitle>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {badge && (
            <Badge variant={badge.variant || "default"} className="text-xs">
              {badge.text}
            </Badge>
          )}
          {Icon && <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold truncate">{value}</div>
        <div className="flex items-center justify-between mt-1">
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 flex-1 pr-2">{description}</p>
          )}
          {trend && TrendIcon && (
            <div
              className={cn(
                "flex items-center text-xs flex-shrink-0",
                trend.isPositive !== false && trend.value > 0
                  ? "text-green-600"
                  : trend.isPositive !== false && trend.value < 0
                  ? "text-red-600"
                  : trend.isPositive === false && trend.value > 0
                  ? "text-red-600"
                  : trend.isPositive === false && trend.value < 0
                  ? "text-green-600"
                  : "text-muted-foreground"
              )}
            >
              <TrendIcon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">{Math.abs(trend.value)}% {trend.label}</span>
              <span className="sm:hidden">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface MetricGridProps {
  metrics: StatsCardProps[]
  columns?: number
  className?: string
}

export function MetricGrid({ metrics, columns = 4, className }: MetricGridProps) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        columns === 6 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <StatsCard key={index} {...metric} />
      ))}
    </div>
  )
}
