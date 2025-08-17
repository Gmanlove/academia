export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading your results...</p>
        <p className="text-sm text-gray-500">Please wait while we fetch your academic information</p>
      </div>
    </div>
  )
}
