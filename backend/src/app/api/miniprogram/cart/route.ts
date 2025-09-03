import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取购物车
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

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: {
        sku: {
          include: {
            product: {
              select: {
                spuId: true,
                title: true,
                primaryImage: true,
                status: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedCartItems = cartItems
      .filter(item => item.sku.product.status === 1) // 过滤下架商品
      .map(item => ({
        id: item.id,
        quantity: item.quantity,
        selected: item.selected,
        sku: {
          skuId: item.sku.skuId,
          price: Number(item.sku.price),
          originPrice: Number(item.sku.originPrice),
          stockQuantity: item.sku.stockQuantity,
          specInfo: item.sku.specInfo,
          product: {
            spuId: item.sku.product.spuId,
            title: item.sku.product.title,
            primaryImage: item.sku.product.primaryImage,
          }
        }
      }))

    return NextResponse.json({
      success: true,
      data: formattedCartItems
    })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { success: false, msg: '获取购物车失败' },
      { status: 500 }
    )
  }
}

// 添加到购物车
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
    const { skuId, quantity = 1 } = await request.json()

    if (!skuId) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 检查SKU是否存在
    const sku = await prisma.productSku.findUnique({
      where: { skuId },
      include: { product: true }
    })

    if (!sku || sku.status !== 1 || sku.product.status !== 1) {
      return NextResponse.json(
        { success: false, msg: '商品不存在或已下架' },
        { status: 404 }
      )
    }

    // 检查库存
    if (sku.stockQuantity < quantity) {
      return NextResponse.json(
        { success: false, msg: '库存不足' },
        { status: 400 }
      )
    }

    // 检查是否已在购物车中
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_skuId: {
          userId,
          skuId: sku.id
        }
      }
    })

    if (existingCartItem) {
      // 更新数量
      const newQuantity = existingCartItem.quantity + quantity
      if (newQuantity > sku.stockQuantity) {
        return NextResponse.json(
          { success: false, msg: '库存不足' },
          { status: 400 }
        )
      }

      await prisma.cart.update({
        where: { id: existingCartItem.id },
        data: { quantity: newQuantity }
      })
    } else {
      // 新增购物车项
      await prisma.cart.create({
        data: {
          userId,
          skuId: sku.id,
          quantity,
        }
      })
    }

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