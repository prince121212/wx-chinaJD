const { createClient } = require('@supabase/supabase-js')

async function testSupabaseAPI() {
  console.log('🧪 测试Supabase REST API...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Supabase配置不完整')
    return
  }
  
  console.log('🔗 连接到:', supabaseUrl)
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // 1. 测试基本连接
    console.log('\n1️⃣ 测试基本连接...')
    const { data, error } = await supabase
      .from('_prisma_migrations')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ 基本连接失败:', error.message)
      console.log('错误详情:', error)
      
      // 检查是否是项目暂停
      if (error.message.includes('paused') || error.message.includes('inactive')) {
        console.log('💡 项目可能已暂停，需要在Supabase Dashboard中恢复')
      }
    } else {
      console.log('✅ 基本连接成功')
      console.log('数据:', data)
    }
    
    // 2. 测试创建表（如果基本连接成功）
    if (!error) {
      console.log('\n2️⃣ 测试创建测试表...')
      const { error: createError } = await supabase.rpc('create_test_table', {})
      
      if (createError) {
        console.log('⚠️  无法创建测试表:', createError.message)
      } else {
        console.log('✅ 可以执行数据库操作')
      }
    }
    
  } catch (error) {
    console.log('❌ Supabase API测试失败:', error.message)
    
    // 分析错误类型
    if (error.message.includes('fetch')) {
      console.log('💡 可能是网络连接问题')
    } else if (error.message.includes('unauthorized')) {
      console.log('💡 可能是API密钥问题')
    } else if (error.message.includes('not found')) {
      console.log('💡 可能是项目URL错误或项目不存在')
    }
  }
}

// 运行测试
testSupabaseAPI().then(() => {
  console.log('\n🏁 API测试完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 测试过程中发生错误:', error.message)
  process.exit(1)
})
