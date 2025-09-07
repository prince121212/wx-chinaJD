-- Supabase 数据库完整初始化 SQL
-- 此文件包含所有表结构、索引、约束和初始数据
-- 可重复执行，不会产生错误

-- ============================================================================
-- 1. 删除现有表和序列（如果存在）
-- ============================================================================

DROP TABLE IF EXISTS "ProductSku" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Banner" CASCADE;
DROP TABLE IF EXISTS "Coupon" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

DROP SEQUENCE IF EXISTS "Category_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Product_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "ProductSku_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Banner_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Coupon_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "User_id_seq" CASCADE;

-- ============================================================================
-- 2. 创建表结构
-- ============================================================================

-- 用户表
CREATE TABLE "User" (
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

-- 分类表
CREATE TABLE "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "image" TEXT,
    "groupId" TEXT,
    "parentId" INTEGER,
    "thumbnail" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE "Product" (
    "id" SERIAL PRIMARY KEY,
    "saasId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "spuId" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER,
    "categoryIds" TEXT,
    "primaryImage" TEXT,
    "images" TEXT,
    "video" TEXT,
    "available" INTEGER DEFAULT 1,
    "minPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "maxPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minSalePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "maxSalePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minLinePrice" DECIMAL(10,2),
    "maxLinePrice" DECIMAL(10,2),
    "totalStock" INTEGER DEFAULT 0,
    "spuStockQuantity" INTEGER DEFAULT 0,
    "soldCount" INTEGER DEFAULT 0,
    "soldNum" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "isPutOnSale" INTEGER DEFAULT 1,
    "sortOrder" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 商品SKU表
CREATE TABLE "ProductSku" (
    "id" SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL,
    "skuId" TEXT UNIQUE NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "thumb" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "salePrice" DECIMAL(10,2),
    "originPrice" DECIMAL(10,2),
    "stock" INTEGER DEFAULT 0,
    "soldCount" INTEGER DEFAULT 0,
    "specs" TEXT,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 轮播图表
CREATE TABLE "Banner" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT,
    "linkType" TEXT DEFAULT 'none',
    "sortOrder" INTEGER DEFAULT 0,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 优惠券表
CREATE TABLE "Coupon" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "minAmount" DECIMAL(10,2) DEFAULT 0,
    "maxDiscount" DECIMAL(10,2),
    "totalCount" INTEGER NOT NULL,
    "usedCount" INTEGER DEFAULT 0,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- 3. 创建外键约束
-- ============================================================================

ALTER TABLE "Category" ADD CONSTRAINT "fk_category_parent"
    FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL;

ALTER TABLE "Product" ADD CONSTRAINT "fk_product_category"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL;

ALTER TABLE "ProductSku" ADD CONSTRAINT "fk_sku_product"
    FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE;

-- ============================================================================
-- 4. 创建索引
-- ============================================================================

CREATE INDEX "idx_user_openid" ON "User"("openid");
CREATE INDEX "idx_category_parent" ON "Category"("parentId");
CREATE INDEX "idx_category_status" ON "Category"("status");
CREATE INDEX "idx_product_category" ON "Product"("categoryId");
CREATE INDEX "idx_product_status" ON "Product"("status");
CREATE INDEX "idx_product_available" ON "Product"("available");
CREATE INDEX "idx_product_spuid" ON "Product"("spuId");
CREATE INDEX "idx_sku_product" ON "ProductSku"("productId");
CREATE INDEX "idx_sku_status" ON "ProductSku"("status");
CREATE INDEX "idx_banner_status" ON "Banner"("status");
CREATE INDEX "idx_coupon_status" ON "Coupon"("status");
CREATE INDEX "idx_coupon_time" ON "Coupon"("startTime", "endTime");

-- ============================================================================
-- 5. 插入初始数据
-- ============================================================================

-- 插入分类数据
INSERT INTO "Category" ("name", "icon", "image", "groupId", "thumbnail", "sortOrder", "status") VALUES
('服装', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '24948', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 1, 1),
('数码', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '24949', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 2, 1),
('家居', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '24950', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 3, 1),
('美妆', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '24951', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 4, 1),
('食品', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '24952', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 5, 1);

-- 插入轮播图数据
INSERT INTO "Banner" ("title", "image", "link", "linkType", "sortOrder", "status") VALUES
('轮播图1', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', NULL, 'none', 1, 1),
('轮播图2', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', NULL, 'none', 2, 1),
('轮播图3', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', NULL, 'none', 3, 1),
('轮播图4', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', NULL, 'none', 4, 1);

-- 插入优惠券数据
INSERT INTO "Coupon" ("title", "description", "type", "value", "minAmount", "startTime", "endTime", "totalCount", "usedCount", "status") VALUES
('生鲜满减券', '无门槛使用', 'discount', 18.00, 0, '2025-09-05T00:00:00Z', '2026-09-05T23:59:59Z', 1000, 0, 1),
('数码折扣券', '满100元可用', 'discount', 5.5, 100, '2025-09-05T00:00:00Z', '2026-09-05T23:59:59Z', 1000, 0, 1),
('家居优惠券', '满200元可用', 'discount', 30.00, 200, '2025-09-05T00:00:00Z', '2026-09-05T23:59:59Z', 500, 0, 1),
('美妆折扣券', '满150元可用', 'discount', 8.8, 150, '2025-09-05T00:00:00Z', '2026-09-05T23:59:59Z', 800, 0, 1),
('食品满减券', '满50元可用', 'discount', 10.00, 50, '2025-09-05T00:00:00Z', '2026-09-05T23:59:59Z', 2000, 0, 1);

-- 插入商品数据
INSERT INTO "Product" ("saasId", "storeId", "spuId", "title", "description", "categoryId", "categoryIds", "primaryImage", "images", "available", "minPrice", "maxPrice", "minSalePrice", "maxSalePrice", "minLinePrice", "maxLinePrice", "totalStock", "spuStockQuantity", "soldCount", "soldNum", "viewCount", "isPutOnSale", "sortOrder", "status") VALUES
('88888888', '1000', '0', '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙', '优雅连衣裙，适合多种场合穿着，面料舒适透气', 1, '["1"]', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp"]', 1, 298, 398, 298, 398, 400, 450, 510, 510, 1020, 1020, 2500, 1, 1, 1),
('88888888', '1000', '1', '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率', '高清智能电视盒子，支持4K/6K分辨率，千兆网络', 2, '["2"]', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp"]', 1, 329, 429, 329, 429, 450, 500, 100, 100, 50, 50, 800, 1, 2, 1),
('88888888', '1000', '2', '北欧简约实木餐桌椅组合现代简约小户型家用饭桌', '北欧风格实木餐桌，环保材质，适合小户型家庭', 3, '["3"]', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp"]', 1, 1299, 1899, 1299, 1899, 2000, 2200, 50, 50, 15, 15, 300, 1, 3, 1),
('88888888', '1000', '3', '兰蔻小黑瓶精华肌底液30ml修护精华液', '兰蔻明星产品，修护肌底，提亮肌肤', 4, '["4"]', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp"]', 1, 680, 680, 680, 680, 800, 800, 200, 200, 150, 150, 1200, 1, 4, 1),
('88888888', '1000', '4', '三只松鼠坚果大礼包1314g混合坚果零食', '精选优质坚果，营养丰富，办公室零食首选', 5, '["5"]', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp"]', 1, 89, 129, 89, 129, 150, 180, 500, 500, 300, 300, 1500, 1, 5, 1);

-- 插入SKU数据
INSERT INTO "ProductSku" ("productId", "skuId", "title", "image", "thumb", "price", "salePrice", "originPrice", "stock", "soldCount", "specs", "status") VALUES
(1, 'SKU0001', '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙 - 标准版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 298, 398, 450, 306, 714, '[{"specId":"10001","specTitle":"版本","specValue":"标准版"}]', 1),
(1, 'SKU0002', '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙 - 豪华版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 398, 448, 500, 204, 306, '[{"specId":"10001","specTitle":"版本","specValue":"豪华版"}]', 1),
(2, 'SKU1001', '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率 - 标准版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 329, 429, 500, 60, 35, '[{"specId":"10001","specTitle":"版本","specValue":"标准版"}]', 1),
(2, 'SKU1002', '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率 - 豪华版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 429, 479, 550, 40, 15, '[{"specId":"10001","specTitle":"版本","specValue":"豪华版"}]', 1),
(3, 'SKU2001', '北欧简约实木餐桌椅组合现代简约小户型家用饭桌 - 标准版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 1299, 1899, 2200, 30, 10, '[{"specId":"10001","specTitle":"版本","specValue":"标准版"}]', 1),
(3, 'SKU2002', '北欧简约实木餐桌椅组合现代简约小户型家用饭桌 - 豪华版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 1899, 1949, 2400, 20, 5, '[{"specId":"10001","specTitle":"版本","specValue":"豪华版"}]', 1),
(4, 'SKU3001', '兰蔻小黑瓶精华肌底液30ml修护精华液 - 标准版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 680, 680, 800, 120, 105, '[{"specId":"10001","specTitle":"版本","specValue":"标准版"}]', 1),
(5, 'SKU4001', '三只松鼠坚果大礼包1314g混合坚果零食 - 标准版', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg?imageMogr2/thumbnail/585x585/quality/70/strip/format/webp', 89, 129, 180, 300, 210, '[{"specId":"10001","specTitle":"版本","specValue":"标准版"}]', 1);

-- ============================================================================
-- 6. 验证数据插入结果
-- ============================================================================

-- 显示插入结果统计
SELECT
    'Category' as table_name,
    COUNT(*) as record_count
FROM "Category"
UNION ALL
SELECT
    'Banner' as table_name,
    COUNT(*) as record_count
FROM "Banner"
UNION ALL
SELECT
    'Coupon' as table_name,
    COUNT(*) as record_count
FROM "Coupon"
UNION ALL
SELECT
    'Product' as table_name,
    COUNT(*) as record_count
FROM "Product"
UNION ALL
SELECT
    'ProductSku' as table_name,
    COUNT(*) as record_count
FROM "ProductSku"
ORDER BY table_name;

-- 初始化完成
SELECT '🎉 数据库初始化完成！所有表结构和数据已就绪。' as message;
