const { createClient } = require('@supabase/supabase-js')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function migrateSQLiteToSupabase() {
  console.log('🚀 从SQLite迁移数据到Supabase...')
  
  // 初始化Supabase客户端
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // 连接SQLite数据库
  const dbPath1 = path.join(__dirname, '..', 'dev.db')
  const dbPath2 = path.join(__dirname, '..', 'prisma', 'dev.db')

  // 检查哪个数据库文件存在且有数据
  const fs = require('fs')
  const dbPath = fs.existsSync(dbPath2) ? dbPath2 : dbPath1

  console.log('使用数据库路径:', dbPath)
  const db = new sqlite3.Database(dbPath)
  
  try {
    // 1. 迁移分类数据
    console.log('\n📂 迁移分类数据...')
    const categories = await querySQL(db, 'SELECT * FROM categories ORDER BY id')
    console.log(`找到 ${categories.length} 个分类`)
    
    for (const category of categories) {
      const { error } = await supabase
        .from('Category')
        .insert({
          name: category.name,
          icon: category.icon || null,
          image: category.image,
          sortOrder: category.sort_order || 0,
          status: category.status || 1,
          createdAt: new Date(category.created_at).toISOString(),
          updatedAt: new Date(category.updated_at).toISOString()
        })
      
      if (error) {
        console.log(`❌ 分类 ${category.name} 迁移失败:`, error.message)
      } else {
        console.log(`✅ 分类 ${category.name} 迁移成功`)
      }
    }
    
    // 2. 迁移产品数据
    console.log('\n📦 迁移产品数据...')
    const products = await querySQL(db, 'SELECT * FROM products ORDER BY id')
    console.log(`找到 ${products.length} 个产品`)
    
    for (const product of products) {
      const { data: productData, error: productError } = await supabase
        .from('Product')
        .insert({
          saasId: '88888888',
          storeId: '1000',
          spuId: product.spu_id,
          title: product.title,
          description: product.description,
          categoryId: 1, // 暂时使用固定分类ID
          primaryImage: product.primary_image,
          images: product.images,
          minPrice: 0,
          maxPrice: 0,
          minSalePrice: 0,
          maxSalePrice: 0,
          totalStock: 0,
          soldCount: 0,
          viewCount: 0,
          sortOrder: product.sort_order || 0,
          status: product.status || 1,
          createdAt: new Date(product.created_at).toISOString(),
          updatedAt: new Date(product.updated_at).toISOString()
        })
        .select()
      
      if (productError) {
        console.log(`❌ 产品 ${product.title} 迁移失败:`, productError.message)
        continue
      } else {
        console.log(`✅ 产品 ${product.title} 迁移成功`)
      }

      const newProductId = productData[0]?.id
      
      // 迁移对应的SKU
      const skus = await querySQL(db, 'SELECT * FROM product_skus WHERE product_id = ?', [product.id])
      for (const sku of skus) {
        const { error: skuError } = await supabase
          .from('ProductSku')
          .insert({
            productId: newProductId,
            skuId: sku.sku_id,
            title: product.title, // SKU使用产品标题
            image: product.primary_image,
            price: (sku.price / 100).toString(), // 转换为元
            salePrice: sku.origin_price ? (sku.origin_price / 100).toString() : null,
            stock: sku.stock_quantity || 0,
            soldCount: 0,
            specs: sku.spec_info,
            status: sku.status || 1,
            createdAt: new Date(sku.created_at).toISOString(),
            updatedAt: new Date(sku.updated_at).toISOString()
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
    const banners = await querySQL(db, 'SELECT * FROM banners ORDER BY sort_order')
    console.log(`找到 ${banners.length} 个轮播图`)
    
    for (const banner of banners) {
      const { error } = await supabase
        .from('Banner')
        .insert({
          title: banner.title,
          image: banner.image,
          link: banner.link,
          linkType: 'none',
          sortOrder: banner.sort_order || 0,
          status: banner.status || 1,
          createdAt: new Date(banner.created_at).toISOString(),
          updatedAt: new Date(banner.updated_at).toISOString()
        })
      
      if (error) {
        console.log(`❌ 轮播图 ${banner.title || 'Untitled'} 迁移失败:`, error.message)
      } else {
        console.log(`✅ 轮播图 ${banner.title || 'Untitled'} 迁移成功`)
      }
    }
    
    // 4. 迁移优惠券数据
    console.log('\n🎫 迁移优惠券数据...')
    const coupons = await querySQL(db, 'SELECT * FROM coupons ORDER BY id')
    console.log(`找到 ${coupons.length} 个优惠券`)
    
    for (const coupon of coupons) {
      const { error } = await supabase
        .from('Coupon')
        .insert({
          title: coupon.title,
          description: coupon.description,
          type: 'discount',
          value: (coupon.discount_value / 100).toString(), // 转换为元
          minAmount: (coupon.min_amount / 100).toString(),
          maxDiscount: null,
          startTime: coupon.start_time ? new Date(coupon.start_time).toISOString() : null,
          endTime: coupon.end_time ? new Date(coupon.end_time).toISOString() : null,
          totalCount: coupon.total_count || 0,
          usedCount: coupon.used_count || 0,
          status: coupon.status || 1,
          createdAt: new Date(coupon.created_at).toISOString(),
          updatedAt: new Date(coupon.updated_at).toISOString()
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
    
    const { data: supabaseCategories } = await supabase
      .from('Category')
      .select('*')
    console.log(`✅ Supabase中现有 ${supabaseCategories?.length || 0} 个分类`)
    
    const { data: supabaseBanners } = await supabase
      .from('Banner')
      .select('*')
    console.log(`✅ Supabase中现有 ${supabaseBanners?.length || 0} 个轮播图`)
    
    console.log('\n🎉 数据迁移完成！')
    console.log('现在可以使用Supabase REST API访问数据了')
    
  } catch (error) {
    console.log('❌ 迁移过程中发生错误:', error.message)
  } finally {
    db.close()
  }
}

// 辅助函数：执行SQL查询
function querySQL(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

// 运行迁移
migrateSQLiteToSupabase().then(() => {
  console.log('\n🏁 迁移脚本完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 迁移脚本失败:', error.message)
  process.exit(1)
})
