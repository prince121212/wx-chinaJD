import { NextRequest, NextResponse } from 'next/server'

// 获取订单列表（管理后台）- 暂时返回模拟数据
export async function GET(request: NextRequest) {
  try {
    // 暂时返回模拟数据，避免构建时Prisma初始化问题
    return NextResponse.json({
      success: true,
      data: {
        list: [],
        total: 0,
        page: 1,
        limit: 10,
      }
    })
  } catch (error) {
    console.error('Admin get orders error:', error)
    return NextResponse.json(
      { success: false, msg: '获取订单列表失败' },
      { status: 500 }
    )
  }
}

// 获取订单统计 - 暂时返回模拟数据
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === 'statistics') {
      // 暂时返回模拟统计数据
      return NextResponse.json({
        success: true,
        data: {
          totalOrders: 0,
          totalAmount: 0,
          statusCounts: [],
          dailyStats: []
        }
      })
    }

    return NextResponse.json(
      { success: false, msg: '无效的操作' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Order statistics error:', error)
    return NextResponse.json(
      { success: false, msg: '获取统计数据失败' },
      { status: 500 }
    )
  }
}