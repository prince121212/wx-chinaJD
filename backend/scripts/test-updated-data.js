const http = require('http')

async function testAPI(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data)
          console.log(`\n📋 ${name}:`)
          
          if (name === '分类API') {
            if (jsonData.success && jsonData.data) {
              jsonData.data.forEach(category => {
                console.log(`  - ${category.name}: ${category.thumbnail}`)
              })
            }
          } else if (name === '轮播图API') {
            if (jsonData.success && jsonData.data) {
              console.log(`  轮播图数量: ${jsonData.data.length}`)
              if (jsonData.data.length > 0) {
                console.log(`  第一张图片: ${jsonData.data[0]}`)
              }
            }
          } else if (name === '产品API') {
            if (jsonData.success && jsonData.data && jsonData.data.list) {
              console.log(`  产品数量: ${jsonData.data.list.length}`)
              jsonData.data.list.forEach(product => {
                console.log(`  - ${product.title}:`)
                console.log(`    主图片: ${product.primaryImage}`)
                console.log(`    图片数量: ${product.images ? product.images.length : 0}`)
              })
            }
          }
          
          resolve({ success: true })
        } catch (error) {
          console.log(`❌ ${name}: JSON解析失败`)
          resolve({ success: false })
        }
      })
    }).on('error', (error) => {
      console.log(`❌ ${name}: 请求失败 - ${error.message}`)
      resolve({ success: false })
    })
  })
}

async function testUpdatedData() {
  console.log('🔍 测试更新后的数据...')
  console.log('=====================================')
  
  const expectedImageUrl = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg'
  const expectedCategories = ['白玉瓷', '骨瓷', '手绘茶具']
  
  console.log('🎯 期望的更新结果:')
  console.log(`📸 图片链接: ${expectedImageUrl}`)
  console.log(`🏷️  分类名称: ${expectedCategories.join('、')}`)
  
  // 测试各个API
  await testAPI('http://localhost:3000/api/miniprogram/categories', '分类API')
  await testAPI('http://localhost:3000/api/miniprogram/banners', '轮播图API')
  await testAPI('http://localhost:3000/api/miniprogram/products?page=1&limit=5', '产品API')
  
  console.log('\n📝 说明:')
  console.log('如果上面显示的还是旧数据，请在Supabase Dashboard中执行SQL脚本:')
  console.log('文件位置: backend/scripts/update-database.sql')
  console.log('\n步骤:')
  console.log('1. 登录 https://supabase.com/dashboard')
  console.log('2. 进入项目 zhlxqqtahpamntbdtbmf')
  console.log('3. 进入 SQL Editor')
  console.log('4. 复制并执行 update-database.sql 中的SQL语句')
}

testUpdatedData().catch(console.error)
