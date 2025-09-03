const { createClient } = require('@supabase/supabase-js')

async function addTeaProductToSupabase() {
  console.log('🍵 添加茶具产品到Supabase...')
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  try {
    // 茶具产品数据
    const teaProduct = {
      saasId: '88888888',
      storeId: '1000',
      spuId: '135681660',
      title: '手绘玲珑珠联碧合盖碗茶具景德镇陶瓷功夫茶具套装家用办公室泡茶器',
      description: '景德镇手工陶瓷茶具，精美手绘工艺，珠联碧合寓意美好，适合家用和办公室使用',
      categoryId: 1, // 使用现有分类
      primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-1.png',
      images: JSON.stringify([
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-1.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-2.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-3.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-4.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-5.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-6.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-7.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-8.png',
        'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-9.png'
      ]),
      minPrice: 1280,
      maxPrice: 1680,
      minSalePrice: 1280,
      maxSalePrice: 1680,
      totalStock: 100,
      soldCount: 0,
      viewCount: 0,
      sortOrder: 0,
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // 添加产品
    console.log('\n📦 添加茶具产品...')
    const { data: productData, error: productError } = await supabase
      .from('Product')
      .insert(teaProduct)
      .select()
    
    if (productError) {
      console.log('❌ 茶具产品添加失败:', productError.message)
      return
    }
    
    console.log('✅ 茶具产品添加成功')
    const newProductId = productData[0].id
    
    // 添加SKU
    console.log('\n🏷️  添加茶具SKU...')
    const teaSkus = [
      {
        productId: newProductId,
        skuId: '135681661',
        title: '手绘玲珑珠联碧合盖碗茶具 - 基础款',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-1.png',
        price: '1280.00',
        salePrice: '1580.00',
        stock: 50,
        soldCount: 0,
        specs: JSON.stringify([
          { specId: '10000', specTitle: '款式', specValueId: '10001', specValue: '基础款' },
          { specId: '10002', specTitle: '容量', specValueId: '10003', specValue: '150ml' }
        ]),
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        productId: newProductId,
        skuId: '135681662',
        title: '手绘玲珑珠联碧合盖碗茶具 - 精装款',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-2.png',
        price: '1480.00',
        salePrice: '1780.00',
        stock: 30,
        soldCount: 0,
        specs: JSON.stringify([
          { specId: '10000', specTitle: '款式', specValueId: '10002', specValue: '精装款' },
          { specId: '10002', specTitle: '容量', specValueId: '10003', specValue: '150ml' }
        ]),
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        productId: newProductId,
        skuId: '135681663',
        title: '手绘玲珑珠联碧合盖碗茶具 - 礼盒装',
        image: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/tea-3.png',
        price: '1680.00',
        salePrice: '1980.00',
        stock: 20,
        soldCount: 0,
        specs: JSON.stringify([
          { specId: '10000', specTitle: '款式', specValueId: '10004', specValue: '礼盒装' },
          { specId: '10002', specTitle: '容量', specValueId: '10005', specValue: '200ml' }
        ]),
        status: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    
    for (const sku of teaSkus) {
      const { error: skuError } = await supabase
        .from('ProductSku')
        .insert(sku)
      
      if (skuError) {
        console.log(`❌ SKU ${sku.title} 添加失败:`, skuError.message)
      } else {
        console.log(`✅ SKU ${sku.title} 添加成功`)
      }
    }
    
    // 验证结果
    console.log('\n🔍 验证添加结果...')
    const { data: allProducts, error: verifyError } = await supabase
      .from('Product')
      .select('*')
    
    if (verifyError) {
      console.log('❌ 验证失败:', verifyError.message)
    } else {
      console.log(`✅ Supabase中现有 ${allProducts.length} 个产品`)
      
      const teaProductAdded = allProducts.find(p => p.spuId === '135681660')
      if (teaProductAdded) {
        console.log('✅ 茶具产品已成功添加到Supabase')
      }
    }
    
    console.log('\n🎉 茶具产品添加完成！')
    
  } catch (error) {
    console.log('❌ 添加过程中发生错误:', error.message)
  }
}

// 运行添加
addTeaProductToSupabase().then(() => {
  console.log('\n🏁 添加完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 添加失败:', error.message)
  process.exit(1)
})
