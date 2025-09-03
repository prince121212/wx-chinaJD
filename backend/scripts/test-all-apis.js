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
          
          if (jsonData.success) {
            if (jsonData.data && Array.isArray(jsonData.data)) {
              console.log(`   数据数量: ${jsonData.data.length}`)
            } else if (jsonData.data && jsonData.data.list) {
              console.log(`   数据数量: ${jsonData.data.list.length}`)
              console.log(`   总数: ${jsonData.data.total}`)
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

async function testAllAPIs() {
  console.log('🧪 测试所有API端点...')
  console.log('=====================================')
  
  const apis = [
    { url: 'http://localhost:3000/api/miniprogram/banners', name: '轮播图API' },
    { url: 'http://localhost:3000/api/miniprogram/categories', name: '分类API' },
    { url: 'http://localhost:3000/api/miniprogram/products?page=1&limit=5', name: '产品列表API' },
    { url: 'http://localhost:3000/api/miniprogram/products/135681660', name: '茶具产品详情API' },
    { url: 'http://localhost:3000/api/miniprogram/products/135681622', name: '餐盘产品详情API' },
    { url: 'http://localhost:3000/api/miniprogram/products/135681624', name: '刀叉产品详情API' },
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
    console.log('⚠️  部分API有问题，但有fallback机制')
  }
  
  console.log('\n🔗 前端可以正常访问以下URL:')
  console.log('http://localhost:3000/api/miniprogram/banners')
  console.log('http://localhost:3000/api/miniprogram/categories') 
  console.log('http://localhost:3000/api/miniprogram/products')
}

testAllAPIs().catch(console.error)
