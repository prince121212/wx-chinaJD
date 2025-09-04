import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { success: false, msg: '未授权' },
        { status: 401 }
      )
    }

    console.log('获取订单统计数据')

    // 模拟订单统计数据，因为我们还没有真实订单
    const orderCounts = [
      { tabType: 5, orderNum: 0 },   // 待付款
      { tabType: 10, orderNum: 0 },  // 待发货
      { tabType: 40, orderNum: 0 },  // 待收货
      { tabType: 60, orderNum: 0 },  // 待评价
    ]

    return NextResponse.json({
      success: true,
      data: orderCounts
    })
  } catch (error) {
    console.error('Get order count error:', error)
    return NextResponse.json(
      { success: false, msg: '获取订单统计失败' },
      { status: 500 }
    )
  }
}
