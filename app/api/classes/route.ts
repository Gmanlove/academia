import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Fast response with minimal data for better performance
    const classes = [
      { id: "1", name: "JSS 1A", level: 1, school: "Main Campus" },
      { id: "2", name: "JSS 1B", level: 1, school: "Main Campus" },
      { id: "3", name: "JSS 2A", level: 2, school: "Main Campus" },
      { id: "4", name: "JSS 2B", level: 2, school: "Main Campus" },
      { id: "5", name: "JSS 3A", level: 3, school: "Main Campus" },
      { id: "6", name: "JSS 3B", level: 3, school: "Main Campus" },
      { id: "7", name: "SS 1A", level: 4, school: "Main Campus" },
      { id: "8", name: "SS 1B", level: 4, school: "Main Campus" },
      { id: "9", name: "SS 2A", level: 5, school: "Main Campus" },
      { id: "10", name: "SS 2B", level: 5, school: "Main Campus" },
      { id: "11", name: "SS 3A", level: 6, school: "Main Campus" },
      { id: "12", name: "SS 3B", level: 6, school: "Main Campus" }
    ]

    return NextResponse.json(classes, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
      }
    })

  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    )
  }
}
