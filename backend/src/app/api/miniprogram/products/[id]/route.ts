import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Mock商品详情数据
const mockProductDetail = {
  saasId: '88888888',
  storeId: '1000',
  spuId: 'SPU001',
  title: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
  primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
  images: [
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09b.png',
  ],
  video: null,
  available: 1,
  minSalePrice: 29800,
  minLinePrice: 29800,
  maxSalePrice: 29800,
  maxLinePrice: 40000,
  spuStockQuantity: 510,
  soldNum: 1020,
  isPutOnSale: 1,
  categoryIds: ['127880527393854975', '127880527393854976', '127880537778953984'],
  specList: [
    {
      specId: '10011',
      title: '颜色',
      specValueList: [
        {
          specValueId: '10012',
          specId: null,
          saasId: null,
          specValue: '米色荷叶边',
          image: null,
        },
      ],
    },
    {
      specId: '10013',
      title: '尺码',
      specValueList: [
        {
          specValueId: '11014',
          specId: null,
          saasId: null,
          specValue: 'S',
          image: null,
        },
        {
          specValueId: '10014',
          specId: null,
          saasId: null,
          specValue: 'M',
          image: null,
        },
        {
          specValueId: '11013',
          specId: null,
          saasId: null,
          specValue: 'L',
          image: null,
        },
      ],
    },
  ],
  skuList: [
    {
      skuId: '135676631',
      skuImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      specInfo: [
        {
          specId: '10011',
          specTitle: null,
          specValueId: '10012',
          specValue: null,
        },
        {
          specId: '10013',
          specTitle: null,
          specValueId: '11014',
          specValue: null,
        },
      ],
      priceInfo: [
        { priceType: 1, price: '29800', priceTypeName: null },
        { priceType: 2, price: '40000', priceTypeName: null },
      ],
      stockInfo: {
        stockQuantity: 175,
        safeStockQuantity: 0,
        soldQuantity: 0,
      },
      weight: { value: null, unit: 'KG' },
      volume: null,
      profitPrice: null,
    },
  ],
  spuTagList: [{ id: '13001', title: '限时抢购', image: null }],
  limitInfo: [
    {
      text: '限购5件',
    },
  ],
  desc: [
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09c.png',
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09d.png',
  ],
  etitle: '',
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const spuId = params.id

    // 尝试从数据库获取数据，如果失败则使用mock数据
    try {
      const product = await prisma.product.findFirst({
        where: {
          spuId,
          status: 1,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            }
          },
          skus: {
            where: { status: 1 },
            select: {
              id: true,
              skuId: true,
              price: true,
              originPrice: true,
              stockQuantity: true,
              specInfo: true,
            }
          }
        },
      })

      if (!product) {
        // 如果数据库中没有找到，返回mock数据
        return NextResponse.json({
          success: true,
          data: { ...mockProductDetail, spuId }
        })
      }

      // 转换为mock数据格式
      const prices = product.skus.map(sku => sku.price)
      const originPrices = product.skus.map(sku => sku.originPrice)
      const images = product.images ? JSON.parse(product.images) : [product.primaryImage]

      // 从SKU规格信息中提取specList
      const specMap = new Map()
      product.skus.forEach(sku => {
        if (sku.specInfo) {
          const specInfo = JSON.parse(sku.specInfo)
          specInfo.forEach(spec => {
            if (!specMap.has(spec.specId)) {
              specMap.set(spec.specId, {
                specId: spec.specId,
                title: spec.specTitle,
                specValueList: []
              })
            }
            const specGroup = specMap.get(spec.specId)
            if (!specGroup.specValueList.find(v => v.specValueId === spec.specValueId)) {
              specGroup.specValueList.push({
                specValueId: spec.specValueId,
                specId: spec.specId,
                saasId: null,
                specValue: spec.specValue,
                image: null,
              })
            }
          })
        }
      })

      const formattedProduct = {
        saasId: '88888888',
        storeId: '1000',
        spuId: product.spuId,
        title: product.title,
        primaryImage: product.primaryImage,
        images,
        video: null,
        available: 1,
        minSalePrice: Math.min(...prices),
        minLinePrice: Math.min(...prices),
        maxSalePrice: Math.max(...prices),
        maxLinePrice: Math.max(...originPrices),
        spuStockQuantity: product.skus.reduce((sum, sku) => sum + sku.stockQuantity, 0),
        soldNum: Math.floor(Math.random() * 1000) + 100,
        isPutOnSale: 1,
        categoryIds: [product.categoryId],
        specList: Array.from(specMap.values()),
        skuList: product.skus.map(sku => ({
          skuId: sku.skuId,
          skuImage: product.primaryImage,
          specInfo: sku.specInfo ? JSON.parse(sku.specInfo) : [],
          priceInfo: [
            { priceType: 1, price: sku.price.toString(), priceTypeName: null },
            { priceType: 2, price: sku.originPrice.toString(), priceTypeName: null },
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
        spuTagList: [{ id: '13001', title: '热销商品', image: null }],
        limitInfo: [{ text: '限购5件' }],
        desc: images.length > 1 ? images.slice(1) : images,
        etitle: '',
      }

      return NextResponse.json({
        success: true,
        data: formattedProduct
      })

    } catch (dbError) {
      console.warn('Database query failed, using mock data:', dbError)

      // 数据库查询失败，返回mock数据
      return NextResponse.json({
        success: true,
        data: { ...mockProductDetail, spuId }
      })
    }
  } catch (error) {
    console.error('Get product detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取商品详情失败' },
      { status: 500 }
    )
  }
}