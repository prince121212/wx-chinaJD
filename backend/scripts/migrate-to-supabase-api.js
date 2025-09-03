const { createClient } = require('@supabase/supabase-js')
const { PrismaClient } = require('@prisma/client')

async function migrateToSupabaseAPI() {
  console.log('🚀 使用REST API迁移数据到Supabase...')
  
  // 初始化客户端
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // 临时切换到SQLite读取本地数据
  const tempEnv = process.env.DATABASE_URL
  process.env.DATABASE_URL = 'file:./dev.db'

  // 创建新的Prisma客户端实例，强制使用SQLite
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'file:./dev.db'
      }
    }
  })
  
  try {
    // 1. 迁移分类数据
    console.log('\n📂 迁移分类数据...')
    const categories = await prisma.category.findMany()
    console.log(`找到 ${categories.length} 个分类`)
    
    for (const category of categories) {
      const { error } = await supabase
        .from('Category')
        .upsert({
          id: category.id,
          name: category.name,
          icon: category.icon,
          image: category.image,
          sortOrder: category.sortOrder,
          status: category.status,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString()
        })
      
      if (error) {
        console.log(`❌ 分类 ${category.name} 迁移失败:`, error.message)
      } else {
        console.log(`✅ 分类 ${category.name} 迁移成功`)
      }
    }
    
    // 2. 迁移产品数据
    console.log('\n📦 迁移产品数据...')
    const products = await prisma.product.findMany({
      include: { skus: true }
    })
    console.log(`找到 ${products.length} 个产品`)
    
    for (const product of products) {
      // 迁移产品
      const { error: productError } = await supabase
        .from('Product')
        .upsert({
          id: product.id,
          saasId: product.saasId,
          storeId: product.storeId,
          spuId: product.spuId,
          title: product.title,
          description: product.description,
          categoryId: product.categoryId,
          primaryImage: product.primaryImage,
          images: product.images,
          minPrice: product.minPrice?.toString(),
          maxPrice: product.maxPrice?.toString(),
          minSalePrice: product.minSalePrice?.toString(),
          maxSalePrice: product.maxSalePrice?.toString(),
          totalStock: product.totalStock,
          soldCount: product.soldCount,
          viewCount: product.viewCount,
          sortOrder: product.sortOrder,
          status: product.status,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString()
        })
      
      if (productError) {
        console.log(`❌ 产品 ${product.title} 迁移失败:`, productError.message)
        continue
      } else {
        console.log(`✅ 产品 ${product.title} 迁移成功`)
      }
      
      // 迁移SKU
      for (const sku of product.skus) {
        const { error: skuError } = await supabase
          .from('ProductSku')
          .upsert({
            id: sku.id,
            productId: sku.productId,
            skuId: sku.skuId,
            title: sku.title,
            image: sku.image,
            price: sku.price?.toString(),
            salePrice: sku.salePrice?.toString(),
            stock: sku.stock,
            soldCount: sku.soldCount,
            specs: sku.specs,
            status: sku.status,
            createdAt: sku.createdAt.toISOString(),
            updatedAt: sku.updatedAt.toISOString()
          })
        
        if (skuError) {
          console.log(`❌ SKU ${sku.title} 迁移失败:`, skuError.message)
        } else {
          console.log(`✅ SKU ${sku.title} 迁移成功`)
        }
      }
    }
    
    // 3. 迁移轮播图数据
    console.log('\n🖼️  迁移轮播图数据...')
    const banners = await prisma.banner.findMany()
    console.log(`找到 ${banners.length} 个轮播图`)
    
    for (const banner of banners) {
      const { error } = await supabase
        .from('Banner')
        .upsert({
          id: banner.id,
          title: banner.title,
          image: banner.image,
          link: banner.link,
          linkType: banner.linkType,
          sortOrder: banner.sortOrder,
          status: banner.status,
          createdAt: banner.createdAt.toISOString(),
          updatedAt: banner.updatedAt.toISOString()
        })
      
      if (error) {
        console.log(`❌ 轮播图 ${banner.title} 迁移失败:`, error.message)
      } else {
        console.log(`✅ 轮播图 ${banner.title} 迁移成功`)
      }
    }
    
    // 4. 迁移优惠券数据
    console.log('\n🎫 迁移优惠券数据...')
    const coupons = await prisma.coupon.findMany()
    console.log(`找到 ${coupons.length} 个优惠券`)
    
    for (const coupon of coupons) {
      const { error } = await supabase
        .from('Coupon')
        .upsert({
          id: coupon.id,
          title: coupon.title,
          description: coupon.description,
          type: coupon.type,
          value: coupon.value?.toString(),
          minAmount: coupon.minAmount?.toString(),
          maxDiscount: coupon.maxDiscount?.toString(),
          startTime: coupon.startTime?.toISOString(),
          endTime: coupon.endTime?.toISOString(),
          totalCount: coupon.totalCount,
          usedCount: coupon.usedCount,
          status: coupon.status,
          createdAt: coupon.createdAt.toISOString(),
          updatedAt: coupon.updatedAt.toISOString()
        })
      
      if (error) {
        console.log(`❌ 优惠券 ${coupon.title} 迁移失败:`, error.message)
      } else {
        console.log(`✅ 优惠券 ${coupon.title} 迁移成功`)
      }
    }
    
    // 5. 验证迁移结果
    console.log('\n🔍 验证迁移结果...')
    const { data: supabaseProducts, error: verifyError } = await supabase
      .from('Product')
      .select('*')
    
    if (verifyError) {
      console.log('❌ 验证失败:', verifyError.message)
    } else {
      console.log(`✅ Supabase中现有 ${supabaseProducts.length} 个产品`)
    }
    
    console.log('\n🎉 数据迁移完成！')
    console.log('现在可以使用Supabase REST API访问数据了')
    
  } catch (error) {
    console.log('❌ 迁移过程中发生错误:', error.message)
  } finally {
    await prisma.$disconnect()
    process.env.DATABASE_URL = tempEnv
  }
}

// 运行迁移
migrateToSupabaseAPI().then(() => {
  console.log('\n🏁 迁移脚本完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 迁移脚本失败:', error.message)
  process.exit(1)
})
