import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('获取分类数据 - 使用Supabase')

    // 从Supabase查询分类
    const categories = await SupabaseService.getCategories()

    console.log('Supabase查询结果:', {
      分类数量: categories.length
    })

    // 转换数据格式以匹配小程序期望的格式
    const formattedCategories = categories.map(category => ({
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

    // 如果Supabase查询失败，返回mock数据
    console.log('Supabase查询失败，使用mock数据')
    const mockCategories = [
      {
        groupId: '24948',
        name: '女装',
        thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
        children: [
          {
            groupId: '249481',
            name: '女装',
            thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
            children: [
              {
                groupId: '249480',
                name: '连衣裙',
                thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/classify/img-9.png',
              },
            ],
          },
        ],
      },
      {
        groupId: '24949',
        name: '男装',
        thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
        children: [
          {
            groupId: '249482',
            name: '男装',
            thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
            children: [
              {
                groupId: '249481',
                name: 'T恤',
                thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/classify/img-1.png',
              },
            ],
          },
        ],
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockCategories
    })
  }
}