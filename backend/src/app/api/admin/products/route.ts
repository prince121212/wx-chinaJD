import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取商品列表（管理后台）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const keyword = searchParams.get('keyword')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')

    const skip = (page - 1) * limit

    const where: any = {}
    if (keyword) {
      where.title = { contains: keyword, mode: 'insensitive' }
    }
    if (categoryId) {
      where.categoryId = categoryId
    }
    if (status) {
      where.status = parseInt(status)
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          skus: {
            select: {
              id: true,
              skuId: true,
              price: true,
              originPrice: true,
              stockQuantity: true,
              status: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where })
    ])

    const formattedProducts = products.map(product => ({
      id: product.id,
      spuId: product.spuId,
      title: product.title,
      description: product.description,
      primaryImage: product.primaryImage,
      images: product.images,
      status: product.status,
      category: product.category,
      skus: product.skus.map(sku => ({
        id: sku.id,
        skuId: sku.skuId,
        price: Number(sku.price),
        originPrice: Number(sku.originPrice),
        stockQuantity: sku.stockQuantity,
        status: sku.status,
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: {
        list: formattedProducts,
        total,
        page,
        limit,
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

// 创建商品
export async function POST(request: NextRequest) {
  try {
    const { 
      spuId, 
      title, 
      description, 
      categoryId, 
      primaryImage, 
      images, 
      skus 
    } = await request.json()

    if (!spuId || !title || !categoryId || !primaryImage || !skus || skus.length === 0) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 检查SPU是否已存在
    const existingProduct = await prisma.product.findUnique({
      where: { spuId }
    })

    if (existingProduct) {
      return NextResponse.json(
        { success: false, msg: 'SPU已存在' },
        { status: 400 }
      )
    }

    // 检查分类是否存在
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, msg: '分类不存在' },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        spuId,
        title,
        description,
        categoryId,
        primaryImage,
        images,
        skus: {
          create: skus.map((sku: any) => ({
            skuId: sku.skuId,
            price: sku.price,
            originPrice: sku.originPrice,
            stockQuantity: sku.stockQuantity,
            specInfo: sku.specInfo,
          }))
        }
      },
      include: {
        skus: true
      }
    })

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, msg: '创建商品失败' },
      { status: 500 }
    )
  }
}