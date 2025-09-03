import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const categoryId = searchParams.get('categoryId')
    const keyword = searchParams.get('keyword')

    // 修正page参数，确保最小为1
    if (page < 1) page = 1

    console.log('API请求参数:', { page, limit, categoryId, keyword })

    // 构建查询条件
    const where: any = {
      status: 1, // 只查询上架商品
    }

    // 分类筛选
    if (categoryId) {
      where.categoryId = categoryId
    }

    // 关键词搜索
    if (keyword) {
      where.title = {
        contains: keyword,
        mode: 'insensitive'
      }
    }

    // 查询商品总数
    const total = await prisma.product.count({ where })

    // 分页查询商品
    const offset = (page - 1) * limit
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        skus: true,
      },
      skip: offset,
      take: limit,
      orderBy: {
        sortOrder: 'asc',
      },
    })

    console.log('数据库查询结果:', {
      total,
      page,
      limit,
      返回商品数量: products.length,
      hasMore: offset + limit < total
    })

    // 转换数据格式以匹配mock格式
    const formattedProducts = products.map(product => {
      const images = product.images ? JSON.parse(product.images) : []
      const minPrice = Math.min(...product.skus.map(sku => sku.price))
      const maxPrice = Math.max(...product.skus.map(sku => sku.price))
      const minOriginPrice = Math.min(...product.skus.map(sku => sku.originPrice))
      const maxOriginPrice = Math.max(...product.skus.map(sku => sku.originPrice))
      const totalStock = product.skus.reduce((sum, sku) => sum + sku.stockQuantity, 0)

      return {
        saasId: '88888888',
        storeId: '1000',
        spuId: product.spuId,
        title: product.title,
        primaryImage: product.primaryImage,
        images,
        video: null,
        available: 1,
        minSalePrice: minPrice,
        minLinePrice: minPrice,
        maxSalePrice: maxPrice,
        maxLinePrice: maxOriginPrice,
        spuStockQuantity: totalStock,
        soldNum: 1020, // 模拟销量
        isPutOnSale: product.status,
        categoryIds: [product.categoryId],
        specList: [], // 简化处理
        skuList: product.skus.map(sku => ({
          skuId: sku.skuId,
          skuImage: product.primaryImage,
          specInfo: sku.specInfo ? JSON.parse(sku.specInfo) : [],
          priceInfo: [
            { priceType: 1, price: sku.price.toString(), priceTypeName: '销售价格' },
            { priceType: 2, price: sku.originPrice.toString(), priceTypeName: '划线价格' },
          ],
          stockInfo: {
            stockQuantity: sku.stockQuantity,
            safeStockQuantity: 0,
            soldQuantity: 0,
          },
          weight: { value: null, unit: 'KG' },
          volume: null,
          profitPrice: null,
        })),
        spuTagList: [{ id: '13001', title: '限时抢购', image: null }],
        limitInfo: [{ text: '限购5件' }],
        desc: images.slice(0, 2), // 使用前两张图作为详情图
        etitle: '',
        isAvailable: 1,
        promotionList: null,
        minProfitPrice: null,
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        list: formattedProducts,
        total,
        page,
        limit,
        hasMore: offset + limit < total,
      }
    })
  } catch (error) {
    console.error('Get products error:', error)

    // 如果数据库查询失败，返回空数据
    const { searchParams } = new URL(request.url)
    let page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    if (page < 1) page = 1

    return NextResponse.json({
      success: true,
      data: {
        list: [],
        total: 0,
        page,
        limit,
        hasMore: false,
      }
    })
  }
}
