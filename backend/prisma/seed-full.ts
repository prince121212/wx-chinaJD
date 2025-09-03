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

  // 1. 创建轮播图数据 - 完整的6个轮播图
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

  // 3. 创建优惠券数据
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

  console.log('数据种子创建完成！')
  console.log(`创建了 ${banners.length} 个轮播图`)
  console.log(`创建了 ${categories.length} 个分类`)
  console.log(`创建了 ${coupons.length} 个优惠券`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
