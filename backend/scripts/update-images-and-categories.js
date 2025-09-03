const { createClient } = require('@supabase/supabase-js')

async function updateImagesAndCategories() {
  console.log('🔄 更新数据库中的图片链接和分类名称...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // 新的图片链接
  const newImageUrl = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg'
  
  // 新的分类名称映射
  const categoryNameMap = {
    '女装': '白玉瓷',
    '美妆': '骨瓷', 
    '儿童装': '手绘茶具'
  }
  
  try {
    // 1. 更新分类表 (Category)
    console.log('\n📂 更新分类表...')
    
    // 获取所有分类
    const { data: categories, error: fetchCategoriesError } = await supabase
      .from('Category')
      .select('*')
    
    if (fetchCategoriesError) {
      console.log('❌ 获取分类失败:', fetchCategoriesError.message)
      return
    }
    
    console.log(`找到 ${categories.length} 个分类`)
    
    for (const category of categories) {
      const newName = categoryNameMap[category.name] || category.name
      
      const { error: updateError } = await supabase
        .from('Category')
        .update({
          name: newName,
          image: newImageUrl,
          icon: newImageUrl
        })
        .eq('id', category.id)
      
      if (updateError) {
        console.log(`❌ 更新分类 ${category.name} 失败:`, updateError.message)
      } else {
        console.log(`✅ 分类 ${category.name} → ${newName}`)
      }
    }
    
    // 2. 更新轮播图表 (Banner)
    console.log('\n🖼️  更新轮播图表...')
    
    const { data: banners, error: fetchBannersError } = await supabase
      .from('Banner')
      .select('*')
    
    if (fetchBannersError) {
      console.log('❌ 获取轮播图失败:', fetchBannersError.message)
    } else {
      console.log(`找到 ${banners.length} 个轮播图`)
      
      for (const banner of banners) {
        const { error: updateError } = await supabase
          .from('Banner')
          .update({
            image: newImageUrl
          })
          .eq('id', banner.id)
        
        if (updateError) {
          console.log(`❌ 更新轮播图 ${banner.id} 失败:`, updateError.message)
        } else {
          console.log(`✅ 轮播图 ${banner.id} 更新成功`)
        }
      }
    }
    
    // 3. 更新产品表 (Product)
    console.log('\n📦 更新产品表...')
    
    const { data: products, error: fetchProductsError } = await supabase
      .from('Product')
      .select('*')
    
    if (fetchProductsError) {
      console.log('❌ 获取产品失败:', fetchProductsError.message)
    } else {
      console.log(`找到 ${products.length} 个产品`)
      
      for (const product of products) {
        // 解析现有的images数组
        let imagesArray = []
        try {
          imagesArray = product.images ? JSON.parse(product.images) : []
        } catch (error) {
          console.log(`⚠️  产品 ${product.title} 的images字段解析失败`)
          imagesArray = []
        }
        
        // 创建新的images数组，保持原有数量但替换所有链接
        const newImagesArray = imagesArray.map(() => newImageUrl)
        
        // 如果原来没有图片，至少添加一张
        if (newImagesArray.length === 0) {
          newImagesArray.push(newImageUrl)
        }
        
        const { error: updateError } = await supabase
          .from('Product')
          .update({
            primaryImage: newImageUrl,
            images: JSON.stringify(newImagesArray)
          })
          .eq('id', product.id)
        
        if (updateError) {
          console.log(`❌ 更新产品 ${product.title} 失败:`, updateError.message)
        } else {
          console.log(`✅ 产品 ${product.title} 更新成功 (${newImagesArray.length}张图片)`)
        }
      }
    }
    
    // 4. 更新产品SKU表 (ProductSku)
    console.log('\n🏷️  更新产品SKU表...')
    
    const { data: skus, error: fetchSkusError } = await supabase
      .from('ProductSku')
      .select('*')
    
    if (fetchSkusError) {
      console.log('❌ 获取SKU失败:', fetchSkusError.message)
    } else {
      console.log(`找到 ${skus.length} 个SKU`)
      
      for (const sku of skus) {
        const { error: updateError } = await supabase
          .from('ProductSku')
          .update({
            image: newImageUrl
          })
          .eq('id', sku.id)
        
        if (updateError) {
          console.log(`❌ 更新SKU ${sku.title} 失败:`, updateError.message)
        } else {
          console.log(`✅ SKU ${sku.title} 更新成功`)
        }
      }
    }
    
    // 5. 验证更新结果
    console.log('\n🔍 验证更新结果...')
    
    // 验证分类
    const { data: updatedCategories } = await supabase
      .from('Category')
      .select('*')
    
    console.log('更新后的分类:')
    updatedCategories?.forEach(cat => {
      console.log(`  - ${cat.name}`)
    })
    
    // 验证产品图片
    const { data: updatedProducts } = await supabase
      .from('Product')
      .select('*')
      .limit(3)
    
    console.log('\n前3个产品的图片验证:')
    updatedProducts?.forEach(product => {
      const images = JSON.parse(product.images || '[]')
      console.log(`  - ${product.title}: ${images.length}张图片`)
    })
    
    console.log('\n🎉 所有图片链接和分类名称更新完成！')
    console.log(`📸 新图片链接: ${newImageUrl}`)
    console.log('🏷️  新分类名称: 白玉瓷、骨瓷、手绘茶具')
    
  } catch (error) {
    console.log('❌ 更新过程中发生错误:', error.message)
  }
}

// 运行更新
updateImagesAndCategories().then(() => {
  console.log('\n🏁 更新完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 更新失败:', error.message)
  process.exit(1)
})
