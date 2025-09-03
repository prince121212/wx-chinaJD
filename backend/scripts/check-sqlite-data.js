const sqlite3 = require('sqlite3').verbose()
const path = require('path')

async function checkSQLiteData() {
  console.log('🔍 检查SQLite数据库状态...')
  
  const dbPath1 = path.join(__dirname, '..', 'dev.db')
  const dbPath2 = path.join(__dirname, '..', 'prisma', 'dev.db')

  console.log('检查数据库路径1:', dbPath1)
  console.log('检查数据库路径2:', dbPath2)

  // 检查两个路径
  const fs = require('fs')
  console.log('路径1存在:', fs.existsSync(dbPath1))
  console.log('路径2存在:', fs.existsSync(dbPath2))

  // 使用存在的数据库文件
  const dbPath = fs.existsSync(dbPath2) ? dbPath2 : dbPath1
  
  console.log('使用数据库路径:', dbPath)

  if (!fs.existsSync(dbPath)) {
    console.log('❌ SQLite数据库文件不存在')
    return
  }
  
  const db = new sqlite3.Database(dbPath)
  
  try {
    // 1. 检查所有表
    console.log('\n📋 检查数据库表...')
    const tables = await querySQL(db, `
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `)
    
    console.log(`找到 ${tables.length} 个表:`)
    tables.forEach(table => {
      console.log(`  - ${table.name}`)
    })
    
    if (tables.length === 0) {
      console.log('❌ 数据库中没有表，需要先运行种子数据')
      return
    }
    
    // 2. 检查每个表的数据量
    console.log('\n📊 检查表数据量...')
    for (const table of tables) {
      try {
        const count = await querySQL(db, `SELECT COUNT(*) as count FROM "${table.name}"`)
        console.log(`  ${table.name}: ${count[0].count} 条记录`)
        
        // 显示前几条数据
        if (count[0].count > 0) {
          const sample = await querySQL(db, `SELECT * FROM "${table.name}" LIMIT 2`)
          console.log(`    示例数据:`, sample[0])
        }
      } catch (error) {
        console.log(`  ${table.name}: 查询失败 - ${error.message}`)
      }
    }
    
  } catch (error) {
    console.log('❌ 检查过程中发生错误:', error.message)
  } finally {
    db.close()
  }
}

// 辅助函数：执行SQL查询
function querySQL(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

// 运行检查
checkSQLiteData().then(() => {
  console.log('\n🏁 检查完成')
  process.exit(0)
}).catch(error => {
  console.log('❌ 检查失败:', error.message)
  process.exit(1)
})
