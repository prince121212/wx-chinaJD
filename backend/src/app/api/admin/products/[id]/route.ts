import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 获取商品详情（管理后台）- 暂时返回模拟数据
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // 暂时返回模拟商品数据
    const mockProduct = {
      id: productId,
      spuId: 'mock_spu_id',
      title: '测试商品',
      description: '这是一个测试商品',
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      images: '[]',
      status: 1,
      category: { id: 'mock_category_id', name: '测试分类' },
      skus: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: mockProduct
    })
  } catch (error) {
    console.error('Get product detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取商品详情失败' },
      { status: 500 }
    )
  }
}

// 更新商品
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const { 
      title, 
      description, 
      categoryId, 
      primaryImage, 
      images, 
      status,
      skus 
    } = await request.json()

    // 暂时返回模拟更新成功响应
    return NextResponse.json({
      success: true,
      data: {
        id: productId,
        title,
        description,
        categoryId,
        primaryImage,
        images,
        status,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { success: false, msg: '更新商品失败' },
      { status: 500 }
    )
  }
}

// 删除商品 - 暂时返回模拟响应
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // 暂时返回模拟删除成功响应
    return NextResponse.json({
      success: true,
      msg: '删除成功'
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { success: false, msg: '删除失败' },
      { status: 500 }
    )
  }
}