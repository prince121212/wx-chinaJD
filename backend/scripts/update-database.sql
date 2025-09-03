-- 更新数据库中的图片链接和分类名称
-- 在Supabase SQL编辑器中执行此脚本

-- 设置新的图片链接
-- https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg

-- 1. 更新分类表 (Category)
-- 更新分类名称和图片
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
-- 更新所有轮播图的图片链接
UPDATE "Banner" 
SET 
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 3. 更新产品表 (Product)
-- 更新主图片
UPDATE "Product" 
SET 
  "primaryImage" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 更新产品的images数组 - 茶具产品(9张图片)
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" = '135681660' AND "status" = 1;

-- 更新其他产品的images数组 - 餐盘和刀叉(2张图片)
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" IN ('135681622', '135681624') AND "status" = 1;

-- 更新其他所有产品的images数组 - 默认1张图片
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" NOT IN ('135681660', '135681622', '135681624') AND "status" = 1;

-- 4. 更新产品SKU表 (ProductSku)
-- 更新所有SKU的图片链接
UPDATE "ProductSku" 
SET 
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;

-- 验证更新结果
-- 查看更新后的分类
SELECT "id", "name", "image" FROM "Category" WHERE "status" = 1 ORDER BY "id";

-- 查看更新后的产品图片
SELECT "id", "spuId", "title", "primaryImage", 
       LENGTH("images") as images_length,
       (SELECT COUNT(*) FROM json_array_elements_text("images"::json)) as image_count
FROM "Product" 
WHERE "status" = 1 
ORDER BY "id";

-- 查看更新后的轮播图
SELECT "id", "title", "image" FROM "Banner" WHERE "status" = 1 ORDER BY "sortOrder";

-- 查看更新后的SKU
SELECT "id", "title", "image" FROM "ProductSku" WHERE "status" = 1 ORDER BY "id" LIMIT 10;

-- 完成提示
SELECT '✅ 所有图片链接和分类名称更新完成！' as message;
