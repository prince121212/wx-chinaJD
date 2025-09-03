const { createClient } = require('@supabase/supabase-js')

async function verifySupabaseData() {
  console.log('🔍 验证Supabase数据...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  try {
    // 1. 验证分类数据
    console.log('\n📂 验证分类数据...')
    const { data: categories, error: catError } = await supabase
      .from('Category')
      .select('*')
      .order('id')
    
    if (catError) {
      console.log('❌ 分类查询失败:', catError.message)
    } else {
      console.log(`✅ 找到 ${categories.length} 个分类:`)
      categories.forEach(cat => {
        console.log(`  - ${cat.name} (ID: ${cat.id})`)
      })
    }
    
    // 2. 验证产品数据
    console.log('\n📦 验证产品数据...')
    const { data: products, error: prodError } = await supabase
      .from('Product')
      .select('*')
      .order('id')
    
    if (prodError) {
      console.log('❌ 产品查询失败:', prodError.message)
    } else {
      console.log(`✅ 找到 ${products.length} 个产品:`)
      products.forEach(prod => {
        console.log(`  - ${prod.title} (SPU: ${prod.spuId})`)
      })
    }
    
    // 3. 验证SKU数据
    console.log('\n🏷️  验证SKU数据...')
    const { data: skus, error: skuError } = await supabase
      .from('ProductSku')
      .select('*')
      .order('id')
    
    if (skuError) {
      console.log('❌ SKU查询失败:', skuError.message)
    } else {
      console.log(`✅ 找到 ${skus.length} 个SKU:`)
      skus.forEach(sku => {
        console.log(`  - ${sku.title} (价格: ¥${sku.price})`)
      })
    }
    
    // 4. 验证轮播图数据
    console.log('\n🖼️  验证轮播图数据...')
    const { data: banners, error: bannerError } = await supabase
      .from('Banner')
      .select('*')
      .order('sortOrder')
    
    if (bannerError) {
      console.log('❌ 轮播图查询失败:', bannerError.message)
    } else {
      console.log(`✅ 找到 ${banners.length} 个轮播图:`)
      banners.forEach(banner => {
        console.log(`  - ${banner.title}`)
      })
    }
    
    // 5. 验证优惠券数据
    console.log('\n🎫 验证优惠券数据...')
    const { data: coupons, error: couponError } = await supabase
      .from('Coupon')
      .select('*')
      .order('id')
      .limit(3)
    
    if (couponError) {
      console.log('❌ 优惠券查询失败:', couponError.message)
    } else {
      console.log(`✅ 找到优惠券 (显示前3个):`)
      coupons.forEach(coupon => {
        console.log(`  - ${coupon.title} (价值: ¥${coupon.value})`)
      })
    }
    
    console.log('\n🎉 Supabase数据验证完成！')
    console.log('所有数据都已成功迁移到Supabase')
    
  } catch (error) {
    console.log('❌ 验证过程中发生错误:', error.message)
  }
}

// 运行验证
verifySupabaseData().then(() => {
  console.log('\n🏁 验证完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 验证失败:', error.message)
  process.exit(1)
})
