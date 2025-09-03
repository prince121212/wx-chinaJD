console.log('🔧 Supabase连接字符串助手')
console.log('=====================================')

const projectRef = 'zhlxqqtahpamntbdtbmf'
const password = 'AAaa4598@@123'
const encodedPassword = encodeURIComponent(password)

console.log('\n📋 项目信息:')
console.log('项目引用:', projectRef)
console.log('密码:', password)
console.log('URL编码密码:', encodedPassword)

console.log('\n🔗 可能的连接字符串格式:')

console.log('\n1. 标准直连格式:')
console.log(`postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres`)

console.log('\n2. 连接池格式 (推荐):')
console.log(`postgresql://postgres:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`)

console.log('\n3. 会话模式连接池:')
console.log(`postgresql://postgres:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`)

console.log('\n4. 带项目引用的连接池:')
console.log(`postgresql://postgres.${projectRef}:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`)

console.log('\n💡 建议的环境变量配置:')
console.log('=====================================')
console.log('# 推荐配置 - 使用连接池')
console.log(`DATABASE_URL="postgresql://postgres:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"`)
console.log(`DIRECT_URL="postgresql://postgres:${encodedPassword}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"`)

console.log('\n# 备用配置 - 直连')
console.log(`# DATABASE_URL="postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres"`)
console.log(`# DIRECT_URL="postgresql://postgres:${encodedPassword}@db.${projectRef}.supabase.co:5432/postgres"`)

console.log('\n📝 下一步操作:')
console.log('1. 复制上面推荐的环境变量配置')
console.log('2. 更新 .env.local 文件')
console.log('3. 运行 npx prisma db push 测试连接')
console.log('4. 如果仍然失败，检查Supabase项目设置')

console.log('\n🔍 故障排除:')
console.log('- 确认Supabase项目处于活跃状态')
console.log('- 检查密码是否正确')
console.log('- 确认项目引用ID正确')
console.log('- 检查网络连接和防火墙设置')
console.log('- 尝试在Supabase Dashboard中重置数据库密码')
