import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建完整的种子数据...')

  // 清空现有数据（按依赖关系顺序删除）
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

  // 1. 创建轮播图数据 - 基于mock数据
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        title: '轮播图1',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner1.png',
        sortOrder: 1,
      },
    }),
    prisma.banner.create({
      data: {
        title: '轮播图2',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner2.png',
        sortOrder: 2,
      },
    }),
    prisma.banner.create({
      data: {
        title: '轮播图3',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner3.png',
        sortOrder: 3,
      },
    }),
    prisma.banner.create({
      data: {
        title: '轮播图4',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner4.png',
        sortOrder: 4,
      },
    }),
    prisma.banner.create({
      data: {
        title: '轮播图5',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner5.png',
        sortOrder: 5,
      },
    }),
    prisma.banner.create({
      data: {
        title: '轮播图6',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/home/v2/banner6.png',
        sortOrder: 6,
      },
    }),
  ])
  console.log('轮播图数据创建完成')

  // 2. 创建分类数据 - 基于mock数据
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
        name: '儿童装',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: '美妆',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/category-default.png',
        sortOrder: 4,
      },
    }),
  ])
  console.log('分类数据创建完成')

  // 3. 创建优惠券数据 - 基于mock数据
  const coupons = []
  for (let i = 0; i < 10; i++) {
    const type = (i % 2) + 1 // 1: 满减券, 2: 折扣券
    const coupon = await prisma.coupon.create({
      data: {
        title: type === 2 ? `生鲜折扣券 - ${i}` : `生鲜满减券 - ${i}`,
        description: i > 0 ? `满${i * 100}元可用` : '无门槛使用',
        type: type,
        discountValue: type === 2 ? 550 : 1800, // 5.5折 或 18元
        minAmount: 10000 * i, // 满n元
        startTime: new Date('2019-11-18'),
        endTime: new Date('2023-12-18'),
        totalCount: 1000,
      },
    })
    coupons.push(coupon)
  }
  console.log('优惠券数据创建完成')

  // 4. 创建商品数据 - 基于mock数据
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
  await Promise.all([
    prisma.productSku.create({
      data: {
        skuId: '135676631',
        productId: product1.id,
        price: 29800,
        originPrice: 40000,
        stockQuantity: 175,
        specInfo: JSON.stringify([
          { specId: '10011', specTitle: '颜色', specValueId: '10012', specValue: '米色荷叶边' },
          { specId: '10013', specTitle: '尺码', specValueId: '11014', specValue: 'S' },
        ]),
      },
    }),
    prisma.productSku.create({
      data: {
        skuId: '135676632',
        productId: product1.id,
        price: 29800,
        originPrice: 40000,
        stockQuantity: 158,
        specInfo: JSON.stringify([
          { specId: '10011', specTitle: '颜色', specValueId: '10012', specValue: '米色荷叶边' },
          { specId: '10013', specTitle: '尺码', specValueId: '11013', specValue: 'L' },
        ]),
      },
    }),
    prisma.productSku.create({
      data: {
        skuId: '135681631',
        productId: product1.id,
        price: 29800,
        originPrice: 40000,
        stockQuantity: 177,
        specInfo: JSON.stringify([
          { specId: '10011', specTitle: '颜色', specValueId: '10012', specValue: '米色荷叶边' },
          { specId: '10013', specTitle: '尺码', specValueId: '10014', specValue: 'M' },
        ]),
      },
    }),
  ])
  products.push(product1)

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
