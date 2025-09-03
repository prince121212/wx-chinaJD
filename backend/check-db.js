const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('检查数据库数据...')
    
    // 检查轮播图
    const banners = await prisma.banner.findMany()
    console.log('轮播图数据:', banners.length, '条')
    banners.forEach((banner, index) => {
      console.log(`  ${index + 1}. ${banner.title}: ${banner.image}`)
    })
    
    // 检查分类
    const categories = await prisma.category.findMany()
    console.log('\n分类数据:', categories.length, '条')
    categories.forEach((category, index) => {
      console.log(`  ${index + 1}. ${category.name}: ${category.image}`)
    })
    
    // 检查商品
    const products = await prisma.product.findMany({
      include: {
        skus: true
      }
    })
    console.log('\n商品数据:', products.length, '条')
    products.forEach((product, index) => {
      console.log(`  ${index + 1}. ${product.title} (${product.spuId}) - SKU数量: ${product.skus.length}`)
    })
    
    // 检查优惠券
    const coupons = await prisma.coupon.findMany()
    console.log('\n优惠券数据:', coupons.length, '条')
    
  } catch (error) {
    console.error('检查数据库失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
