-- 🔄 完整的数据库更新脚本
-- 复制以下所有SQL语句到Supabase SQL编辑器中一次性执行

-- 1. 更新分类表 (Category) - 名称和图片
UPDATE "Category" 
SET 
  "name" = CASE 
    WHEN "name" = '女装' THEN '白玉瓷'
    WHEN "name" = '美妆' THEN '骨瓷'
    WHEN "name" = '儿童装' THEN '手绘茶具'
    ELSE "name"
  END,
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "icon" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 2. 更新轮播图表 (Banner)
UPDATE "Banner" 
SET 
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 3. 更新产品表 (Product) - 主图片
UPDATE "Product" 
SET 
  "primaryImage" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 4. 更新茶具产品的图片数组 (9张图片)
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" = '135681660' AND "status" = 1;

-- 5. 更新餐盘和刀叉产品的图片数组 (2张图片)
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" IN ('135681622', '135681624') AND "status" = 1;

-- 6. 更新其他产品的图片数组 (1张图片)
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" NOT IN ('135681660', '135681622', '135681624') AND "status" = 1;

-- 7. 更新产品SKU表 (ProductSku)
UPDATE "ProductSku" 
SET 
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 验证更新结果
SELECT '✅ 数据库更新完成！' as message;

-- 查看更新后的分类
SELECT "id", "name", "image" FROM "Category" WHERE "status" = 1 ORDER BY "id";

-- 查看更新后的产品
SELECT "id", "spuId", "title", "primaryImage", 
       (SELECT COUNT(*) FROM json_array_elements_text("images"::json)) as image_count
FROM "Product" 
WHERE "status" = 1 
ORDER BY "id";
