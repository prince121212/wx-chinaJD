import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取订单详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')
    const orderId = params.id

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        orderItems: {
          include: {
            sku: {
              include: {
                product: {
                  select: {
                    title: true,
                    primaryImage: true,
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, msg: '订单不存在' },
        { status: 404 }
      )
    }

    const formattedOrder = {
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      discountAmount: Number(order.discountAmount),
      actualAmount: Number(order.actualAmount),
      addressInfo: order.addressInfo,
      remark: order.remark,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.orderItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
        totalPrice: Number(item.totalPrice),
        specInfo: item.specInfo,
        product: {
          title: item.sku.product.title,
          image: item.sku.product.primaryImage,
        }
      }))
    }

    return NextResponse.json({
      success: true,
      data: formattedOrder
    })
  } catch (error) {
    console.error('Get order detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取订单详情失败' },
      { status: 500 }
    )
  }
}

// 更新订单状态
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')
    const orderId = params.id
    const { action } = await request.json()

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, msg: '订单不存在' },
        { status: 404 }
      )
    }

    let newStatus = order.status

    switch (action) {
      case 'pay':
        if (order.status === 1) { // 待付款
          newStatus = 2 // 已付款
        }
        break
      case 'cancel':
        if (order.status === 1) { // 待付款
          newStatus = 5 // 已取消
        }
        break
      case 'confirm':
        if (order.status === 3) { // 已发货
          newStatus = 4 // 已完成
        }
        break
      default:
        return NextResponse.json(
          { success: false, msg: '无效的操作' },
          { status: 400 }
        )
    }

    if (newStatus === order.status) {
      return NextResponse.json(
        { success: false, msg: '订单状态不允许此操作' },
        { status: 400 }
      )
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })

    return NextResponse.json({
      success: true,
      msg: '操作成功'
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { success: false, msg: '操作失败' },
      { status: 500 }
    )
  }
}