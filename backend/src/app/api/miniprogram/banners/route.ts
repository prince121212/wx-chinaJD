import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('获取轮播图数据 - 使用Supabase')

    // 从Supabase查询轮播图
    const banners = await SupabaseService.getBanners()

    console.log('Supabase查询结果:', {
      轮播图数量: banners.length
    })

    // 转换数据格式以匹配小程序期望的格式
    const formattedBanners = banners.map(banner => banner.image)

    return NextResponse.json({
      success: true,
      data: formattedBanners
    })
  } catch (error) {
    console.error('Get banners error:', error)

    // 如果Supabase查询失败，返回mock数据
    console.log('Supabase查询失败，使用mock数据')
    const mockBanners = [
      'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner1.png',
      'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner2.png',
      'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner3.png',
    ]

    return NextResponse.json({
      success: true,
      data: mockBanners
    })
  }
}