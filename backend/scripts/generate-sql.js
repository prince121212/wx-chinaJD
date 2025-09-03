const fs = require('fs')
const path = require('path')

console.log('📝 生成Supabase SQL脚本...')

// 读取Prisma schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma')
const schemaContent = fs.readFileSync(schemaPath, 'utf8')

console.log('✅ 已读取Prisma schema')

// 生成PostgreSQL建表SQL
const sql = `
-- Supabase数据库初始化脚本
-- 基于Prisma schema生成

-- 创建用户表
CREATE TABLE IF NOT EXISTS "User" (
    "id" SERIAL PRIMARY KEY,
    "openid" TEXT UNIQUE,
    "unionid" TEXT,
    "nickname" TEXT,
    "avatar" TEXT,
    "gender" INTEGER DEFAULT 0,
    "country" TEXT,
    "province" TEXT,
    "city" TEXT,
    "language" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建分类表
CREATE TABLE IF NOT EXISTS "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS "Product" (
    "id" SERIAL PRIMARY KEY,
    "saasId" TEXT NOT NULL DEFAULT '88888888',
    "storeId" TEXT NOT NULL DEFAULT '1000',
    "spuId" TEXT NOT NULL UNIQUE,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER,
    "primaryImage" TEXT,
    "images" TEXT,
    "minPrice" DECIMAL(10,2) DEFAULT 0,
    "maxPrice" DECIMAL(10,2) DEFAULT 0,
    "minSalePrice" DECIMAL(10,2) DEFAULT 0,
    "maxSalePrice" DECIMAL(10,2) DEFAULT 0,
    "totalStock" INTEGER DEFAULT 0,
    "soldCount" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "sortOrder" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL
);

-- 创建产品SKU表
CREATE TABLE IF NOT EXISTS "ProductSku" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    "skuId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "salePrice" DECIMAL(10,2),
    "stock" INTEGER DEFAULT 0,
    "soldCount" INTEGER DEFAULT 0,
    "specs" TEXT,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
);

-- 创建轮播图表
CREATE TABLE IF NOT EXISTS "Banner" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "linkType" TEXT DEFAULT 'none',
    "sortOrder" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建优惠券表
CREATE TABLE IF NOT EXISTS "Coupon" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'discount',
    "value" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minAmount" DECIMAL(10,2) DEFAULT 0,
    "maxDiscount" DECIMAL(10,2),
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "totalCount" INTEGER DEFAULT 0,
    "usedCount" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS "Order" (
    "id" SERIAL PRIMARY KEY,
    "orderNo" TEXT NOT NULL UNIQUE,
    "userId" INTEGER,
    "status" INTEGER DEFAULT 1,
    "totalAmount" DECIMAL(10,2) DEFAULT 0,
    "payAmount" DECIMAL(10,2) DEFAULT 0,
    "discountAmount" DECIMAL(10,2) DEFAULT 0,
    "shippingAmount" DECIMAL(10,2) DEFAULT 0,
    "payMethod" TEXT,
    "payTime" TIMESTAMP(3),
    "shippingTime" TIMESTAMP(3),
    "finishTime" TIMESTAMP(3),
    "cancelTime" TIMESTAMP(3),
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

-- 创建订单商品表
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER,
    "skuId" INTEGER,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "totalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "specs" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL,
    FOREIGN KEY ("skuId") REFERENCES "ProductSku"("id") ON DELETE SET NULL
);

-- 创建购物车表
CREATE TABLE IF NOT EXISTS "CartItem" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "skuId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
    FOREIGN KEY ("skuId") REFERENCES "ProductSku"("id") ON DELETE CASCADE
);

-- 创建地址表
CREATE TABLE IF NOT EXISTS "Address" (
    "id" SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "isDefault" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS "Product_categoryId_idx" ON "Product"("categoryId");
CREATE INDEX IF NOT EXISTS "Product_spuId_idx" ON "Product"("spuId");
CREATE INDEX IF NOT EXISTS "ProductSku_productId_idx" ON "ProductSku"("productId");
CREATE INDEX IF NOT EXISTS "Order_userId_idx" ON "Order"("userId");
CREATE INDEX IF NOT EXISTS "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX IF NOT EXISTS "CartItem_userId_idx" ON "CartItem"("userId");
CREATE INDEX IF NOT EXISTS "Address_userId_idx" ON "Address"("userId");

-- 完成
SELECT 'Supabase数据库表结构创建完成!' as message;
`

// 保存SQL文件
const sqlPath = path.join(__dirname, '..', 'supabase-init.sql')
fs.writeFileSync(sqlPath, sql)

console.log('✅ SQL脚本已生成:', sqlPath)
console.log('\n📋 下一步操作:')
console.log('1. 登录Supabase Dashboard: https://supabase.com/dashboard')
console.log('2. 进入项目: zhlxqqtahpamntbdtbmf')
console.log('3. 进入SQL编辑器')
console.log('4. 复制并执行生成的SQL脚本')
console.log('5. 运行种子数据脚本')
