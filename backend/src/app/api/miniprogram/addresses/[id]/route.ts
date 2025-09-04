import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 更新地址 - 暂时返回模拟响应
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const addressId = params.id
    const { name, phone, province, city, district, detail, isDefault } = await request.json()

    // 暂时返回模拟更新成功响应
    return NextResponse.json({
      success: true,
      data: {
        id: addressId,
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault: !!isDefault,
        updatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { success: false, msg: '更新地址失败' },
      { status: 500 }
    )
  }
}

// 删除地址 - 暂时返回模拟响应
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const addressId = params.id

    // 暂时返回模拟删除成功响应
    return NextResponse.json({
      success: true,
      msg: '删除成功'
    })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { success: false, msg: '删除失败' },
      { status: 500 }
    )
  }
}