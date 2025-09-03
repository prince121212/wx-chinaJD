import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 更新地址
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

    const userId = token.replace('user_', '')
    const addressId = params.id
    const { name, phone, province, city, district, detail, isDefault } = await request.json()

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    })

    if (!address) {
      return NextResponse.json(
        { success: false, msg: '地址不存在' },
        { status: 404 }
      )
    }

    // 如果设置为默认地址，需要先取消其他默认地址
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: addressId } },
        data: { isDefault: false }
      })
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        name: name || address.name,
        phone: phone || address.phone,
        province: province || address.province,
        city: city || address.city,
        district: district || address.district,
        detail: detail || address.detail,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedAddress
    })
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { success: false, msg: '更新地址失败' },
      { status: 500 }
    )
  }
}

// 删除地址
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

    const userId = token.replace('user_', '')
    const addressId = params.id

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId }
    })

    if (!address) {
      return NextResponse.json(
        { success: false, msg: '地址不存在' },
        { status: 404 }
      )
    }

    await prisma.address.delete({
      where: { id: addressId }
    })

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