import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 检查是否是商品详情请求（通过id参数判断）
    const productId = searchParams.get('id')
    if (productId) {
      // 重定向到工作的商品详情API
      const baseUrl = request.url.split('/api/')[0]
      const detailApiUrl = `${baseUrl}/api/miniprogram/product-detail?id=${productId}`

      console.log('商品详情请求，重定向到:', detailApiUrl)

      const response = await fetch(detailApiUrl, {
        method: 'GET',
        headers: {
          'user-agent': request.headers.get('user-agent') || 'unknown',
        }
      })

      if (!response.ok) {
        throw new Error(`商品详情API调用失败: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    }

    // 商品列表请求的原有逻辑
    let page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const categoryId = searchParams.get('categoryId')
    const keyword = searchParams.get('keyword')

    // 修正page参数，确保最小为1
    if (page < 1) page = 1

    console.log('API请求参数 - 使用Supabase:', { page, limit, categoryId, keyword })

    // 从Supabase获取产品数据，添加重试机制
    let result = null
    let retryCount = 0
    const maxRetries = 3

    while (retryCount < maxRetries) {
      try {
        result = await SupabaseService.getProducts(page, limit)
        break // 成功则跳出循环
      } catch (error) {
        retryCount++
        console.log(`商品查询失败，重试 ${retryCount}/${maxRetries}:`, (error as any)?.message || error)
        if (retryCount >= maxRetries) {
          throw error
        }
        // 等待1秒后重试
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    const { products, total } = result || { products: [], total: 0 }
    console.log('Supabase查询结果:', {
      total,
      page,
      limit,
      返回商品数量: products.length
    })

    // 检查是否超出数据范围
    if (page > 1 && products.length === 0 && total > 0) {
      // 如果是第2页及以后，且没有数据，但总数大于0，说明已经到达末尾
      return NextResponse.json({
        success: true,
        data: {
          list: [],
          total,
          page,
          limit,
          hasMore: false,
        }
      })
    }

    // 为每个产品获取SKU数据
    const formattedProducts = []
    for (const product of products) {
      // 获取SKU数据，添加重试机制
      let skus = []
      let skuRetryCount = 0
      const skuMaxRetries = 3

      while (skuRetryCount < skuMaxRetries) {
        try {
          skus = await SupabaseService.getProductSkus(product.id)
          break // 成功则跳出循环
        } catch (error) {
          skuRetryCount++
          console.log(`SKU查询失败，重试 ${skuRetryCount}/${skuMaxRetries}:`, (error as any)?.message || error)
          if (skuRetryCount >= skuMaxRetries) {
            console.log(`产品 ${product.id} 的SKU查询失败，使用空数组`)
            skus = [] // 如果SKU查询失败，使用空数组
            break
          }
          // 等待500ms后重试
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      const images = product.images ? JSON.parse(product.images) : []

      // 计算价格范围
      const prices = skus.map((sku: any) => parseFloat(sku.price))
      const salePrices = skus.map((sku: any) => sku.salePrice ? parseFloat(sku.salePrice) : parseFloat(sku.price))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      const minSalePrice = Math.min(...salePrices)
      const maxSalePrice = Math.max(...salePrices)
      const totalStock = skus.reduce((sum: number, sku: any) => sum + sku.stock, 0)

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
        skuList: skus.map((sku: any) => ({
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
    return NextResponse.json(
      { success: false, msg: '获取商品列表失败' },
      { status: 500 }
    )
  }
}
