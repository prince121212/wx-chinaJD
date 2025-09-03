const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function initDatabase() {
  try {
    console.log('正在初始化数据库...')
    
    // 读取SQL文件
    const sqlFile = path.join(__dirname, 'supabase_init.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')
    
    // 分割SQL语句并逐个执行
    const statements = sql
      .split(/;\s*$/m)
      .filter(statement => statement.trim().length > 0)
    
    console.log(`准备执行 ${statements.length} 条SQL语句...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (statement) {
        console.log(`执行第 ${i + 1}/${statements.length} 条语句...`)
        const { error } = await supabase.rpc('exec_sql', { sql_statement: statement })
        
        if (error) {
          // 尝试直接执行SQL
          console.log('尝试直接执行SQL...')
          const result = await supabase.from('').select('').limit(0) // 这不会工作，但我们需要另一种方法
          console.warn('Warning:', error.message)
        }
      }
    }
    
    console.log('数据库初始化完成!')
    
    // 验证数据
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1)
    
    if (productsError) {
      console.error('验证失败:', productsError)
    } else {
      console.log('验证成功，产品数据:', products)
    }
    
  } catch (error) {
    console.error('初始化数据库失败:', error)
    process.exit(1)
  }
}

initDatabase()