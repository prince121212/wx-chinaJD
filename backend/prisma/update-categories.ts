import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始更新分类图片...')

  try {
    // 更新分类图片为更具体的图片
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' }
    })

    for (const category of categories) {
      let newImage = category.image
      
      switch (category.name) {
        case '女装':
          newImage = 'https://tdesign.gtimg.com/miniprogram/template/retail/classify/img-9.png' // 连衣裙图片
          break
        case '男装':
          newImage = 'https://tdesign.gtimg.com/miniprogram/template/retail/classify/img-1.png' // 卫衣图片
          break
        case '儿童装':
          newImage = 'https://tdesign.gtimg.com/miniprogram/template/retail/classify/img-5.png' // 毛衣图片
          break
        case '美妆':
          newImage = 'https://tdesign.gtimg.com/miniprogram/template/retail/classify/img-3.png' // 雪纺衫图片
          break
      }

      if (newImage !== category.image) {
        await prisma.category.update({
          where: { id: category.id },
          data: { image: newImage }
        })
        console.log(`更新分类 ${category.name} 的图片`)
      }
    }

    console.log('分类图片更新完成')
  } catch (error) {
    console.error('更新分类图片失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
