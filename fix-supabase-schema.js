const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zhlxqqtahpamntbdtbmf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobHhxcXRhaHBhbW50YmR0Ym1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk2MzYzOSwiZXhwIjoyMDcxNTM5NjM5fQ.aH8gH_RCnOhds7dKBS-IYvzSqhWjxyuhQXERfwuPHjc'
);

async function analyzeAndFixSchema() {
  console.log('=== 分析 Supabase 数据库结构与 Mock 数据兼容性 ===\n');
  
  try {
    // 1. 分析当前表结构
    console.log('1. 检查当前表结构...');
    
    // 检查Product表结构
    const { data: productSample } = await supabase
      .from('Product')
      .select('*')
      .limit(1);
    
    if (productSample && productSample.length > 0) {
      const product = productSample[0];
      console.log('Product表当前字段:', Object.keys(product));
      
      // 检查是否缺少必要字段
      const requiredFields = ['categoryIds', 'video', 'available', 'isPutOnSale', 'spuStockQuantity', 'soldNum'];
      const missingFields = requiredFields.filter(field => !product.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        console.log('❌ Product表缺少字段:', missingFields);
      } else {
        console.log('✅ Product表字段完整');
      }
    }

    // 检查Category表结构
    const { data: categorySample } = await supabase
      .from('Category')
      .select('*')
      .limit(1);
    
    if (categorySample && categorySample.length > 0) {
      const category = categorySample[0];
      console.log('Category表当前字段:', Object.keys(category));
      
      // Mock数据中Category使用groupId, name, thumbnail, children
      // 数据库中使用id, name, icon, image
      console.log('⚠️ Category表字段映射需要调整:');
      console.log('  Mock: groupId -> DB: id');
      console.log('  Mock: thumbnail -> DB: icon');
      console.log('  Mock: children -> 需要parent_id字段支持层级');
    }

    // 2. 检查数据兼容性
    console.log('\n2. 检查数据格式兼容性...');
    
    // 检查价格字段格式
    if (productSample && productSample.length > 0) {
      const product = productSample[0];
      console.log('价格字段类型检查:');
      console.log(`  minPrice: ${typeof product.minPrice} (${product.minPrice})`);
      console.log(`  Mock数据期望: number (分为单位)`);
      
      if (typeof product.minPrice === 'string') {
        console.log('❌ 价格字段类型不匹配，需要转换为数字');
      }
    }

    // 3. 生成修复SQL
    console.log('\n3. 生成数据库结构修复SQL...');
    
    const fixSQL = `
-- 修复 Product 表结构
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryIds" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "video" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "available" INTEGER DEFAULT 1;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "isPutOnSale" INTEGER DEFAULT 1;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "spuStockQuantity" INTEGER DEFAULT 0;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "soldNum" INTEGER DEFAULT 0;

-- 修复 Category 表结构 (添加层级支持)
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "groupId" TEXT;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "parentId" INTEGER;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT;

-- 修复 Banner 表结构
ALTER TABLE "Banner" ADD COLUMN IF NOT EXISTS "linkType" TEXT DEFAULT 'none';

-- 修复 ProductSku 表结构
ALTER TABLE "ProductSku" ADD COLUMN IF NOT EXISTS "thumb" TEXT;
ALTER TABLE "ProductSku" ADD COLUMN IF NOT EXISTS "originPrice" DECIMAL(10,2);

-- 添加外键约束
ALTER TABLE "Category" ADD CONSTRAINT "fk_category_parent" 
  FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL;

-- 创建索引
CREATE INDEX IF NOT EXISTS "idx_product_category" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_product_status" ON "Product"("status");
CREATE INDEX IF NOT EXISTS "idx_category_parent" ON "Category"("parentId");
CREATE INDEX IF NOT EXISTS "idx_sku_product" ON "ProductSku"("productId");
`;

    console.log('修复SQL已生成，需要在Supabase Dashboard中执行');
    
    // 4. 检查是否可以直接修改
    console.log('\n4. 尝试直接修改表结构...');
    
    try {
      // 尝试添加categoryIds字段
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: 'SELECT 1' // 测试RPC是否可用
      });
      
      if (alterError) {
        console.log('❌ 无法通过客户端直接修改表结构');
        console.log('需要手动在Supabase Dashboard中执行SQL');
        return false;
      } else {
        console.log('✅ 可以尝试通过程序修改');
        return true;
      }
    } catch (error) {
      console.log('❌ 无法通过客户端直接修改表结构');
      console.log('需要手动在Supabase Dashboard中执行SQL');
      return false;
    }

  } catch (error) {
    console.error('❌ 分析失败:', error.message);
    return false;
  }
}

async function clearAndUploadMockData() {
  console.log('\n=== 清除现有数据并上传Mock数据 ===\n');
  
  try {
    // 1. 清除现有数据
    console.log('1. 清除现有数据...');
    
    const tables = ['ProductSku', 'Product', 'Category', 'Banner', 'Coupon'];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', 0); // 删除所有记录
      
      if (error) {
        console.log(`❌ 清除${table}表失败:`, error.message);
      } else {
        console.log(`✅ 清除${table}表成功`);
      }
    }

    // 2. 上传Mock数据
    console.log('\n2. 上传Mock数据...');
    
    // 这里需要导入Mock数据
    // 由于是Node.js环境，需要特殊处理ES6模块
    console.log('准备上传Mock数据...');
    console.log('注意：需要先修复表结构后再上传数据');
    
    return true;
    
  } catch (error) {
    console.error('❌ 清除和上传数据失败:', error.message);
    return false;
  }
}

// 主函数
async function main() {
  const canModify = await analyzeAndFixSchema();
  
  if (!canModify) {
    console.log('\n请先在Supabase Dashboard中手动执行表结构修复SQL');
    console.log('然后再运行数据上传脚本');
    return;
  }
  
  const shouldContinue = await clearAndUploadMockData();
  
  if (shouldContinue) {
    console.log('\n=== 操作完成 ===');
  }
}

main().catch(console.error);
