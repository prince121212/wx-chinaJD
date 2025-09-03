const { createClient } = require('@supabase/supabase-js')
const { Client } = require('pg')

console.log('🔍 Supabase连接诊断...')

// 1. 检查环境变量
console.log('\n📋 检查环境变量...')
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const databaseUrl = process.env.DATABASE_URL
const directUrl = process.env.DIRECT_URL

console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 已设置' : '❌ 未设置')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ 已设置' : '❌ 未设置')
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ 已设置' : '❌ 未设置')
console.log('DATABASE_URL:', databaseUrl ? '✅ 已设置' : '❌ 未设置')
console.log('DIRECT_URL:', directUrl ? '✅ 已设置' : '❌ 未设置')

// 2. 测试Supabase REST API
console.log('\n🌐 测试Supabase REST API...')
if (supabaseUrl && supabaseAnonKey) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase客户端创建成功')
    
    // 尝试简单查询
    supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.log('⚠️  REST API查询失败:', error.message)
        } else {
          console.log('✅ REST API连接成功')
        }
      })
      .catch(err => {
        console.log('❌ REST API连接失败:', err.message)
      })
  } catch (error) {
    console.log('❌ Supabase客户端创建失败:', error.message)
  }
} else {
  console.log('❌ Supabase配置不完整，跳过REST API测试')
}

// 3. 测试直接PostgreSQL连接
console.log('\n🗄️  测试PostgreSQL直连...')
if (databaseUrl) {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false
    }
  })

  client.connect()
    .then(() => {
      console.log('✅ PostgreSQL直连成功')
      return client.query('SELECT version()')
    })
    .then(result => {
      console.log('✅ 数据库版本:', result.rows[0].version.split(' ')[0])
      return client.end()
    })
    .catch(error => {
      console.log('❌ PostgreSQL直连失败:', error.message)
      console.log('错误代码:', error.code)
      
      // 分析常见错误
      if (error.code === 'ENOTFOUND') {
        console.log('💡 可能原因: DNS解析失败，检查域名是否正确')
      } else if (error.code === 'ECONNREFUSED') {
        console.log('💡 可能原因: 连接被拒绝，检查端口和防火墙')
      } else if (error.code === 'ETIMEDOUT') {
        console.log('💡 可能原因: 连接超时，检查网络连接')
      } else if (error.message.includes('password')) {
        console.log('💡 可能原因: 密码错误')
      } else if (error.message.includes('database')) {
        console.log('💡 可能原因: 数据库名称错误')
      }
    })
} else {
  console.log('❌ DATABASE_URL未设置，跳过PostgreSQL测试')
}

// 4. 解析连接字符串
console.log('\n🔗 解析连接字符串...')
if (databaseUrl) {
  try {
    const url = new URL(databaseUrl)
    console.log('协议:', url.protocol)
    console.log('主机:', url.hostname)
    console.log('端口:', url.port)
    console.log('数据库:', url.pathname.substring(1))
    console.log('用户名:', url.username)
    console.log('密码:', url.password ? '***已设置***' : '❌ 未设置')
  } catch (error) {
    console.log('❌ 连接字符串格式错误:', error.message)
  }
}

// 5. 建议解决方案
console.log('\n💡 可能的解决方案:')
console.log('1. 检查Supabase项目是否处于活跃状态')
console.log('2. 确认数据库密码是否正确')
console.log('3. 检查网络连接和防火墙设置')
console.log('4. 尝试使用Supabase Dashboard中的连接字符串')
console.log('5. 检查Supabase项目是否暂停（免费版可能会暂停）')

setTimeout(() => {
  console.log('\n🏁 诊断完成')
  process.exit(0)
}, 3000)
