const { createClient } = require('@supabase/supabase-js')
const { Client } = require('pg')

async function testSupabaseConnection() {
  console.log('🔍 详细测试Supabase连接...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const databaseUrl = process.env.DATABASE_URL
  const directUrl = process.env.DIRECT_URL
  
  console.log('\n📋 环境变量检查:')
  console.log('SUPABASE_URL:', supabaseUrl)
  console.log('DATABASE_URL:', databaseUrl)
  console.log('DIRECT_URL:', directUrl)
  
  // 1. 测试REST API连接
  console.log('\n🌐 测试REST API连接...')
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // 测试查询已创建的表
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ REST API查询失败:', error.message)
      console.log('错误详情:', error)
    } else {
      console.log('✅ REST API连接成功')
      console.log('Product表数据:', data)
    }
    
    // 测试查询Category表
    const { data: categories, error: catError } = await supabase
      .from('Category')
      .select('*')
      .limit(1)
    
    if (catError) {
      console.log('❌ Category表查询失败:', catError.message)
    } else {
      console.log('✅ Category表查询成功，数据条数:', categories.length)
    }
    
  } catch (error) {
    console.log('❌ REST API测试失败:', error.message)
  }
  
  // 2. 测试PostgreSQL直连（多种方式）
  console.log('\n🗄️  测试PostgreSQL直连...')
  
  // 方式1: 使用DATABASE_URL
  console.log('\n方式1: 使用DATABASE_URL (连接池)')
  await testPgConnection(databaseUrl, '连接池URL')
  
  // 方式2: 使用DIRECT_URL
  console.log('\n方式2: 使用DIRECT_URL (直连)')
  await testPgConnection(directUrl, '直连URL')
  
  // 方式3: 尝试不同的连接字符串格式
  console.log('\n方式3: 尝试其他连接格式')
  const altUrls = [
    'postgresql://postgres:AAaa4598@@123@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres',
    'postgresql://postgres:AAaa4598%40%40123@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres',
    'postgres://postgres:AAaa4598@@123@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres'
  ]
  
  for (let i = 0; i < altUrls.length; i++) {
    console.log(`\n尝试格式 ${i + 1}:`)
    await testPgConnection(altUrls[i], `格式${i + 1}`)
  }
}

async function testPgConnection(connectionString, label) {
  if (!connectionString) {
    console.log(`❌ ${label}: 连接字符串为空`)
    return
  }
  
  try {
    console.log(`🔗 ${label}: 尝试连接...`)
    
    const client = new Client({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000, // 10秒超时
    })
    
    await client.connect()
    console.log(`✅ ${label}: 连接成功`)
    
    // 测试查询
    const result = await client.query('SELECT version()')
    console.log(`✅ ${label}: 查询成功，PostgreSQL版本:`, result.rows[0].version.split(' ')[0])
    
    // 测试查询我们创建的表
    const tableResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('Product', 'Category', 'Banner')
      ORDER BY table_name
    `)
    console.log(`✅ ${label}: 找到表:`, tableResult.rows.map(r => r.table_name))
    
    await client.end()
    
  } catch (error) {
    console.log(`❌ ${label}: 连接失败`)
    console.log(`   错误: ${error.message}`)
    console.log(`   错误代码: ${error.code}`)
    
    // 分析错误原因
    if (error.code === 'ENOTFOUND') {
      console.log(`   💡 可能原因: DNS解析失败，检查域名`)
    } else if (error.code === 'ECONNREFUSED') {
      console.log(`   💡 可能原因: 连接被拒绝，检查端口和防火墙`)
    } else if (error.code === 'ETIMEDOUT') {
      console.log(`   💡 可能原因: 连接超时，检查网络`)
    } else if (error.message.includes('password')) {
      console.log(`   💡 可能原因: 密码认证失败`)
    } else if (error.message.includes('database')) {
      console.log(`   💡 可能原因: 数据库不存在`)
    } else if (error.message.includes('SSL')) {
      console.log(`   💡 可能原因: SSL连接问题`)
    }
  }
}

// 运行测试
testSupabaseConnection().then(() => {
  console.log('\n🏁 连接测试完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 测试过程中发生错误:', error.message)
  process.exit(1)
})
