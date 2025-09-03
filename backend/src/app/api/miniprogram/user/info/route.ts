import { NextRequest, NextResponse } from 'next/server'

// 获取用户信息 - 暂时禁用，使用Supabase后需要重新实现
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    console.log('用户信息功能暂时禁用 - 需要Supabase实现')

    // 返回模拟用户信息
    const user = {
      id: 'test_user_123',
      nickname: '测试用户',
      avatarUrl: 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
      phone: '138****8888',
      gender: 1,
      createdAt: new Date().toISOString(),
    }

    // 返回模拟统计信息
    const orderStats = {
      pending: 0, // 待付款
      paid: 0, // 已付款
      shipped: 0, // 已发货
      completed: 0, // 已完成
    }

    const couponCount = 0

    return NextResponse.json({
      success: true,
      data: {
        userInfo: user,
        countsData: [
          { num: couponCount, name: '优惠券', type: 'coupon' },
          { num: 0, name: '积分', type: 'point' },
        ],
        orderTagInfos: [
          { orderNum: orderStats.pending, tabType: 5 },
          { orderNum: orderStats.paid, tabType: 10 },
          { orderNum: orderStats.shipped, tabType: 40 },
          { orderNum: 0, tabType: 0 },
        ]
      }
    })
  } catch (error) {
    console.error('Get user info error:', error)
    return NextResponse.json(
      { success: false, msg: '获取用户信息失败' },
      { status: 500 }
    )
  }
}

// 更新用户信息 - 暂时禁用，使用Supabase后需要重新实现
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    console.log('更新用户信息功能暂时禁用 - 需要Supabase实现')

    return NextResponse.json({
      success: false,
      msg: '更新功能暂时不可用'
    })
  } catch (error) {
    console.error('Update user info error:', error)
    return NextResponse.json(
      { success: false, msg: '更新用户信息失败' },
      { status: 500 }
    )
  }
}