import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 更新购物车项
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
    const cartId = params.id
    const { quantity, selected } = await request.json()

    const cartItem = await prisma.cart.findFirst({
      where: { id: cartId, userId },
      include: { sku: true }
    })

    if (!cartItem) {
      return NextResponse.json(
        { success: false, msg: '购物车项不存在' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    if (quantity !== undefined) {
      if (quantity <= 0) {
        return NextResponse.json(
          { success: false, msg: '数量必须大于0' },
          { status: 400 }
        )
      }

      if (quantity > cartItem.sku.stockQuantity) {
        return NextResponse.json(
          { success: false, msg: '库存不足' },
          { status: 400 }
        )
      }

      updateData.quantity = quantity
    }

    if (selected !== undefined) {
      updateData.selected = selected
    }

    await prisma.cart.update({
      where: { id: cartId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      msg: '更新成功'
    })
  } catch (error) {
    console.error('Update cart item error:', error)
    return NextResponse.json(
      { success: false, msg: '更新失败' },
      { status: 500 }
    )
  }
}

// 删除购物车项
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
    const cartId = params.id

    const cartItem = await prisma.cart.findFirst({
      where: { id: cartId, userId }
    })

    if (!cartItem) {
      return NextResponse.json(
        { success: false, msg: '购物车项不存在' },
        { status: 404 }
      )
    }

    await prisma.cart.delete({
      where: { id: cartId }
    })

    return NextResponse.json({
      success: true,
      msg: '删除成功'
    })
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { success: false, msg: '删除失败' },
      { status: 500 }
    )
  }
}