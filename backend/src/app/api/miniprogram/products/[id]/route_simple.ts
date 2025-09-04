import { NextRequest, NextResponse } from 'next/server'

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
        {
          priceType: 1,
          price: '29800',
          priceTypeName: null,
        },
        {
          priceType: 2,
          price: '40000',
          priceTypeName: null,
        },
      ],
      stockInfo: {
        stockQuantity: 175,
        safeStockQuantity: 0,
        soldQuantity: 0,
      },
      weight: {
        value: null,
        unit: 'KG',
      },
      volume: null,
      profitPrice: null,
    },
  ],
  spuTagList: [
    {
      id: '13001',
      title: '限时抢购',
      image: null,
    },
  ],
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
    // 强制动态渲染
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const spuId = params.id
    console.log('获取产品详情 - 简化版本:', { spuId, userAgent })
    
    // 直接返回mock数据进行测试
    return NextResponse.json({
      success: true,
      data: { ...mockProductDetail, spuId }
    })
    
  } catch (error) {
    console.error('Get product detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取商品详情失败' },
      { status: 500 }
    )
  }
}
