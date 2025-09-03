import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户列表（管理后台）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')

    const skip = (page - 1) * limit

    const where: any = {}
    if (keyword) {
      where.OR = [
        { nickname: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword } }
      ]
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          openid: true,
          nickname: true,
          avatarUrl: true,
          phone: true,
          gender: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              addresses: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where })
    ])

    // 获取用户订单金额统计
    const userIds = users.map(user => user.id)
    const orderStats = await prisma.order.groupBy({
      by: ['userId'],
      where: {
        userId: { in: userIds },
        status: { in: [2, 3, 4] } // 已付款及以上状态
      },
      _sum: { actualAmount: true },
      _count: { _all: true }
    })

    const formattedUsers = users.map(user => {
      const stats = orderStats.find(stat => stat.userId === user.id)
      return {
        ...user,
        orderCount: user._count.orders,
        addressCount: user._count.addresses,
        totalAmount: Number(stats?._sum.actualAmount || 0),
        paidOrderCount: stats?._count._all || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        list: formattedUsers,
        total,
        page,
        limit,
      }
    })
  } catch (error) {
    console.error('Admin get users error:', error)
    return NextResponse.json(
      { success: false, msg: '获取用户列表失败' },
      { status: 500 }
    )
  }
}