import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    return NextResponse.json({
      success: true,
      data: {
        message: 'Test dynamic route works!',
        id,
        userAgent,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json(
      { success: false, msg: 'Test route failed' },
      { status: 500 }
    )
  }
}
