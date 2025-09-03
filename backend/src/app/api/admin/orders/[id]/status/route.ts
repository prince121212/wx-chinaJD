import { NextRequest, NextResponse } from 'next/server'

// 更新订单状态 - 暂时返回模拟响应，避免构建时Prisma初始化问题
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const { status } = await request.json()

    if (!status || ![1, 2, 3, 4, 5].includes(status)) {
      return NextResponse.json(
        { success: false, msg: '无效的状态值' },
        { status: 400 }
      )
    }

    // 暂时返回模拟成功响应，后续接入数据库
    return NextResponse.json({
      success: true,
      data: {
        id: orderId,
        status,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { success: false, msg: '更新订单状态失败' },
      { status: 500 }
    )
  }
}