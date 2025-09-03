import { NextRequest, NextResponse } from 'next/server'

// 获取地址列表 - 暂时禁用，使用Supabase后需要重新实现
export async function GET(request: NextRequest) {
  try {
    console.log('地址列表功能暂时禁用 - 需要Supabase实现')

    // 返回空地址列表
    return NextResponse.json({
      success: true,
      data: []
    })
  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json(
      { success: false, msg: '获取地址列表失败' },
      { status: 500 }
    )
  }
}

// 新增地址 - 暂时返回模拟数据，避免依赖数据库
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const { name, phone, province, city, district, detail, isDefault } = await request.json()

    if (!name || !phone || !province || !city || !district || !detail) {
      return NextResponse.json(
        { success: false, msg: '请填写完整的地址信息' },
        { status: 400 }
      )
    }

    // 返回模拟数据，后续接入数据库
    return NextResponse.json({
      success: true,
      data: {
        id: 'mock_address_id',
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault: !!isDefault,
        createdAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { success: false, msg: '新增地址失败' },
      { status: 500 }
    )
  }
}