const fs = require('fs')
const path = require('path')

console.log('🔍 部署前检查...')

// 1. 检查必要文件
const requiredFiles = [
  'package.json',
  'next.config.js',
  'prisma/schema.prisma',
  'src/app/api/miniprogram/products/route.ts',
  'src/app/api/miniprogram/banners/route.ts',
  'src/app/api/miniprogram/categories/route.ts',
]

console.log('📋 检查必要文件...')
let missingFiles = []
for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(__dirname, '..', file))) {
    missingFiles.push(file)
  }
}

if (missingFiles.length > 0) {
  console.error('❌ 缺少以下文件:')
  missingFiles.forEach(file => console.error(`   - ${file}`))
  process.exit(1)
} else {
  console.log('✅ 所有必要文件都存在')
}

// 2. 检查package.json
console.log('📦 检查package.json...')
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'))

if (!packageJson.scripts || !packageJson.scripts.build) {
  console.error('❌ package.json中缺少build脚本')
  process.exit(1)
}

if (!packageJson.dependencies || !packageJson.dependencies.next) {
  console.error('❌ package.json中缺少Next.js依赖')
  process.exit(1)
}

console.log('✅ package.json检查通过')

// 3. 检查环境变量模板
console.log('🔧 检查环境变量...')
const envLocal = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envLocal)) {
  const envContent = fs.readFileSync(envLocal, 'utf8')
  if (envContent.includes('DATABASE_URL')) {
    console.log('✅ 环境变量配置存在')
  } else {
    console.warn('⚠️  环境变量配置可能不完整')
  }
} else {
  console.warn('⚠️  .env.local文件不存在')
}

// 4. 检查API路由
console.log('🛣️  检查API路由...')
const apiDir = path.join(__dirname, '..', 'src', 'app', 'api', 'miniprogram')
if (fs.existsSync(apiDir)) {
  const routes = fs.readdirSync(apiDir)
  console.log(`✅ 找到 ${routes.length} 个API路由: ${routes.join(', ')}`)
} else {
  console.error('❌ API路由目录不存在')
  process.exit(1)
}

console.log('\n🎉 部署前检查完成！')
console.log('📝 接下来的步骤：')
console.log('1. 运行 vercel 命令开始部署')
console.log('2. 在Vercel Dashboard中设置环境变量')
console.log('3. 等待部署完成')
console.log('4. 测试API端点')
console.log('5. 更新小程序中的API地址')
