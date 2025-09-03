import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取用户信息
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    // 使用测试用户
    const user = await prisma.user.findFirst({
      where: { openid: 'test_user_123' },
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
        phone: true,
        gender: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, msg: '用户不存在' },
        { status: 404 }
      )
    }

    // 获取用户统计信息
    const [orderCounts, couponCount] = await Promise.all([
      prisma.order.groupBy({
        by: ['status'],
        where: { userId: user.id },
        _count: { _all: true }
      }),
      prisma.userCoupon.count({
        where: { userId: user.id, status: 1 }
      })
    ])

    const orderStats = {
      pending: orderCounts.find(c => c.status === 1)?._count._all || 0, // 待付款
      paid: orderCounts.find(c => c.status === 2)?._count._all || 0, // 已付款
      shipped: orderCounts.find(c => c.status === 3)?._count._all || 0, // 已发货
      completed: orderCounts.find(c => c.status === 4)?._count._all || 0, // 已完成
    }

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

// 更新用户信息
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')
    const { nickname, phone, gender } = await request.json()

    const updateData: any = {}
    if (nickname) updateData.nickname = nickname
    if (phone) updateData.phone = phone
    if (gender !== undefined) updateData.gender = gender

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        nickname: true,
        avatarUrl: true,
        phone: true,
        gender: true,
      }
    })

    return NextResponse.json({
      success: true,
      data: user
    })
  } catch (error) {
    console.error('Update user info error:', error)
    return NextResponse.json(
      { success: false, msg: '更新用户信息失败' },
      { status: 500 }
    )
  }
}