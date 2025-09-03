import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取订单列表（管理后台）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const orderNo = searchParams.get('orderNo')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = parseInt(status)
    }
    
    if (orderNo) {
      where.orderNo = { contains: orderNo }
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              phone: true,
            }
          },
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
      }),
      prisma.order.count({ where })
    ])

    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      discountAmount: Number(order.discountAmount),
      actualAmount: Number(order.actualAmount),
      addressInfo: order.addressInfo,
      remark: order.remark,
      user: order.user,
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
      })),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        list: formattedOrders,
        total,
        page,
        limit,
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

// 获取订单统计
export async function POST(request: NextRequest) {
  try {
    const { action, startDate, endDate } = await request.json()

    if (action === 'statistics') {
      const where: any = {}
      if (startDate || endDate) {
        where.createdAt = {}
        if (startDate) where.createdAt.gte = new Date(startDate)
        if (endDate) where.createdAt.lte = new Date(endDate)
      }

      const [
        totalOrders,
        totalAmount,
        statusCounts,
        dailyStats
      ] = await Promise.all([
        prisma.order.count({ where }),
        prisma.order.aggregate({
          where: { ...where, status: { in: [2, 3, 4] } }, // 已付款及以上状态
          _sum: { actualAmount: true }
        }),
        prisma.order.groupBy({
          by: ['status'],
          where,
          _count: { _all: true }
        }),
        prisma.order.groupBy({
          by: ['createdAt'],
          where,
          _count: { _all: true },
          _sum: { actualAmount: true },
          orderBy: { createdAt: 'desc' },
          take: 30
        })
      ])

      const statusMap: { [key: number]: string } = {
        1: '待付款',
        2: '已付款',
        3: '已发货',
        4: '已完成',
        5: '已取消'
      }

      return NextResponse.json({
        success: true,
        data: {
          totalOrders,
          totalAmount: Number(totalAmount._sum.actualAmount || 0),
          statusCounts: statusCounts.map(item => ({
            status: item.status,
            statusName: statusMap[item.status],
            count: item._count._all
          })),
          dailyStats: dailyStats.map(item => ({
            date: item.createdAt,
            orderCount: item._count._all,
            amount: Number(item._sum.actualAmount || 0)
          }))
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