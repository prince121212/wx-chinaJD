import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取商品详情（管理后台）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: { select: { id: true, name: true } },
        skus: true
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, msg: '商品不存在' },
        { status: 404 }
      )
    }

    const formattedProduct = {
      ...product,
      skus: product.skus.map(sku => ({
        ...sku,
        price: Number(sku.price),
        originPrice: Number(sku.originPrice),
      }))
    }

    return NextResponse.json({
      success: true,
      data: formattedProduct
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

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, msg: '商品不存在' },
        { status: 404 }
      )
    }

    // 更新商品和SKU信息
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 更新商品基本信息
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          title: title || undefined,
          description: description || undefined,
          categoryId: categoryId || undefined,
          primaryImage: primaryImage || undefined,
          images: images || undefined,
          status: status !== undefined ? status : undefined,
        }
      })

      // 如果有SKU更新
      if (skus && Array.isArray(skus)) {
        // 删除现有SKU
        await tx.productSku.deleteMany({
          where: { productId }
        })

        // 创建新SKU
        await tx.productSku.createMany({
          data: skus.map((sku: any) => ({
            productId,
            skuId: sku.skuId,
            price: sku.price,
            originPrice: sku.originPrice,
            stockQuantity: sku.stockQuantity,
            specInfo: sku.specInfo,
          }))
        })
      }

      return product
    })

    return NextResponse.json({
      success: true,
      data: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { success: false, msg: '更新商品失败' },
      { status: 500 }
    )
  }
}

// 删除商品
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, msg: '商品不存在' },
        { status: 404 }
      )
    }

    // 删除商品（级联删除SKU）
    await prisma.product.delete({
      where: { id: productId }
    })

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