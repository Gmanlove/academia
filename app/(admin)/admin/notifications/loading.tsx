export default function NotificationsLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded w-80 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-96 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-9 bg-muted rounded w-40 animate-pulse"></div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="w-full">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <div className="h-8 bg-background rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
          <div className="h-8 bg-muted rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
              <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-2">
              <div className="h-8 w-8 bg-muted rounded mx-auto animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-24 mx-auto animate-pulse"></div>
              <div className="h-3 bg-muted rounded w-32 mx-auto animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 w-4 bg-muted rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-muted rounded w-48 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-3 bg-muted rounded w-20 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
