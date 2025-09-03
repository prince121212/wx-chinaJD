const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyProducts() {
  try {
    console.log('验证产品数据...')
    
    const products = await prisma.product.findMany({
      include: {
        skus: true
      },
      orderBy: { spuId: 'asc' }
    })

    console.log(`\n=== 产品验证结果 ===`)
    console.log(`总产品数量: ${products.length}`)
    
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.title}`)
      console.log(`   SPU ID: ${product.spuId}`)
      console.log(`   主图片: ${product.primaryImage}`)
      console.log(`   SKU数量: ${product.skus.length}`)
      
      const images = JSON.parse(product.images || '[]')
      console.log(`   图片数量: ${images.length}`)
      if (images.length > 0) {
        console.log(`   第一张图片: ${images[0]}`)
        if (images.length > 1) {
          console.log(`   第二张图片: ${images[1]}`)
        }
      }
    })

    // 验证图片是否正确更新
    const plateProduct = products.find(p => p.spuId === '135681622')
    const cutleryProduct = products.find(p => p.spuId === '135681624')
    const teaProduct = products.find(p => p.spuId === '135681660')

    console.log(`\n=== 图片验证 ===`)
    
    if (plateProduct) {
      const plateImages = JSON.parse(plateProduct.images || '[]')
      const expectedPlateImages = [
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1b.png'
      ]
      console.log(`简约餐盘图片更新: ${JSON.stringify(plateImages) === JSON.stringify(expectedPlateImages) ? '✅ 正确' : '❌ 错误'}`)
    }

    if (cutleryProduct) {
      const cutleryImages = JSON.parse(cutleryProduct.images || '[]')
      const expectedCutleryImages = [
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2b.png'
      ]
      console.log(`不锈钢刀叉勺图片更新: ${JSON.stringify(cutleryImages) === JSON.stringify(expectedCutleryImages) ? '✅ 正确' : '❌ 错误'}`)
    }

    if (teaProduct) {
      console.log(`茶具产品存在: ✅ 正确`)
      console.log(`茶具SKU数量: ${teaProduct.skus.length} (期望: 3)`)
    }

  } catch (error) {
    console.error('验证失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyProducts()
