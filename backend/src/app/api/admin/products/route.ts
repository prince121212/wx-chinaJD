import { NextRequest, NextResponse } from 'next/server'

// 获取商品列表（管理后台）- 暂时返回模拟数据
export async function GET(request: NextRequest) {
  try {
    // 暂时返回模拟数据，避免构建时Prisma初始化问题
    return NextResponse.json({
      success: true,
      data: {
        list: [],
        total: 0,
        page: 1,
        limit: 10,
      }
    })
  } catch (error) {
    console.error('Admin get products error:', error)
    return NextResponse.json(
      { success: false, msg: '获取商品列表失败' },
      { status: 500 }
    )
  }
}

// 创建商品 - 暂时返回模拟响应
export async function POST(request: NextRequest) {
  try {
    const { spuId, title, description, categoryId, primaryImage, images, skus } = await request.json()

    if (!spuId || !title || !categoryId || !primaryImage || !skus || skus.length === 0) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 暂时返回模拟创建成功响应
    return NextResponse.json({
      success: true,
      data: {
        id: 'mock_product_id',
        spuId,
        title,
        description,
        categoryId,
        primaryImage,
        images,
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, msg: '创建商品失败' },
      { status: 500 }
    )
  }
}