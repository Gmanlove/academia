import { NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { NotificationItem, NotificationTemplate } from "@/lib/types"

// GET /api/notifications - List notifications with filtering
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const delivery = searchParams.get('delivery')
  const audience = searchParams.get('audience')
  const priority = searchParams.get('priority')
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')

  let notifications = db.listNotifications()

  // Apply filters
  if (status && status !== 'all') {
    notifications = notifications.filter(n => n.status === status)
  }
  if (delivery && delivery !== 'all') {
    notifications = notifications.filter(n => n.delivery === delivery)
  }
  if (audience && audience !== 'all') {
    notifications = notifications.filter(n => n.audience === audience)
  }
  if (priority && priority !== 'all') {
    notifications = notifications.filter(n => n.priority === priority)
  }

  // Apply pagination
  const limitNum = limit ? parseInt(limit) : 50
  const offsetNum = offset ? parseInt(offset) : 0
  const paginatedNotifications = notifications.slice(offsetNum, offsetNum + limitNum)

  return NextResponse.json({
    notifications: paginatedNotifications,
    total: notifications.length,
    hasMore: offsetNum + limitNum < notifications.length
  })
}

// POST /api/notifications - Create new notification
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.title || !body.message) {
      return new NextResponse("title and message are required", { status: 400 })
    }

    // Create notification with enhanced features
    const notification: Partial<NotificationItem> = {
      title: body.title,
      message: body.message,
      audience: body.audience ?? "School",
      delivery: body.delivery ?? "Email",
      priority: body.priority ?? "Medium",
      scheduledFor: body.scheduledFor,
      recipientIds: body.recipientIds || [],
      templateId: body.templateId,
      channels: body.channels || [],
      abTestConfig: body.abTestConfig,
      metadata: {
        emailsSent: 0,
        smssSent: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        unsubscribeRate: 0,
        bounceRate: 0
      }
    }

    const created = db.addNotification(notification as NotificationItem)
    
    // If scheduled, don't send immediately
    if (!body.scheduledFor) {
      // Simulate sending process
      simulateNotificationDelivery(created)
    }

    return NextResponse.json(created)
  } catch (error) {
    console.error("Error creating notification:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// PATCH /api/notifications - Bulk operations
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { action, notificationIds, data } = body

    switch (action) {
      case 'bulk_delete':
        notificationIds.forEach((id: string) => db.deleteNotification(id))
        return NextResponse.json({ success: true, deleted: notificationIds.length })
      
      case 'bulk_schedule':
        notificationIds.forEach((id: string) => {
          db.updateNotification(id, { 
            scheduledFor: data.scheduledFor,
            status: 'Scheduled' as const
          })
        })
        return NextResponse.json({ success: true, updated: notificationIds.length })
      
      case 'bulk_send':
        notificationIds.forEach((id: string) => {
          const notification = db.updateNotification(id, { status: 'Sent' as const })
          if (notification) simulateNotificationDelivery(notification)
        })
        return NextResponse.json({ success: true, sent: notificationIds.length })
      
      default:
        return new NextResponse("Invalid action", { status: 400 })
    }
  } catch (error) {
    console.error("Error in bulk operation:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// Simulate notification delivery process
function simulateNotificationDelivery(notification: NotificationItem) {
  // Simulate asynchronous delivery process
  setTimeout(() => {
    const deliveryRate = Math.random() * 10 + 90 // 90-100% delivery rate
    const openRate = Math.random() * 30 + 60 // 60-90% open rate
    const clickRate = Math.random() * 20 + 20 // 20-40% click rate
    
    // Calculate recipient count based on audience
    let recipientCount = 0
    switch (notification.audience) {
      case 'School': recipientCount = 520; break
      case 'Class': recipientCount = 35; break
      case 'Teacher': recipientCount = 48; break
      case 'Parent': recipientCount = 450; break
      default: recipientCount = notification.recipientIds?.length || 1
    }

    const delivered = Math.floor(recipientCount * deliveryRate / 100)
    const opened = Math.floor(delivered * openRate / 100)
    const clicked = Math.floor(opened * clickRate / 100)

    // Update notification with delivery metrics
    db.updateNotification(notification.id, {
      status: delivered > recipientCount * 0.8 ? 'Sent' : 'Failed',
      metadata: {
        ...notification.metadata,
        [notification.delivery === 'SMS' ? 'smssSent' : 'emailsSent']: delivered,
        deliveryRate: (delivered / recipientCount) * 100,
        openRate: (opened / delivered) * 100,
        clickRate: (clicked / opened) * 100
      },
      deliveryTracking: {
        sentAt: new Date().toISOString(),
        deliveredAt: new Date(Date.now() + 5000).toISOString() // 5 seconds later
      }
    })
  }, 2000) // 2 second delay
}
