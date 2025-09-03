import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('获取优惠券列表 - 使用Supabase')

    const coupons = await SupabaseService.getCoupons(20)

    console.log('优惠券数量:', coupons.length)

    const formattedCoupons = coupons.map(coupon => ({
      id: coupon.id,
      title: coupon.title,
      description: coupon.description,
      type: coupon.type,
      discountValue: Number(coupon.value),
      minAmount: Number(coupon.minAmount || 0),
      startTime: coupon.startTime,
      endTime: coupon.endTime,
      remainCount: coupon.totalCount - coupon.usedCount,
      isReceived: false // 简化处理，暂不支持用户领取状态
    }))

    return NextResponse.json({
      success: true,
      data: formattedCoupons
    })
  } catch (error) {
    console.error('Get coupons error:', error)

    // 如果Supabase查询失败，返回空数据
    console.log('Supabase查询失败，返回空优惠券列表')
    return NextResponse.json({
      success: true,
      data: []
    })
  }
}

// 领取优惠券 - 暂时禁用，使用Supabase后需要重新实现
export async function POST(request: NextRequest) {
  try {
    console.log('领取优惠券功能暂时禁用 - 需要Supabase实现')

    return NextResponse.json({
      success: false,
      msg: '领取功能暂时不可用'
    })
  } catch (error) {
    console.error('Receive coupon error:', error)
    return NextResponse.json(
      { success: false, msg: '领取失败' },
      { status: 500 }
    )
  }
}