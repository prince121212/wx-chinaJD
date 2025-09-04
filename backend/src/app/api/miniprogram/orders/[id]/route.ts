import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// 获取订单详情 - 暂时返回模拟数据
export async function GET(
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

    const orderId = params.id

    // 暂时返回模拟订单数据
    const mockOrder = {
      id: orderId,
      orderNo: `ORDER${Date.now()}`,
      status: 2, // 已付款
      totalAmount: 299.00,
      discountAmount: 0.00,
      actualAmount: 299.00,
      addressInfo: {
        name: '张三',
        phone: '138****8888',
        address: '北京市朝阳区xxx街道xxx号'
      },
      remark: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [
        {
          id: 'item_1',
          quantity: 1,
          price: 299.00,
          totalPrice: 299.00,
          specInfo: '白色 M',
          product: {
            title: '白色短袖连衣裙',
            image: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png'
          }
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: mockOrder
    })
  } catch (error) {
    console.error('Get order detail error:', error)
    return NextResponse.json(
      { success: false, msg: '获取订单详情失败' },
      { status: 500 }
    )
  }
}

// 更新订单状态 - 暂时返回模拟响应
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

    const orderId = params.id
    const { action } = await request.json()

    // 验证操作类型
    if (!['pay', 'cancel', 'confirm'].includes(action)) {
      return NextResponse.json(
        { success: false, msg: '无效的操作' },
        { status: 400 }
      )
    }

    // 暂时返回模拟成功响应
    return NextResponse.json({
      success: true,
      msg: '操作成功'
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { success: false, msg: '操作失败' },
      { status: 500 }
    )
  }
}