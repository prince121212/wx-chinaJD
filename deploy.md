# Vercel部署指南 - 简化版本

## 1. 准备工作

### 1.1 安装Vercel CLI
```bash
npm install -g vercel
```

### 1.2 登录Vercel
```bash
vercel login
```

## 2. 当前配置说明

由于Supabase连接问题，我们暂时使用SQLite数据库进行部署。
- 开发环境：SQLite (本地文件数据库)
- 生产环境：暂时也使用SQLite (后续可迁移到PostgreSQL)

### 2.1 环境变量已准备
在 `backend/.env.local` 中已经准备好了Vercel部署所需的环境变量注释。

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

**当前使用SQLite的环境变量：**
```
DATABASE_URL=file:./dev.db
NODE_ENV=production
NEXTAUTH_URL=https://your-vercel-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here-please-change-in-production
```

**如果要使用Supabase（需要解决连接问题）：**
```
DATABASE_URL=postgresql://postgres:AAaa4598@@123@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:AAaa4598@@123@db.zhlxqqtahpamntbdtbmf.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://zhlxqqtahpamntbdtbmf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobHhxcXRhaHBhbW50YmR0Ym1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NjM2MzksImV4cCI6MjA3MTUzOTYzOX0.TtLbRbreNB9L93Al-CZymhZ2uDZJHKw1s2lux_PcIcc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobHhxcXRhaHBhbW50YmR0Ym1mIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTk2MzYzOSwiZXhwIjoyMDcxNTM5NjM5fQ.aH8gH_RCnOhds7dKBS-IYvzSqhWjxyuhQXERfwuPHjc
NODE_ENV=production
```

### 3.3 数据库初始化
由于使用SQLite，数据库文件会在首次访问时自动创建。
种子数据会在应用启动时自动运行。

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
