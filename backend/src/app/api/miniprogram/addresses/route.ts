import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取地址列表
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: addresses
    })
  } catch (error) {
    console.error('Get addresses error:', error)
    return NextResponse.json(
      { success: false, msg: '获取地址列表失败' },
      { status: 500 }
    )
  }
}

// 新增地址
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json(
        { success: false, msg: '请先登录' },
        { status: 401 }
      )
    }

    const userId = token.replace('user_', '')
    const { name, phone, province, city, district, detail, isDefault } = await request.json()

    if (!name || !phone || !province || !city || !district || !detail) {
      return NextResponse.json(
        { success: false, msg: '请填写完整的地址信息' },
        { status: 400 }
      )
    }

    // 如果设置为默认地址，需要先取消其他默认地址
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await prisma.address.create({
      data: {
        userId,
        name,
        phone,
        province,
        city,
        district,
        detail,
        isDefault: isDefault || false
      }
    })

    return NextResponse.json({
      success: true,
      data: address
    })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { success: false, msg: '新增地址失败' },
      { status: 500 }
    )
  }
}