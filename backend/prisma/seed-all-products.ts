import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建所有商品数据...')

  // 获取现有分类
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  })

  if (categories.length === 0) {
    console.log('请先运行基础种子数据脚本')
    return
  }

  // 清空现有商品数据
  await prisma.productSku.deleteMany()
  await prisma.product.deleteMany()

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
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-08a1.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-08b.png',
      ]),
    },
  })

  await Promise.all([
    prisma.productSku.create({
      data: {
        skuId: '135686634',
        productId: product2.id,
        price: 25900,
        originPrice: 31900,
        stockQuantity: 100, // 修正负库存
        specInfo: JSON.stringify([
          { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '白色' },
          { specId: '10002', specTitle: '尺码', specValueId: '10003', specValue: 'M' },
        ]),
      },
    }),
    prisma.productSku.create({
      data: {
        skuId: '135691631',
        productId: product2.id,
        price: 26900,
        originPrice: 31900,
        stockQuantity: 177,
        specInfo: JSON.stringify([
          { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '白色' },
          { specId: '10002', specTitle: '尺码', specValueId: '11003', specValue: 'S' },
        ]),
      },
    }),
    prisma.productSku.create({
      data: {
        skuId: '135691632',
        productId: product2.id,
        price: 26900,
        originPrice: 31900,
        stockQuantity: 150,
        specInfo: JSON.stringify([
          { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '白色' },
          { specId: '10002', specTitle: '尺码', specValueId: '11002', specValue: 'L' },
        ]),
      },
    }),
  ])
  products.push(product2)

  // 商品3: 运动连帽拉链卫衣
  const product3 = await prisma.product.create({
    data: {
      spuId: '135691628',
      title: '运动连帽拉链卫衣休闲开衫长袖多色运动细绒面料运动上衣',
      description: '运动休闲风格，连帽拉链设计，多色可选',
      categoryId: categories[1].id, // 男装
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-17a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-17a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-17b.png',
      ]),
    },
  })

  await prisma.productSku.create({
    data: {
      skuId: '135691629',
      productId: product3.id,
      price: 25900,
      originPrice: 31900,
      stockQuantity: 100,
      specInfo: JSON.stringify([
        { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '军绿色' },
        { specId: '10002', specTitle: '尺码', specValueId: '10003', specValue: 'M' },
      ]),
    },
  })
  products.push(product3)

  // 商品4: 腾讯极光盒子4智能网络电视机顶盒
  const product4 = await prisma.product.create({
    data: {
      spuId: '135686623',
      title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
      description: '高清4K视频播放，支持多种视频格式，网络机顶盒',
      categoryId: categories[3].id, // 美妆 -> 改为数码
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3b.png',
      ]),
    },
  })

  await Promise.all([
    prisma.productSku.create({
      data: {
        skuId: '135686624',
        productId: product4.id,
        price: 9900,
        originPrice: 16900,
        stockQuantity: 98,
        specInfo: JSON.stringify([
          { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '经典白' },
          { specId: '10002', specTitle: '类型', specValueId: '10003', specValue: '节能套装' },
        ]),
      },
    }),
    prisma.productSku.create({
      data: {
        skuId: '135686625',
        productId: product4.id,
        price: 10900,
        originPrice: 16900,
        stockQuantity: 100,
        specInfo: JSON.stringify([
          { specId: '10000', specTitle: '颜色', specValueId: '11000', specValue: '贵族青' },
          { specId: '10002', specTitle: '类型', specValueId: '11003', specValue: '经典套装' },
        ]),
      },
    }),
    prisma.productSku.create({
      data: {
        skuId: '135691623',
        productId: product4.id,
        price: 10900,
        originPrice: 16900,
        stockQuantity: 100,
        specInfo: JSON.stringify([
          { specId: '10000', specTitle: '颜色', specValueId: '10001', specValue: '经典白' },
          { specId: '10002', specTitle: '类型', specValueId: '11002', specValue: '尊享礼盒装' },
        ]),
      },
    }),
  ])
  products.push(product4)

  console.log('商品数据创建完成')
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
