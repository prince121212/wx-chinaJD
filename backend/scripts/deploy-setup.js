const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 开始部署前的设置...')

// 1. 检查环境变量
console.log('📋 检查环境变量...')
const requiredEnvVars = [
  'DATABASE_URL',
  'DIRECT_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
if (missingVars.length > 0) {
  console.error('❌ 缺少以下环境变量:')
  missingVars.forEach(varName => console.error(`   - ${varName}`))
  console.error('请在Vercel Dashboard中设置这些环境变量')
  process.exit(1)
}

console.log('✅ 环境变量检查通过')

// 2. 生成Prisma客户端
console.log('🔧 生成Prisma客户端...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma客户端生成成功')
} catch (error) {
  console.error('❌ Prisma客户端生成失败:', error.message)
  process.exit(1)
}

// 3. 推送数据库架构
console.log('📊 推送数据库架构...')
try {
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ 数据库架构推送成功')
} catch (error) {
  console.error('❌ 数据库架构推送失败:', error.message)
  console.error('请检查数据库连接配置')
  process.exit(1)
}

// 4. 运行种子数据
console.log('🌱 运行种子数据...')
try {
  // 检查是否已有数据
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()
  
  const productCount = await prisma.product.count()
  if (productCount === 0) {
    console.log('数据库为空，运行种子脚本...')
    execSync('npx tsx prisma/seed-full.ts', { stdio: 'inherit' })
    execSync('npx tsx prisma/cleanup-products.ts', { stdio: 'inherit' })
    console.log('✅ 种子数据运行成功')
  } else {
    console.log(`✅ 数据库已有 ${productCount} 个产品，跳过种子数据`)
  }
  
  await prisma.$disconnect()
} catch (error) {
  console.error('❌ 种子数据运行失败:', error.message)
  // 不退出，因为种子数据可能已经存在
}

console.log('🎉 部署前设置完成！')
console.log('现在可以访问你的API了：')
console.log('- GET /api/miniprogram/products')
console.log('- GET /api/miniprogram/banners')
console.log('- GET /api/miniprogram/categories')
