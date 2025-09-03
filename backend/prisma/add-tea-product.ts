import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始添加手绘玲珑珠联碧合盖碗茶具商品...')

  try {
    // 获取现有分类
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    if (categories.length === 0) {
      console.log('请先运行基础种子数据脚本')
      return
    }

    // 创建茶具商品
    const teaProduct = await prisma.product.create({
      data: {
        spuId: '135681660',
        title: '手绘玲珑珠联碧合盖碗茶具景德镇陶瓷功夫茶具套装家用办公室泡茶器',
        description: '景德镇手绘陶瓷茶具，玲珑珠联碧合工艺，功夫茶具套装',
        categoryId: categories[3].id, // 美妆分类，可以当作生活用品
        primaryImage: 'https://si.geilicdn.com/pcitem1286456178-66640000019034d060a10a23038e_1280_1920.jpg.webp?w=640&h=640',
        images: JSON.stringify([
          'https://si.geilicdn.com/pcitem1286456178-66640000019034d060a10a23038e_1280_1920.jpg.webp?w=640&h=640',
          'https://si.geilicdn.com/pcitem1286456178-667b0000019034d0653a0a20e273_1279_1559.jpg.webp?w=750&h=750&cp=1',
          'https://si.geilicdn.com/poseidon-0120000001847fdd1ba10a2301af-unadjust_74_74.png.webp?w=100&h=100&cp=1',
          'https://si.geilicdn.com/pcitem1286456178-68b10000019034d05c780a20e284_1280_1650.jpg.webp?w=750&h=750&cp=1',
          'https://si.geilicdn.com/pcitem1286456178-667b0000019034d0653a0a20e273_1279_1559.jpg.webp?w=640&h=640',
          'https://si.geilicdn.com/pcitem1286456178-66640000019034d060a10a23038e_1280_1920.jpg.webp?w=750&h=750&cp=1',
          'https://si.geilicdn.com/pcitem1286456178-675d0000019034d05e7e0a2102c5_1280_1777.jpg.webp?w=30&h=30&cp=1',
          'https://si.geilicdn.com/pcitem1286456178-65860000019034d0630f0a239846_1280_1862.jpg.webp?w=750&h=750&cp=1',
          'https://si.geilicdn.com/pcitem1286456178-68b10000019034d05c780a20e284_1280_1650.jpg.webp?w=640&h=640'
        ]),
      },
    })

    // 创建商品SKU
    await Promise.all([
      // 基础款
      prisma.productSku.create({
        data: {
          skuId: '135681661',
          productId: teaProduct.id,
          price: 128000, // 1280元
          originPrice: 158000, // 1580元
          stockQuantity: 50,
          specInfo: JSON.stringify([
            { specId: '20001', specTitle: '款式', specValueId: '20002', specValue: '基础款' },
            { specId: '20003', specTitle: '容量', specValueId: '20004', specValue: '150ml' },
          ]),
        },
      }),
      // 精装款
      prisma.productSku.create({
        data: {
          skuId: '135681662',
          productId: teaProduct.id,
          price: 148000, // 1480元
          originPrice: 178000, // 1780元
          stockQuantity: 30,
          specInfo: JSON.stringify([
            { specId: '20001', specTitle: '款式', specValueId: '20005', specValue: '精装款' },
            { specId: '20003', specTitle: '容量', specValueId: '20004', specValue: '150ml' },
          ]),
        },
      }),
      // 礼盒装
      prisma.productSku.create({
        data: {
          skuId: '135681663',
          productId: teaProduct.id,
          price: 168000, // 1680元
          originPrice: 198000, // 1980元
          stockQuantity: 20,
          specInfo: JSON.stringify([
            { specId: '20001', specTitle: '款式', specValueId: '20006', specValue: '礼盒装' },
            { specId: '20003', specTitle: '容量', specValueId: '20007', specValue: '200ml' },
          ]),
        },
      }),
    ])

    console.log('手绘玲珑珠联碧合盖碗茶具商品创建完成')
    console.log('商品ID:', teaProduct.id)
    console.log('SPU ID:', teaProduct.spuId)
    console.log('创建了3个SKU规格')

  } catch (error) {
    console.error('创建茶具商品失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
