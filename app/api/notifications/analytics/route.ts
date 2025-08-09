import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y
  const schoolId = searchParams.get('schoolId')

  // Get notifications for analytics
  const notifications = db.listNotifications({ schoolId: schoolId || undefined })
  
  // Calculate date range
  const now = new Date()
  let startDate: Date
  
  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      break
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default: // 30d
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  // Filter notifications by date range
  const periodNotifications = notifications.filter(n => 
    new Date(n.createdAt) >= startDate
  )

  // Calculate metrics
  const totalSent = periodNotifications.filter(n => n.status === 'Sent').length
  const totalScheduled = periodNotifications.filter(n => n.status === 'Scheduled').length
  const totalFailed = periodNotifications.filter(n => n.status === 'Failed').length
  
  // Calculate average rates
  const sentNotifications = periodNotifications.filter(n => n.status === 'Sent' && n.metadata)
  const avgDeliveryRate = sentNotifications.length > 0 
    ? sentNotifications.reduce((sum, n) => sum + (n.metadata?.deliveryRate || 0), 0) / sentNotifications.length
    : 0
  
  const avgOpenRate = sentNotifications.length > 0
    ? sentNotifications.reduce((sum, n) => sum + (n.metadata?.openRate || 0), 0) / sentNotifications.length
    : 0
    
  const avgClickRate = sentNotifications.length > 0
    ? sentNotifications.reduce((sum, n) => sum + (n.metadata?.clickRate || 0), 0) / sentNotifications.length
    : 0

  // Channel performance
  const channelPerformance = ['Email', 'SMS', 'App', 'Push'].map(channel => {
    const channelNotifications = sentNotifications.filter(n => n.delivery === channel)
    const avgDelivery = channelNotifications.length > 0
      ? channelNotifications.reduce((sum, n) => sum + (n.metadata?.deliveryRate || 0), 0) / channelNotifications.length
      : 0
    
    return {
      channel,
      sent: channelNotifications.length,
      avgDeliveryRate: avgDelivery,
      avgOpenRate: channelNotifications.length > 0
        ? channelNotifications.reduce((sum, n) => sum + (n.metadata?.openRate || 0), 0) / channelNotifications.length
        : 0
    }
  })

  // Time series data (daily for last 30 days)
  const timeSeriesData = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
    
    const dayNotifications = periodNotifications.filter(n => {
      const nDate = new Date(n.createdAt)
      return nDate >= dayStart && nDate < dayEnd
    })
    
    timeSeriesData.push({
      date: dayStart.toISOString().split('T')[0],
      sent: dayNotifications.filter(n => n.status === 'Sent').length,
      scheduled: dayNotifications.filter(n => n.status === 'Scheduled').length,
      failed: dayNotifications.filter(n => n.status === 'Failed').length
    })
  }

  // Template usage
  const templates = db.listNotificationTemplates()
  const templateUsage = templates
    .filter(t => t.usageStats && t.usageStats.timesUsed > 0)
    .sort((a, b) => (b.usageStats?.timesUsed || 0) - (a.usageStats?.timesUsed || 0))
    .slice(0, 10)
    .map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      timesUsed: t.usageStats?.timesUsed || 0,
      avgOpenRate: t.usageStats?.avgOpenRate || 0,
      avgClickRate: t.usageStats?.avgClickRate || 0
    }))

  return NextResponse.json({
    period,
    overview: {
      totalSent,
      totalScheduled,
      totalFailed,
      avgDeliveryRate: Math.round(avgDeliveryRate * 100) / 100,
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      avgClickRate: Math.round(avgClickRate * 100) / 100
    },
    channelPerformance,
    timeSeriesData,
    templateUsage,
    insights: generateInsights(totalSent, avgDeliveryRate, avgOpenRate, avgClickRate)
  })
}

function generateInsights(totalSent: number, deliveryRate: number, openRate: number, clickRate: number) {
  const insights = []
  
  if (deliveryRate < 90) {
    insights.push({
      type: 'warning',
      title: 'Low Delivery Rate',
      message: `Delivery rate is ${deliveryRate.toFixed(1)}%. Consider reviewing contact information.`,
      action: 'Review recipient data'
    })
  }
  
  if (openRate < 50) {
    insights.push({
      type: 'info',
      title: 'Low Open Rate',
      message: `Open rate is ${openRate.toFixed(1)}%. Try improving subject lines.`,
      action: 'A/B test subject lines'
    })
  }
  
  if (clickRate < 20) {
    insights.push({
      type: 'info',
      title: 'Low Click Rate',
      message: `Click rate is ${clickRate.toFixed(1)}%. Consider improving call-to-action.`,
      action: 'Optimize message content'
    })
  }
  
  if (totalSent > 100) {
    insights.push({
      type: 'success',
      title: 'High Volume',
      message: `You've sent ${totalSent} notifications this period. Great engagement!`,
      action: 'Keep up the momentum'
    })
  }
  
  return insights
}
