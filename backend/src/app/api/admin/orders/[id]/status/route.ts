import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 更新订单状态
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

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, msg: '订单不存在' },
        { status: 404 }
      )
    }

    // 状态流转验证
    const validTransitions: { [key: number]: number[] } = {
      1: [2, 5], // 待付款 -> 已付款/已取消
      2: [3, 5], // 已付款 -> 已发货/已取消
      3: [4],    // 已发货 -> 已完成
      4: [],     // 已完成 -> 无
      5: []      // 已取消 -> 无
    }

    if (!validTransitions[order.status]?.includes(status)) {
      return NextResponse.json(
        { success: false, msg: '订单状态不允许此操作' },
        { status: 400 }
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      data: updatedOrder
    })
  } catch (error) {
    console.error('Update order status error:', error)
    return NextResponse.json(
      { success: false, msg: '更新订单状态失败' },
      { status: 500 }
    )
  }
}