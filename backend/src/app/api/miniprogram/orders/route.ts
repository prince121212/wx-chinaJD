import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateOrderNo } from '@/lib/utils'

// 获取订单列表
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: any = { userId }
    if (status) {
      where.status = parseInt(status)
    }

    const orders = await prisma.order.findMany({
      where,
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
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })

    const total = await prisma.order.count({ where })

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      discountAmount: Number(order.discountAmount),
      actualAmount: Number(order.actualAmount),
      addressInfo: order.addressInfo,
      remark: order.remark,
      createdAt: order.createdAt,
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
    }))

    return NextResponse.json({
      success: true,
      data: {
        list: formattedOrders,
        total,
        page,
        limit,
        hasMore: skip + limit < total,
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

// 创建订单
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')
    const { cartItemIds, addressInfo, remark, couponId } = await request.json()

    if (!cartItemIds || cartItemIds.length === 0) {
      return NextResponse.json(
        { success: false, msg: '请选择商品' },
        { status: 400 }
      )
    }

    if (!addressInfo) {
      return NextResponse.json(
        { success: false, msg: '请选择收货地址' },
        { status: 400 }
      )
    }

    // 获取购物车项
    const cartItems = await prisma.cart.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
      include: {
        sku: {
          include: {
            product: true
          }
        }
      }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, msg: '购物车项不存在' },
        { status: 404 }
      )
    }

    // 检查库存
    for (const item of cartItems) {
      if (item.sku.stockQuantity < item.quantity) {
        return NextResponse.json(
          { success: false, msg: `${item.sku.product.title} 库存不足` },
          { status: 400 }
        )
      }
    }

    // 计算金额
    let totalAmount = 0
    const orderItems = cartItems.map(item => {
      const itemTotal = Number(item.sku.price) * item.quantity
      totalAmount += itemTotal
      return {
        skuId: item.sku.id,
        quantity: item.quantity,
        price: item.sku.price,
        totalPrice: itemTotal,
        specInfo: item.sku.specInfo,
      }
    })

    let discountAmount = 0
    // 这里可以添加优惠券计算逻辑

    const actualAmount = totalAmount - discountAmount

    // 创建订单
    const order = await prisma.order.create({
      data: {
        orderNo: generateOrderNo(),
        userId,
        status: 1, // 待付款
        totalAmount,
        discountAmount,
        actualAmount,
        addressInfo,
        remark,
        orderItems: {
          create: orderItems
        }
      }
    })

    // 减库存
    for (const item of cartItems) {
      await prisma.productSku.update({
        where: { id: item.sku.id },
        data: {
          stockQuantity: {
            decrement: item.quantity
          }
        }
      })
    }

    // 删除购物车项
    await prisma.cart.deleteMany({
      where: {
        id: { in: cartItemIds }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNo: order.orderNo,
        actualAmount: Number(order.actualAmount),
      }
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, msg: '创建订单失败' },
      { status: 500 }
    )
  }
}