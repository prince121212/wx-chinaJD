import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建剩余的mock商品数据...')

  // 获取现有分类
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  if (categories.length === 0) {
    console.log('请先运行基础种子数据脚本')
    return
  }

  const products = []

  // 商品5: 带帽午休毯虎年款 (spuId: '135681628')
  const product5 = await prisma.product.create({
    data: {
      spuId: '135681628',
      title: '带帽午休毯虎年款多功能加厚加大加绒简约多功能午休毯连帽披肩',
      description: '多功能午休毯，加厚加绒，连帽设计',
      categoryId: categories[2].id, // 儿童装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-20a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-20a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-20b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681629',
      productId: product5.id,
      price: 15900,
      originPrice: 20000,
      stockQuantity: 50,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '虎年款' },
        { specId: '10002', specTitle: '尺寸', specValueId: '10003', specValue: '标准版' },
      ]),
    },
  })
  products.push(product5)

  // 商品6: 迷你便携高颜值蓝牙无线耳机 (spuId: '135681626')
  const product6 = await prisma.product.create({
    data: {
      spuId: '135681626',
      title: '迷你便携高颜值蓝牙无线耳机立体声只能触控式操作简约立体声耳机',
      description: '迷你便携设计，高颜值蓝牙耳机，立体声音质',
      categoryId: categories[3].id, // 美妆 -> 改为数码
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-4a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-4a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-4b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681627',
      productId: product6.id,
      price: 8900,
      originPrice: 12900,
      stockQuantity: 80,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '白色' },
        { specId: '10002', specTitle: '版本', specValueId: '10003', specValue: '标准版' },
      ]),
    },
  })
  products.push(product6)

  // 商品7: 简约餐盘耐热家用盘子菜盘套装 (spuId: '135681622')
  const product7 = await prisma.product.create({
    data: {
      spuId: '135681622',
      title: '简约餐盘耐热家用盘子菜盘套装创意北欧风格家用简约餐盘',
      description: '简约北欧风格，耐热家用餐盘套装',
      categoryId: categories[3].id, // 美妆 -> 改为家居
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681623',
      productId: product7.id,
      price: 6900,
      originPrice: 9900,
      stockQuantity: 120,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '白色' },
        { specId: '10002', specTitle: '套装', specValueId: '10003', specValue: '4件套' },
      ]),
    },
  })
  products.push(product7)

  // 商品8: 不锈钢刀叉勺套装家用西餐餐具 (spuId: '135681624')
  const product8 = await prisma.product.create({
    data: {
      spuId: '135681624',
      title: '不锈钢刀叉勺套装家用西餐餐具创意高档牛排刀叉套装',
      description: '不锈钢材质，高档西餐餐具套装',
      categoryId: categories[3].id, // 美妆 -> 改为家居
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681625',
      productId: product8.id,
      price: 12900,
      originPrice: 18900,
      stockQuantity: 60,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '材质', specValueId: '10001', specValue: '不锈钢' },
        { specId: '10002', specTitle: '套装', specValueId: '10003', specValue: '6件套' },
      ]),
    },
  })
  products.push(product8)

  console.log('剩余商品数据创建完成')
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
