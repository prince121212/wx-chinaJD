const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testProductDetailAPI() {
  try {
    console.log('=== 测试简化版商品详情API ===')
    
    // 测试存在的商品ID
    const productId = '135681624'
    console.log(`\n测试商品ID: ${productId}`)
    
    const response = await fetch(`http://localhost:3000/api/miniprogram/products/${productId}`)
    const data = await response.json()
    
    console.log('状态码:', response.status)
    console.log('响应数据:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('测试过程中发生错误:', error)
  }
}

testProductDetailAPI()
