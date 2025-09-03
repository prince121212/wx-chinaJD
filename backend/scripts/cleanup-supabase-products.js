const { createClient } = require('@supabase/supabase-js')

async function cleanupSupabaseProducts() {
  console.log('🧹 清理Supabase产品，只保留指定的3个产品...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  try {
    // 要保留的产品SPU ID
    const keepProducts = [
      '135681660', // 手绘玲珑珠联碧合盖碗茶具
      '135681624', // 不锈钢刀叉勺套装家用西餐餐具
      '135681622', // 简约餐盘耐热家用盘子菜盘套装
    ]
    
    // 1. 获取所有产品
    console.log('\n📋 获取所有产品...')
    const { data: allProducts, error: fetchError } = await supabase
      .from('Product')
      .select('*')
    
    if (fetchError) {
      console.log('❌ 获取产品失败:', fetchError.message)
      return
    }
    
    console.log(`找到 ${allProducts.length} 个产品`)
    
    // 2. 找出需要删除的产品
    const productsToDelete = allProducts.filter(p => !keepProducts.includes(p.spuId))
    const productsToKeep = allProducts.filter(p => keepProducts.includes(p.spuId))
    
    console.log(`需要保留 ${productsToKeep.length} 个产品:`)
    productsToKeep.forEach(p => {
      console.log(`  ✅ ${p.title} (${p.spuId})`)
    })
    
    console.log(`需要删除 ${productsToDelete.length} 个产品:`)
    productsToDelete.forEach(p => {
      console.log(`  ❌ ${p.title} (${p.spuId})`)
    })
    
    // 3. 删除不需要的产品的SKU
    console.log('\n🗑️  删除不需要的产品SKU...')
    for (const product of productsToDelete) {
      const { error: skuDeleteError } = await supabase
        .from('ProductSku')
        .delete()
        .eq('productId', product.id)
      
      if (skuDeleteError) {
        console.log(`❌ 删除产品 ${product.title} 的SKU失败:`, skuDeleteError.message)
      } else {
        console.log(`✅ 删除产品 ${product.title} 的SKU成功`)
      }
    }
    
    // 4. 删除不需要的产品
    console.log('\n🗑️  删除不需要的产品...')
    for (const product of productsToDelete) {
      const { error: productDeleteError } = await supabase
        .from('Product')
        .delete()
        .eq('id', product.id)
      
      if (productDeleteError) {
        console.log(`❌ 删除产品 ${product.title} 失败:`, productDeleteError.message)
      } else {
        console.log(`✅ 删除产品 ${product.title} 成功`)
      }
    }
    
    // 5. 更新保留产品的图片
    console.log('\n🖼️  更新保留产品的图片...')
    
    // 更新简约餐盘的图片
    const plateProduct = productsToKeep.find(p => p.spuId === '135681622')
    if (plateProduct) {
      const { error: plateUpdateError } = await supabase
        .from('Product')
        .update({
          primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
          images: JSON.stringify([
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1a.png',
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-1b.png',
          ])
        })
        .eq('id', plateProduct.id)
      
      if (plateUpdateError) {
        console.log('❌ 更新简约餐盘图片失败:', plateUpdateError.message)
      } else {
        console.log('✅ 更新简约餐盘图片成功')
      }
    }
    
    // 更新不锈钢刀叉勺套装的图片
    const cutleryProduct = productsToKeep.find(p => p.spuId === '135681624')
    if (cutleryProduct) {
      const { error: cutleryUpdateError } = await supabase
        .from('Product')
        .update({
          primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
          images: JSON.stringify([
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2a.png',
            'https://tdesign.gtimg.com/miniprogram/template/retail/goods/jj-2b.png',
          ])
        })
        .eq('id', cutleryProduct.id)
      
      if (cutleryUpdateError) {
        console.log('❌ 更新不锈钢刀叉勺套装图片失败:', cutleryUpdateError.message)
      } else {
        console.log('✅ 更新不锈钢刀叉勺套装图片成功')
      }
    }
    
    // 6. 验证最终结果
    console.log('\n🔍 验证清理结果...')
    const { data: finalProducts, error: finalError } = await supabase
      .from('Product')
      .select('*')
      .order('id')
    
    if (finalError) {
      console.log('❌ 验证失败:', finalError.message)
    } else {
      console.log(`✅ 清理完成，现有 ${finalProducts.length} 个产品:`)
      finalProducts.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} (${product.spuId})`)
      })
    }
    
    // 验证SKU数量
    const { data: finalSkus, error: skuError } = await supabase
      .from('ProductSku')
      .select('*')
    
    if (!skuError) {
      console.log(`✅ 现有 ${finalSkus.length} 个SKU`)
    }
    
    console.log('\n🎉 产品清理完成！')
    
  } catch (error) {
    console.log('❌ 清理过程中发生错误:', error.message)
  }
}

// 运行清理
cleanupSupabaseProducts().then(() => {
  console.log('\n🏁 清理完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 清理失败:', error.message)
  process.exit(1)
})
