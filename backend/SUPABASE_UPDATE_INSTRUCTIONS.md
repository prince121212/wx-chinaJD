# Supabase数据库更新指南

## 📋 更新内容

### 🖼️ 图片链接更新
将所有表中的图片链接替换为：
```
https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg
```

### 🏷️ 分类名称更新
- 女装 → 白玉瓷
- 美妆 → 骨瓷  
- 儿童装 → 手绘茶具

## 🚀 执行步骤

### 1. 登录Supabase Dashboard
访问：https://supabase.com/dashboard

### 2. 进入项目
选择项目：`zhlxqqtahpamntbdtbmf`

### 3. 打开SQL编辑器
点击左侧菜单的 "SQL Editor"

### 4. 执行以下SQL语句

#### 步骤1: 更新分类表
```sql
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
```

#### 步骤2: 更新轮播图表
```sql
UPDATE "Banner" 
SET 
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;
```

#### 步骤3: 更新产品主图片
```sql
UPDATE "Product" 
SET 
  "primaryImage" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;
```

#### 步骤4: 更新茶具产品的图片数组(9张)
```sql
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" = '135681660' AND "status" = 1;
```

#### 步骤5: 更新餐盘和刀叉产品的图片数组(2张)
```sql
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg","https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" IN ('135681622', '135681624') AND "status" = 1;
```

#### 步骤6: 更新其他产品的图片数组(1张)
```sql
UPDATE "Product" 
SET 
  "images" = '["https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg"]',
  "updatedAt" = NOW()
WHERE "spuId" NOT IN ('135681660', '135681622', '135681624') AND "status" = 1;
```

#### 步骤7: 更新SKU图片
```sql
UPDATE "ProductSku" 
SET 
  "image" = 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
  "updatedAt" = NOW()
WHERE "status" = 1;
```

### 5. 验证更新结果

执行以下查询验证更新是否成功：

```sql
-- 查看分类
SELECT "id", "name", "image" FROM "Category" WHERE "status" = 1 ORDER BY "id";

-- 查看产品
SELECT "id", "spuId", "title", "primaryImage" FROM "Product" WHERE "status" = 1 ORDER BY "id";

-- 查看轮播图
SELECT "id", "title", "image" FROM "Banner" WHERE "status" = 1 ORDER BY "sortOrder";
```

## ✅ 预期结果

更新完成后，你应该看到：

### 分类名称
- 白玉瓷
- 骨瓷
- 手绘茶具

### 图片链接
所有表中的图片都应该是：
`https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg`

## 🔄 测试更新结果

更新完成后，运行以下命令测试：
```bash
cd backend
node scripts/test-updated-data.js
```

或者直接访问API：
- http://localhost:3000/api/miniprogram/categories
- http://localhost:3000/api/miniprogram/banners  
- http://localhost:3000/api/miniprogram/products
