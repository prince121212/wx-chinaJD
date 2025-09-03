#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 开始Vercel构建流程...');

try {
  // 1. 生成Prisma客户端
  console.log('📦 生成Prisma客户端...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma客户端生成成功');

  // 2. 运行Next.js构建
  console.log('🏗️ 开始Next.js构建...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('✅ Next.js构建完成');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

console.log('🎉 构建完成！');
