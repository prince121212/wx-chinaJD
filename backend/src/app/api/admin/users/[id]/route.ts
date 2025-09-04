import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 获取用户详情（管理后台）- 暂时返回模拟数据
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // 暂时返回模拟用户数据
    const mockUser = {
      id: userId,
      openid: 'mock_openid',
      nickname: '测试用户',
      avatarUrl: 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
      phone: '138****8888',
      gender: 1,
      createdAt: new Date().toISOString(),
      addresses: [],
      orders: [],
      statistics: {
        totalOrders: 0,
        totalAmount: 0,
        availableCoupons: 0,
        statusCounts: []
      }
    }

    return NextResponse.json({
      success: true,
      data: mockUser
    })
  } catch (error) {
    console.error('Get user detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取用户详情失败' },
      { status: 500 }
    )
  }
}