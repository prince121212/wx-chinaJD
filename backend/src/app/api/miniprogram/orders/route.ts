import { NextRequest, NextResponse } from 'next/server'

// 获取订单列表 - 暂时禁用，使用Supabase后需要重新实现
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    console.log('订单列表功能暂时禁用 - 需要Supabase实现')

    // 返回空订单列表
    return NextResponse.json({
      success: true,
      data: {
        list: [],
        total: 0,
        page: 1,
        limit: 10,
        hasMore: false
      }
    })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { success: false, msg: '获取订单列表失败' },
      { status: 500 }
    )
  }
}

// 创建订单 - 暂时禁用，使用Supabase后需要重新实现
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    console.log('创建订单功能暂时禁用 - 需要Supabase实现')

    return NextResponse.json({
      success: false,
      msg: '创建订单功能暂时不可用'
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, msg: '创建订单失败' },
      { status: 500 }
    )
  }
}