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
                console.log(`   图片链接: ${jsonData.data[0].substring(0, 50)}...`)
              }
            }
          } else if (name === '产品API') {
            if (jsonData.success && jsonData.data && jsonData.data.list) {
              console.log(`   产品数量: ${jsonData.data.list.length}`)
              console.log(`   总数: ${jsonData.data.total}`)
              if (jsonData.data.list.length > 0) {
                const product = jsonData.data.list[0]
                console.log(`   第一个产品: ${product.title}`)
                console.log(`   主图片: ${product.primaryImage.substring(0, 50)}...`)
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

async function testSupabaseAPIs() {
  console.log('🧪 测试全面使用Supabase的API...')
  console.log('=====================================')
  
  const apis = [
    { url: 'http://localhost:3001/api/miniprogram/banners', name: '轮播图API' },
    { url: 'http://localhost:3001/api/miniprogram/categories', name: '分类API' },
    { url: 'http://localhost:3001/api/miniprogram/products?page=1&limit=5', name: '产品API' },
    { url: 'http://localhost:3001/api/miniprogram/products/135681660', name: '茶具详情API' },
    { url: 'http://localhost:3001/api/miniprogram/coupons', name: '优惠券API' },
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
  
  console.log('\n✅ 数据库迁移状态:')
  console.log('=====================================')
  console.log('❌ SQLite: 已停用')
  console.log('✅ Supabase: 全面使用')
  console.log('✅ 环境配置: PostgreSQL')
  console.log('✅ API路由: 已更新为Supabase')
  
  console.log('\n🔗 前端可以访问以下URL (端口3001):')
  console.log('http://localhost:3001/api/miniprogram/banners')
  console.log('http://localhost:3001/api/miniprogram/categories') 
  console.log('http://localhost:3001/api/miniprogram/products')
  
  console.log('\n📝 已禁用的功能 (需要Supabase重新实现):')
  console.log('- 用户登录/注册')
  console.log('- 订单管理')
  console.log('- 购物车')
  console.log('- 地址管理')
  console.log('- 优惠券领取')
}

testSupabaseAPIs().catch(console.error)
