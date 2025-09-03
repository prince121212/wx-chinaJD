import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始添加更多商品数据...')

  // 获取现有分类
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  if (categories.length === 0) {
    console.log('请先运行基础种子数据脚本')
    return
  }

  const products = []

  // 商品9: 女士羽绒服
  const product9 = await prisma.product.create({
    data: {
      spuId: '135681650',
      title: '女士羽绒服冬季新款加厚保暖长款羽绒外套时尚修身显瘦',
      description: '冬季保暖羽绒服，加厚设计，修身显瘦',
      categoryId: categories[0].id, // 女装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-04a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-04a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-04b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681640',
      productId: product9.id,
      price: 45900,
      originPrice: 59900,
      stockQuantity: 80,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '黑色' },
        { specId: '10002', specTitle: '尺码', specValueId: '10003', specValue: 'M' },
      ]),
    },
  })
  products.push(product9)

  // 商品10: 男士休闲裤
  const product10 = await prisma.product.create({
    data: {
      spuId: '135681651',
      title: '男士休闲裤春秋新款直筒宽松长裤商务休闲百搭裤子',
      description: '春秋新款休闲裤，直筒宽松设计，商务休闲两用',
      categoryId: categories[1].id, // 男装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-11a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-11a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-11b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681641',
      productId: product10.id,
      price: 18900,
      originPrice: 25900,
      stockQuantity: 120,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '深蓝色' },
        { specId: '10002', specTitle: '尺码', specValueId: '10003', specValue: 'L' },
      ]),
    },
  })
  products.push(product10)

  // 商品11: 儿童毛衣
  const product11 = await prisma.product.create({
    data: {
      spuId: '135681652',
      title: '儿童毛衣秋冬新款加厚保暖针织衫男女童套头毛衣',
      description: '儿童专用毛衣，加厚保暖，男女童通用',
      categoryId: categories[2].id, // 儿童装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-12a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-12a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-12b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681642',
      productId: product11.id,
      price: 12900,
      originPrice: 18900,
      stockQuantity: 90,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '粉色' },
        { specId: '10002', specTitle: '尺码', specValueId: '10003', specValue: '110cm' },
      ]),
    },
  })
  products.push(product11)

  // 商品12: 护肤套装
  const product12 = await prisma.product.create({
    data: {
      spuId: '135681653',
      title: '护肤套装补水保湿美白淡斑精华液面霜洁面乳套装',
      description: '全套护肤产品，补水保湿，美白淡斑',
      categoryId: categories[3].id, // 美妆
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/mz-01a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/mz-01a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/mz-01b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135681643',
      productId: product12.id,
      price: 29900,
      originPrice: 39900,
      stockQuantity: 60,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '套装', specValueId: '10001', specValue: '基础套装' },
        { specId: '10002', specTitle: '规格', specValueId: '10003', specValue: '50ml' },
      ]),
    },
  })
  products.push(product12)

  console.log('更多商品数据创建完成')
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
