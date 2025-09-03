# Vercel部署指南

## 1. 准备工作

### 1.1 安装Vercel CLI
```bash
npm install -g vercel
```

### 1.2 登录Vercel
```bash
vercel login
```

## 2. 数据库配置

### 2.1 获取Supabase数据库密码
1. 登录 https://supabase.com/dashboard
2. 进入你的项目: zhlxqqtahpamntbdtbmf
3. 进入 Settings > Database
4. 复制数据库密码

### 2.2 更新数据库连接字符串
将 `[password]` 替换为实际密码：
```
DATABASE_URL="postgresql://postgres:实际密码@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:实际密码@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres"
```

## 3. 部署步骤

### 3.1 首次部署
```bash
# 在项目根目录执行
vercel

# 选择配置：
# ? Set up and deploy "wx-app"? [Y/n] y
# ? Which scope do you want to deploy to? [选择你的账户]
# ? Link to existing project? [N/y] n
# ? What's your project's name? wx-app-backend
# ? In which directory is your code located? ./backend
```

### 3.2 设置环境变量
在Vercel Dashboard中设置以下环境变量：

**必需的环境变量：**
```
DATABASE_URL=postgresql://postgres:实际密码@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:实际密码@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://zhlxqqtahpamntbdtbmf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobHhxcXRhaHBhbW50YmR0Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjM2MzksImV4cCI6MjA3MTUzOTYzOX0.TtLbRbreNB9L93Al-CZymhZ2uDZJHKw1s2lux_PcIcc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobHhxcXRhaHBhbW50YmR0Ym1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk2MzYzOSwiZXhwIjoyMDcxNTM5NjM5fQ.aH8gH_RCnOhds7dKBS-IYvzSqhWjxyuhQXERfwuPHjc
NODE_ENV=production
```

### 3.3 数据库迁移
部署后，需要在生产数据库中创建表结构：

```bash
# 在本地执行，连接到生产数据库
cd backend
npx dotenv -e .env.production -- npx prisma db push
npx dotenv -e .env.production -- npx prisma db seed
```

## 4. 更新小程序配置

部署成功后，更新小程序中的API地址：

### 4.1 修改 config/index.js
```javascript
export const config = {
  useMock: false,
  apiBaseUrl: 'https://your-vercel-domain.vercel.app/api/miniprogram', // 替换为实际域名
  // ... 其他配置
}
```

## 5. 后续部署

```bash
# 代码更新后重新部署
vercel --prod
```

## 6. 验证部署

部署成功后，测试API：
```bash
curl https://your-vercel-domain.vercel.app/api/miniprogram/products
curl https://your-vercel-domain.vercel.app/api/miniprogram/banners
curl https://your-vercel-domain.vercel.app/api/miniprogram/categories
```

## 7. 常见问题

### 7.1 数据库连接问题
- 确保数据库密码正确
- 检查Supabase项目是否正常运行
- 验证环境变量设置

### 7.2 API路由问题
- 检查vercel.json配置
- 确保API路径正确

### 7.3 CORS问题
- 后端已配置CORS，应该不会有跨域问题
- 如有问题，检查API响应头
