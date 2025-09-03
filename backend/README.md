# 零售管理后台

基于 Next.js 14 构建的零售小程序管理后台系统。

## 功能特性

- 🛍️ 商品管理 - 商品信息、分类、库存管理
- 📦 订单管理 - 订单状态跟踪、发货处理
- 👥 用户管理 - 用户信息查看、数据统计
- 🎫 优惠券管理 - 优惠券创建和发放
- 🖼️ 轮播图管理 - 首页轮播图配置
- 📊 数据统计 - 销售数据分析
- 📁 文件上传 - 图片上传到 Cloudflare R2

## 技术栈

- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI组件**: Shadcn/ui, Radix UI
- **数据库**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **文件存储**: Cloudflare R2
- **部署**: Vercel

## 本地开发

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量文件：

```bash
cp .env.local.example .env.local
```

配置环境变量：

```env
# 数据库
DATABASE_URL="postgresql://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# 微信小程序
WECHAT_APPID="wx..."
WECHAT_SECRET="..."

# Cloudflare R2
STORAGE_ENDPOINT="https://..."
STORAGE_ACCESS_KEY="..."
STORAGE_SECRET_KEY="..."
STORAGE_BUCKET="..."
STORAGE_PUBLIC_URL="https://..."
```

### 3. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库结构
npm run db:push

# 初始化种子数据
npm run db:seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## API 文档

### 小程序端 API

#### 用户认证
- `POST /api/miniprogram/auth/login` - 微信登录
- `GET /api/miniprogram/user/info` - 获取用户信息
- `PUT /api/miniprogram/user/info` - 更新用户信息

#### 商品相关
- `GET /api/miniprogram/products` - 商品列表
- `GET /api/miniprogram/products/[id]` - 商品详情
- `GET /api/miniprogram/categories` - 商品分类

#### 购物车
- `GET /api/miniprogram/cart` - 获取购物车
- `POST /api/miniprogram/cart` - 添加到购物车
- `PUT /api/miniprogram/cart/[id]` - 更新购物车项
- `DELETE /api/miniprogram/cart/[id]` - 删除购物车项

#### 订单管理
- `GET /api/miniprogram/orders` - 订单列表
- `POST /api/miniprogram/orders` - 创建订单
- `GET /api/miniprogram/orders/[id]` - 订单详情
- `PUT /api/miniprogram/orders/[id]` - 更新订单状态

#### 地址管理
- `GET /api/miniprogram/addresses` - 地址列表
- `POST /api/miniprogram/addresses` - 新增地址
- `PUT /api/miniprogram/addresses/[id]` - 更新地址
- `DELETE /api/miniprogram/addresses/[id]` - 删除地址

#### 其他
- `GET /api/miniprogram/banners` - 轮播图列表
- `GET /api/miniprogram/coupons` - 优惠券列表
- `POST /api/miniprogram/coupons` - 领取优惠券

### 管理后台 API

#### 商品管理
- `GET /api/admin/products` - 商品列表
- `POST /api/admin/products` - 创建商品
- `GET /api/admin/products/[id]` - 商品详情
- `PUT /api/admin/products/[id]` - 更新商品
- `DELETE /api/admin/products/[id]` - 删除商品

#### 订单管理
- `GET /api/admin/orders` - 订单列表
- `POST /api/admin/orders` - 订单统计
- `PUT /api/admin/orders/[id]/status` - 更新订单状态

#### 用户管理
- `GET /api/admin/users` - 用户列表
- `GET /api/admin/users/[id]` - 用户详情

#### 文件上传
- `POST /api/upload` - 文件上传

## 部署

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### 环境变量配置

在 Vercel 中配置所有必要的环境变量，确保数据库连接和第三方服务正常工作。

## 数据库结构

主要数据表：

- `users` - 用户表
- `categories` - 商品分类
- `products` - 商品表
- `product_skus` - 商品SKU
- `carts` - 购物车
- `orders` - 订单表
- `order_items` - 订单明细
- `addresses` - 收货地址
- `coupons` - 优惠券
- `user_coupons` - 用户优惠券
- `banners` - 轮播图
- `activities` - 营销活动

## 开发说明

1. 所有 API 响应格式统一为：
   ```json
   {
     "success": true,
     "data": {},
     "msg": "操作成功"
   }
   ```

2. 小程序端 API 需要通过 Authorization 头传递用户 token

3. 管理后台无需认证，可直接访问

4. 文件上传支持图片格式，最大 5MB

## 许可证

MIT License