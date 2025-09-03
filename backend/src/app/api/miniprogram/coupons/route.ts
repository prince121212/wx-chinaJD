import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    
    const now = new Date()
    const coupons = await prisma.coupon.findMany({
      where: {
        status: 1,
        startTime: { lte: now },
        endTime: { gte: now },
        usedCount: { lt: prisma.coupon.fields.totalCount }
      },
      orderBy: { createdAt: 'desc' }
    })

    let userCoupons: any[] = []
    
    if (token) {
      const userId = token.replace('user_', '')
      userCoupons = await prisma.userCoupon.findMany({
        where: { userId },
        select: { couponId: true, status: true }
      })
    }

    const formattedCoupons = coupons.map(coupon => ({
      id: coupon.id,
      title: coupon.title,
      description: coupon.description,
      type: coupon.type,
      discountValue: Number(coupon.discountValue),
      minAmount: Number(coupon.minAmount),
      startTime: coupon.startTime,
      endTime: coupon.endTime,
      remainCount: coupon.totalCount - coupon.usedCount,
      isReceived: userCoupons.some(uc => uc.couponId === coupon.id)
    }))

    return NextResponse.json({
      success: true,
      data: formattedCoupons
    })
  } catch (error) {
    console.error('Get coupons error:', error)
    return NextResponse.json(
      { success: false, msg: '获取优惠券失败' },
      { status: 500 }
    )
  }
}

// 领取优惠券
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
    const { couponId } = await request.json()

    if (!couponId) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 检查优惠券是否存在且有效
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId }
    })

    if (!coupon || coupon.status !== 1) {
      return NextResponse.json(
        { success: false, msg: '优惠券不存在或已失效' },
        { status: 404 }
      )
    }

    const now = new Date()
    if (now < coupon.startTime || now > coupon.endTime) {
      return NextResponse.json(
        { success: false, msg: '优惠券不在有效期内' },
        { status: 400 }
      )
    }

    if (coupon.usedCount >= coupon.totalCount) {
      return NextResponse.json(
        { success: false, msg: '优惠券已被领完' },
        { status: 400 }
      )
    }

    // 检查用户是否已领取
    const existingUserCoupon = await prisma.userCoupon.findUnique({
      where: {
        userId_couponId: {
          userId,
          couponId
        }
      }
    })

    if (existingUserCoupon) {
      return NextResponse.json(
        { success: false, msg: '您已经领取过该优惠券' },
        { status: 400 }
      )
    }

    // 领取优惠券
    await prisma.$transaction([
      prisma.userCoupon.create({
        data: {
          userId,
          couponId,
          status: 0
        }
      }),
      prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } }
      })
    ])

    return NextResponse.json({
      success: true,
      msg: '领取成功'
    })
  } catch (error) {
    console.error('Receive coupon error:', error)
    return NextResponse.json(
      { success: false, msg: '领取失败' },
      { status: 500 }
    )
  }
}