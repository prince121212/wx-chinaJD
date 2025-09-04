import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('获取分类数据 - 使用Supabase')

    // 添加重试机制
    let categories = null
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        categories = await SupabaseService.getCategories()
        break // 成功则跳出循环
      } catch (error) {
        retryCount++
        console.log(`分类查询失败，重试 ${retryCount}/${maxRetries}:`, (error as any)?.message || error)
        if (retryCount >= maxRetries) {
          throw error
        }
        // 等待1秒后重试
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    console.log('Supabase查询结果:', {
      分类数量: categories?.length || 0
    })

    // 转换数据格式以匹配小程序期望的格式
    const formattedCategories = (categories || []).map(category => ({
      groupId: category.id,
      name: category.name,
      thumbnail: category.image,
      children: [
        {
          groupId: category.id,
          name: category.name,
          thumbnail: category.image,
          children: [
            {
              groupId: category.id,
              name: category.name,
              thumbnail: category.image,
            }
          ],
        },
      ],
    }))

    return NextResponse.json({
      success: true,
      data: formattedCategories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, msg: '获取分类失败' },
      { status: 500 }
    )
  }
}