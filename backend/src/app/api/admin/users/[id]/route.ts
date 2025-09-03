import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户详情（管理后台）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        openid: true,
        nickname: true,
        avatarUrl: true,
        phone: true,
        gender: true,
        createdAt: true,
        addresses: {
          select: {
            id: true,
            name: true,
            phone: true,
            province: true,
            city: true,
            district: true,
            detail: true,
            isDefault: true,
            createdAt: true,
          },
          orderBy: { isDefault: 'desc' }
        },
        orders: {
          select: {
            id: true,
            orderNo: true,
            status: true,
            totalAmount: true,
            actualAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, msg: '用户不存在' },
        { status: 404 }
      )
    }

    // 计算用户统计信息
    const [orderStats, couponCount] = await Promise.all([
      prisma.order.groupBy({
        by: ['status'],
        where: { userId },
        _count: { _all: true },
        _sum: { actualAmount: true }
      }),
      prisma.userCoupon.count({
        where: { userId, status: 0 }
      })
    ])

    const totalAmount = orderStats.reduce(
      (sum, stat) => sum + Number(stat._sum.actualAmount || 0),
      0
    )

    const formattedUser = {
      ...user,
      orders: user.orders.map(order => ({
        ...order,
        totalAmount: Number(order.totalAmount),
        actualAmount: Number(order.actualAmount),
      })),
      statistics: {
        totalOrders: user.orders.length,
        totalAmount,
        availableCoupons: couponCount,
        statusCounts: orderStats.map(stat => ({
          status: stat.status,
          count: stat._count._all
        }))
      }
    }

    return NextResponse.json({
      success: true,
      data: formattedUser
    })
  } catch (error) {
    console.error('Get user detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取用户详情失败' },
      { status: 500 }
    )
  }
}