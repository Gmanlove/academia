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
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {badge && (
            <Badge variant={badge.variant || "default"} className="text-xs">
              {badge.text}
            </Badge>
          )}
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && TrendIcon && (
            <div
              className={cn(
                "flex items-center text-xs",
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
              {Math.abs(trend.value)}% {trend.label}
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
        "grid gap-4",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
        columns === 6 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        className
      )}
    >
      {metrics.map((metric, index) => (
        <StatsCard key={index} {...metric} />
      ))}
    </div>
  )
}
