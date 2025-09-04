import { NextRequest, NextResponse } from 'next/server'

// 获取购物车 - 暂时返回模拟数据
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    // 暂时返回空购物车
    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { success: false, msg: '获取购物车失败' },
      { status: 500 }
    )
  }
}

// 添加到购物车 - 暂时返回模拟响应
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const { skuId, quantity = 1 } = await request.json()

    if (!skuId) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 暂时返回模拟成功响应
    return NextResponse.json({
      success: true,
      msg: '添加成功'
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    return NextResponse.json(
      { success: false, msg: '添加失败' },
      { status: 500 }
    )
  }
}