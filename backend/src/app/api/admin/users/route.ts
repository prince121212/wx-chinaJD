import { NextRequest, NextResponse } from 'next/server'

// 获取用户列表（管理后台）- 暂时返回模拟数据
export async function GET(request: NextRequest) {
  try {
    // 暂时返回模拟数据，避免构建时Prisma初始化问题
    return NextResponse.json({
      success: true,
      data: {
        list: [],
        total: 0,
        page: 1,
        limit: 10,
      }
    })
  } catch (error) {
    console.error('Admin get users error:', error)
    return NextResponse.json(
      { success: false, msg: '获取用户列表失败' },
      { status: 500 }
    )
  }
}