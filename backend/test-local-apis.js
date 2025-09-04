const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testLocalAPIs() {
  try {
    console.log('=== 测试本地API ===')
    
    // 测试categories
    console.log('\n1. 测试categories API:')
    const categoriesResponse = await fetch('http://localhost:3000/api/miniprogram/categories')
    const categoriesData = await categoriesResponse.json()
    console.log('Categories状态码:', categoriesResponse.status)
    console.log('Categories数据:', JSON.stringify(categoriesData, null, 2))
    
    // 测试banners
    console.log('\n2. 测试banners API:')
    const bannersResponse = await fetch('http://localhost:3000/api/miniprogram/banners')
    const bannersData = await bannersResponse.json()
    console.log('Banners状态码:', bannersResponse.status)
    console.log('Banners数据:', JSON.stringify(bannersData, null, 2))
    
    // 测试products
    console.log('\n3. 测试products API:')
    const productsResponse = await fetch('http://localhost:3000/api/miniprogram/products?page=1&limit=5')
    const productsData = await productsResponse.json()
    console.log('Products状态码:', productsResponse.status)
    console.log('Products数据总数:', productsData.data?.total || 0)
    
  } catch (error) {
    console.error('测试过程中发生错误:', error)
  }
}

testLocalAPIs()
