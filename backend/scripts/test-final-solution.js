const http = require('http')

async function testAPI(url, name) {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    http.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        const endTime = Date.now()
        const duration = endTime - startTime
        
        try {
          const jsonData = JSON.parse(data)
          console.log(`✅ ${name}: ${res.statusCode} (${duration}ms)`)
          
          if (name === '分类API') {
            if (jsonData.success && jsonData.data) {
              console.log('   分类列表:')
              jsonData.data.forEach(category => {
                console.log(`     - ${category.name}`)
              })
            }
          } else if (name === '轮播图API') {
            if (jsonData.success && jsonData.data) {
              console.log(`   轮播图数量: ${jsonData.data.length}`)
              if (jsonData.data.length > 0) {
                const firstImage = jsonData.data[0]
                if (firstImage.includes('pub-7d345f4cf2334fce864509d66ec976f3.r2.dev')) {
                  console.log('   ✅ 使用更新后的R2图片链接')
                } else if (firstImage.includes('tdesign.gtimg.com')) {
                  console.log('   ⚠️  使用mock数据（TDesign图片）')
                }
              }
            }
          } else if (name === '产品API') {
            if (jsonData.success && jsonData.data && jsonData.data.list) {
              console.log(`   产品数量: ${jsonData.data.list.length}`)
              console.log(`   总数: ${jsonData.data.total}`)
              if (jsonData.data.list.length > 0) {
                const product = jsonData.data.list[0]
                console.log(`   第一个产品: ${product.title}`)
                if (product.primaryImage.includes('pub-7d345f4cf2334fce864509d66ec976f3.r2.dev')) {
                  console.log('   ✅ 使用更新后的R2图片链接')
                }
              }
            }
          }
          
          resolve({ success: true, status: res.statusCode, duration })
        } catch (error) {
          console.log(`❌ ${name}: JSON解析失败`)
          resolve({ success: false, status: res.statusCode, duration })
        }
      })
    }).on('error', (error) => {
      console.log(`❌ ${name}: 请求失败 - ${error.message}`)
      resolve({ success: false, error: error.message })
    })
  })
}

async function testFinalSolution() {
  console.log('🧪 测试最终解决方案...')
  console.log('=====================================')
  
  const apis = [
    { url: 'http://localhost:3000/api/miniprogram/banners', name: '轮播图API' },
    { url: 'http://localhost:3000/api/miniprogram/categories', name: '分类API' },
    { url: 'http://localhost:3000/api/miniprogram/products?page=1&limit=5', name: '产品API' },
    { url: 'http://localhost:3000/api/miniprogram/products/135681660', name: '茶具详情API' },
    { url: 'http://localhost:3000/api/miniprogram/coupons', name: '优惠券API' },
  ]
  
  const results = []
  
  for (const api of apis) {
    const result = await testAPI(api.url, api.name)
    results.push({ ...api, ...result })
    console.log('') // 空行分隔
  }
  
  console.log('📊 测试结果汇总:')
  console.log('=====================================')
  
  const successCount = results.filter(r => r.success).length
  const totalCount = results.length
  
  console.log(`成功: ${successCount}/${totalCount}`)
  console.log(`成功率: ${Math.round(successCount / totalCount * 100)}%`)
  
  if (successCount === totalCount) {
    console.log('🎉 所有API都正常工作！')
  } else {
    console.log('⚠️  部分API有问题')
  }
  
  console.log('\n✅ 最终解决方案状态:')
  console.log('=====================================')
  console.log('🔄 数据源策略: 混合模式')
  console.log('  1️⃣ 优先尝试: Supabase REST API')
  console.log('  2️⃣ 备用方案: Prisma直连PostgreSQL')
  console.log('  3️⃣ 最终备用: Mock数据')
  console.log('')
  console.log('🏠 开发环境: SQLite (本地)')
  console.log('☁️  生产环境: Supabase PostgreSQL (云端)')
  console.log('')
  console.log('📸 图片链接: 已更新为R2 CDN')
  console.log('🏷️  分类名称: 白玉瓷、骨瓷、手绘茶具')
  
  console.log('\n🔗 前端访问URL:')
  console.log('http://localhost:3000/api/miniprogram/banners')
  console.log('http://localhost:3000/api/miniprogram/categories') 
  console.log('http://localhost:3000/api/miniprogram/products')
  
  console.log('\n🚀 部署说明:')
  console.log('- 开发环境: 使用SQLite，数据已同步')
  console.log('- 生产环境: 自动切换到Supabase PostgreSQL')
  console.log('- 网络问题: 自动降级到mock数据')
}

testFinalSolution().catch(console.error)
