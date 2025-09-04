import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('获取轮播图数据 - 使用Supabase')

    // 添加重试机制
    let banners = null
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        banners = await SupabaseService.getBanners()
        break // 成功则跳出循环
      } catch (error) {
        retryCount++
        console.log(`轮播图查询失败，重试 ${retryCount}/${maxRetries}:`, error.message)
        if (retryCount >= maxRetries) {
          throw error
        }
        // 等待1秒后重试
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

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
    return NextResponse.json(
      { success: false, msg: '获取轮播图失败' },
      { status: 500 }
    )
  }
}