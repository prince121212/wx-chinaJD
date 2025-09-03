import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始清理产品数据，只保留指定的3个产品...')

  try {
    // 要保留的产品SPU ID
    const keepProducts = [
      '135681660', // 手绘玲珑珠联碧合盖碗茶具
      '135681624', // 不锈钢刀叉勺套装家用西餐餐具
      '135681622', // 简约餐盘耐热家用盘子菜盘套装
    ]

    // 1. 删除不需要的产品的SKU
    console.log('删除不需要的产品SKU...')
    const productsToDelete = await prisma.product.findMany({
      where: {
        spuId: {
          notIn: keepProducts
        }
      },
      select: { id: true, spuId: true, title: true }
    })

    console.log(`找到 ${productsToDelete.length} 个需要删除的产品`)
    
    for (const product of productsToDelete) {
      console.log(`删除产品: ${product.title} (${product.spuId})`)
      
      // 删除该产品的所有SKU
      await prisma.productSku.deleteMany({
        where: { productId: product.id }
      })
      
      // 删除产品
      await prisma.product.delete({
        where: { id: product.id }
      })
    }

    // 2. 更新保留产品的图片
    console.log('更新保留产品的图片...')

    // 更新简约餐盘的图片
    const plateProduct = await prisma.product.findFirst({
      where: { spuId: '135681622' }
    })
    
    if (plateProduct) {
      await prisma.product.update({
        where: { id: plateProduct.id },
        data: {
          primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
          images: JSON.stringify([
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1b.png',
          ])
        }
      })
      console.log('已更新简约餐盘的图片')
    }

    // 更新不锈钢刀叉勺套装的图片
    const cutleryProduct = await prisma.product.findFirst({
      where: { spuId: '135681624' }
    })
    
    if (cutleryProduct) {
      await prisma.product.update({
        where: { id: cutleryProduct.id },
        data: {
          primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
          images: JSON.stringify([
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2b.png',
          ])
        }
      })
      console.log('已更新不锈钢刀叉勺套装的图片')
    }

    // 3. 验证最终结果
    const remainingProducts = await prisma.product.findMany({
      include: {
        skus: true
      }
    })

    console.log('\n=== 清理完成 ===')
    console.log(`保留的产品数量: ${remainingProducts.length}`)
    
    remainingProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} (${product.spuId}) - SKU数量: ${product.skus.length}`)
      console.log(`   主图片: ${product.primaryImage}`)
    })

  } catch (error) {
    console.error('清理产品数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
