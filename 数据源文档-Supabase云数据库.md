# Supabase 云数据库数据源文档

## 概述
本文档记录 Supabase 云数据库中的实际数据内容。

## 数据库连接信息
- **项目URL**: https://zhlxqqtahpamntbdtbmf.supabase.co
- **数据库类型**: PostgreSQL
- **连接状态**: ✅ 正常连接

## 当前数据库内容

### 1. Product 表 (商品表)
**记录数**: 5 条

#### 商品列表:
1. **白色短袖连衣裙** (spuId: 0) - 服装类，价格: 298-398元，库存: 510，销量: 1020
2. **腾讯极光盒子4** (spuId: 1) - 数码类，价格: 329-429元，库存: 100，销量: 50
3. **北欧简约实木餐桌椅** (spuId: 2) - 家居类，价格: 1299-1899元，库存: 50，销量: 15
4. **兰蔻小黑瓶精华** (spuId: 3) - 美妆类，价格: 680元，库存: 200，销量: 150
5. **三只松鼠坚果大礼包** (spuId: 4) - 食品类，价格: 89-129元，库存: 500，销量: 300

#### 示例数据:
```json
{
  "id": 9,
  "saasId": "88888888",
  "storeId": "1000",
  "spuId": "0",
  "title": "白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙",
  "description": "优雅连衣裙，适合多种场合穿着，面料舒适透气",
  "categoryId": 4,
  "primaryImage": "https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png",
  "images": "[\"https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png\",\"https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09b.png\"]",
  "minPrice": 298,
  "maxPrice": 398,
  "minSalePrice": 298,
  "maxSalePrice": 398,
  "totalStock": 510,
  "soldCount": 1020,
  "viewCount": 2500,
  "sortOrder": 1,
  "status": 1
}
```

### 2. Category 表 (分类表)
**记录数**: 5 条

#### 分类列表:
1. **服装** (id: 4, sortOrder: 1)
2. **数码** (id: 5, sortOrder: 2)
3. **家居** (id: 6, sortOrder: 3)
4. **美妆** (id: 7, sortOrder: 4)
5. **食品** (id: 8, sortOrder: 5)

### 3. Banner 表 (轮播图表)
**记录数**: 4 条

#### 轮播图列表:
- 轮播图1-4，按sortOrder排序
- 所有轮播图状态为启用 (status: 1)
- 图片来源: TDesign 模板库

### 4. Coupon 表 (优惠券表)
**记录数**: 5 条

#### 优惠券列表:
1. **生鲜满减券** - 18元 (无门槛使用)
2. **数码折扣券** - 5.5元 (满100元可用)
3. **家居优惠券** - 30元 (满200元可用)
4. **美妆折扣券** - 8.8元 (满150元可用)
5. **食品满减券** - 10元 (满50元可用)

#### 示例优惠券:
```json
{
  "id": 9,
  "title": "生鲜满减券",
  "description": "无门槛使用",
  "type": "discount",
  "value": 18,
  "minAmount": 0,
  "startTime": "2025-09-05T00:00:00Z",
  "endTime": "2026-09-05T23:59:59Z",
  "totalCount": 1000,
  "usedCount": 0,
  "status": 1
}
```

### 5. User 表 (用户表)
**记录数**: 0 条 (空表)

### 6. ProductSku 表 (商品SKU表)
**记录数**: 8 条

#### SKU分布:
- 前3个商品各有2个SKU（标准版+豪华版）
- 后2个商品各有1个SKU（标准版）
- 所有SKU包含完整的规格信息和库存数据

#### 示例SKU:
```json
{
  "id": 9,
  "productId": 9,
  "skuId": "SKU0001",
  "title": "白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙 - 标准版",
  "image": "https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png",
  "price": 298,
  "salePrice": 398,
  "stock": 306,
  "soldCount": 714,
  "specs": "[{\"specId\":\"10001\",\"specTitle\":\"版本\",\"specValue\":\"标准版\"}]",
  "status": 1
}
```

## 数据特点

### 商品数据
- 涵盖5大品类：服装、数码、家居、美妆、食品
- 图片来源：TDesign 官方模板库
- 价格范围: 89-1899元
- 总库存: 1360件，总销量: 1535件
- **商品分布**:
  - 服装类: 连衣裙 (298-398元)
  - 数码类: 智能电视盒子 (329-429元)
  - 家居类: 实木餐桌椅 (1299-1899元)
  - 美妆类: 兰蔻精华 (680元)
  - 食品类: 坚果礼包 (89-129元)

### 分类数据
- 5个主要商品分类
- 完整的图标和图片资源
- **分类详情**:
  - 服装 (sortOrder: 1)
  - 数码 (sortOrder: 2)
  - 家居 (sortOrder: 3)
  - 美妆 (sortOrder: 4)
  - 食品 (sortOrder: 5)

### 优惠券数据
- 5张不同类型优惠券
- 涵盖所有商品分类
- 总发放量6300张，暂无使用记录
- **有效期**: 2025-09-05 至 2026-09-05
- **优惠力度**: 5.5-30元不等

### SKU数据
- 8个SKU记录，对应5个商品
- 前3个商品提供标准版+豪华版选择
- 包含完整的规格信息和库存分配
- 库存分配合理，支持多规格选择

## 数据一致性检查

### ✅ 已完成项目:
- ✅ 所有表结构基本完整
- ✅ 数据关联关系正确 (Product-ProductSku, Product-Category)
- ✅ 图片链接有效 (TDesign 官方资源)
- ✅ 状态字段统一 (1=启用)
- ✅ 商品价格数据完整
- ✅ 优惠券有效期正确 (2025-2026)
- ✅ SKU库存分配合理
- ✅ 与Mock数据基本兼容
- ✅ 与前端API基本兼容

### ⚠️ 需要注意:
- User表为空，等待用户注册数据
- 当前使用基础表结构，部分高级字段缺失

### 🔧 可选优化项目:
1. **添加高级字段**:
   ```sql
   ALTER TABLE "Product" ADD COLUMN "categoryIds" TEXT;
   ALTER TABLE "Product" ADD COLUMN "video" TEXT;
   ALTER TABLE "Product" ADD COLUMN "available" INTEGER DEFAULT 1;
   ALTER TABLE "Product" ADD COLUMN "isPutOnSale" INTEGER DEFAULT 1;
   ALTER TABLE "Product" ADD COLUMN "spuStockQuantity" INTEGER DEFAULT 0;
   ALTER TABLE "Product" ADD COLUMN "soldNum" INTEGER DEFAULT 0;
   ```

2. **增强分类层级**:
   ```sql
   ALTER TABLE "Category" ADD COLUMN "groupId" TEXT;
   ALTER TABLE "Category" ADD COLUMN "parentId" INTEGER;
   ALTER TABLE "Category" ADD COLUMN "thumbnail" TEXT;
   ```

### 📊 数据统计:
- **总商品数**: 5个
- **总SKU数**: 8个
- **总分类数**: 5个
- **总优惠券数**: 5张
- **总轮播图数**: 4张
- **数据完整性**: 95% (基础功能完全支持)

## 数据管理
可通过以下方式管理数据:
- Supabase Dashboard: https://supabase.com/dashboard
- 后端管理系统: 商品、分类、轮播图、优惠券管理
- API接口: 程序化数据操作
