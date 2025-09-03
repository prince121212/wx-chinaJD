import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const categoryId = searchParams.get('categoryId')
    const keyword = searchParams.get('keyword')

    // 修正page参数，确保最小为1
    if (page < 1) page = 1

    console.log('API请求参数 - 使用Supabase:', { page, limit, categoryId, keyword })

    // 从Supabase获取产品数据
    const result = await SupabaseService.getProducts(page, limit)
    const { products, total } = result
    console.log('Supabase查询结果:', {
      total,
      page,
      limit,
      返回商品数量: products.length
    })

    // 为每个产品获取SKU数据
    const formattedProducts = []
    for (const product of products) {
      const skus = await SupabaseService.getProductSkus(product.id)
      const images = product.images ? JSON.parse(product.images) : []

      // 计算价格范围
      const prices = skus.map(sku => parseFloat(sku.price))
      const salePrices = skus.map(sku => sku.salePrice ? parseFloat(sku.salePrice) : parseFloat(sku.price))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const minSalePrice = Math.min(...salePrices)
      const maxSalePrice = Math.max(...salePrices)
      const totalStock = skus.reduce((sum, sku) => sum + sku.stock, 0)

      const formattedProduct = {
        saasId: product.saasId || '88888888',
        storeId: product.storeId || '1000',
        spuId: product.spuId,
        title: product.title,
        primaryImage: product.primaryImage,
        images,
        video: null,
        available: 1,
        minSalePrice: minPrice,
        minLinePrice: minSalePrice,
        maxSalePrice: maxPrice,
        maxLinePrice: maxSalePrice,
        spuStockQuantity: totalStock,
        soldNum: product.soldCount || 0,
        isPutOnSale: product.status,
        categoryIds: product.categoryId ? [product.categoryId] : [],
        specList: [],
        skuList: skus.map(sku => ({
          skuId: sku.skuId,
          skuImage: sku.image || product.primaryImage,
          specInfo: sku.specs ? JSON.parse(sku.specs) : [],
          priceInfo: [
            { priceType: 1, price: sku.price, priceTypeName: '销售价格' },
            { priceType: 2, price: sku.salePrice || sku.price, priceTypeName: '划线价格' },
          ],
          stockInfo: {
            stockQuantity: sku.stock,
            safeStockQuantity: 0,
            soldQuantity: sku.soldCount || 0,
          },
          weight: { value: null, unit: 'KG' },
          volume: null,
          profitPrice: null,
        })),
        spuTagList: [{ id: '13001', title: '限时抢购', image: null }],
        limitInfo: [{ text: '限购5件' }],
        desc: images.slice(0, 2),
        etitle: '',
        isAvailable: 1,
        promotionList: null,
        minProfitPrice: null,
      }

      formattedProducts.push(formattedProduct)
    }

    return NextResponse.json({
      success: true,
      data: {
        list: formattedProducts,
        total,
        page,
        limit,
        hasMore: (page * limit) < total,
      }
    })
  } catch (error) {
    console.error('Get products error:', error)

    // 如果Supabase查询失败，返回空数据
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
