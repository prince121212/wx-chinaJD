import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建简化种子数据...')

  // 清空现有数据
  try {
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.userCoupon.deleteMany()
    await prisma.productSku.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.banner.deleteMany()
    await prisma.coupon.deleteMany()
    await prisma.address.deleteMany()
    await prisma.user.deleteMany()
    console.log('已清空现有数据')
  } catch (error) {
    console.log('清空数据时出错，可能是首次运行:', error.message)
  }

  // 1. 创建轮播图数据
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: '新品上市',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner1.png',
        sortOrder: 1,
      },
    }),
    prisma.banner.create({
      data: {
        title: '限时优惠',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner2.png',
        sortOrder: 2,
      },
    }),
    prisma.banner.create({
      data: {
        title: '热销商品',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner3.png',
        sortOrder: 3,
      },
    }),
  ])
  console.log('轮播图数据创建完成')

  // 2. 创建分类数据
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: '女装',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: '男装',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: '电器数码',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
        sortOrder: 3,
      },
    }),
  ])
  console.log('分类数据创建完成')

  // 3. 创建优惠券数据
  const coupons = await Promise.all([
    prisma.coupon.create({
      data: {
        title: '新用户专享',
        description: '新用户首次购买享受优惠',
        type: 1, // 满减券
        discountValue: 1000, // 10元
        minAmount: 5000, // 满50元
        startTime: new Date(),
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
        totalCount: 1000,
      },
    }),
    prisma.coupon.create({
      data: {
        title: '满减优惠券',
        description: '购物满100减20',
        type: 1, // 满减券
        discountValue: 2000, // 20元
        minAmount: 10000, // 满100元
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60天后
        totalCount: 500,
      },
    }),
  ])
  console.log('优惠券数据创建完成')

  // 4. 创建商品数据
  const products = []
  
  // 商品1: 白色短袖连衣裙
  const product1 = await prisma.product.create({
    data: {
      spuId: '0',
      title: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
      description: '纯白色连衣裙，荷叶边设计，宽松舒适',
      categoryId: categories[0].id, // 女装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09b.png',
      ]),
    },
  })
  
  // 为商品1创建SKU
  await prisma.productSku.create({
    data: {
      skuId: '135681631',
      productId: product1.id,
      price: 29800, // 以分为单位
      originPrice: 40000,
      stockQuantity: 177,
      specInfo: JSON.stringify([
        { specId: '10011', specTitle: '颜色', specValueId: '10012', specValue: '米色荷叶边' },
        { specId: '10013', specTitle: '尺码', specValueId: '10014', specValue: 'M' },
      ]),
    },
  })
  
  products.push(product1)

  // 商品2: 纯色纯棉休闲圆领短袖T恤
  const product2 = await prisma.product.create({
    data: {
      spuId: '135686633',
      title: '纯色纯棉休闲圆领短袖T恤纯白亲肤厚柔软细腻面料纯白短袖套头T恤',
      description: '纯棉材质，舒适透气，经典圆领设计',
      categoryId: categories[1].id, // 男装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-08b.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-08a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-08b.png',
      ]),
    },
  })
  
  // 为商品2创建SKU
  await prisma.productSku.create({
    data: {
      skuId: '135686634',
      productId: product2.id,
      price: 25900,
      originPrice: 31900,
      stockQuantity: 100,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '白色' },
        { specId: '10002', specTitle: '尺码', specValueId: '10003', specValue: 'M' },
      ]),
    },
  })
  
  products.push(product2)

  // 商品3: 腾讯极光盒子4智能网络电视机顶盒
  const product3 = await prisma.product.create({
    data: {
      spuId: '135686623',
      title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
      description: '高清4K视频播放，支持多种视频格式，网络机顶盒',
      categoryId: categories[2].id, // 电器数码
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3b.png',
      ]),
    },
  })
  
  // 为商品3创建SKU
  await prisma.productSku.create({
    data: {
      skuId: '135691623',
      productId: product3.id,
      price: 10900,
      originPrice: 16900,
      stockQuantity: 100,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '经典白' },
        { specId: '10002', specTitle: '类型', specValueId: '11002', specValue: '尊享礼盒装' },
      ]),
    },
  })
  
  products.push(product3)

  console.log('商品数据创建完成')

  console.log('数据种子创建完成！')
  console.log(`创建了 ${banners.length} 个轮播图`)
  console.log(`创建了 ${categories.length} 个分类`)
  console.log(`创建了 ${coupons.length} 个优惠券`)
  console.log(`创建了 ${products.length} 个商品`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
