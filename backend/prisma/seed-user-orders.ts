import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建用户和订单数据...')

  try {
    // 创建测试用户
    const user = await prisma.user.upsert({
      where: { openid: 'test_user_123' },
      update: {},
      create: {
        openid: 'test_user_123',
        nickname: '微信用户',
        avatarUrl: 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/avatars/avatar_1bddf6fc-2b4e-435a-824a-a0579600fc8d_0a6203ea-62c3-47ab-a631-ea8a95f8493c.webp',
        phone: '138****8888',
        gender: 1,
      },
    })
    console.log('用户数据创建完成')

    // 创建用户地址
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId: user.id,
        isDefault: true
      }
    })

    let address
    if (!existingAddress) {
      address = await prisma.address.create({
        data: {
          userId: user.id,
          name: '张三',
          phone: '13800138000',
          province: '广东省',
          city: '深圳市',
          district: '南山区',
          detail: '科技园南区深南大道10000号',
          isDefault: true,
        },
      })
    } else {
      address = existingAddress
    }
    console.log('地址数据创建完成')

    // 获取一些商品用于创建订单
    const products = await prisma.product.findMany({
      include: {
        skus: true
      },
      take: 3
    })

    if (products.length > 0) {
      // 创建一些测试订单
      const orders = []

      // 订单1: 待付款
      const order1 = await prisma.order.create({
        data: {
          orderNo: 'ORDER_' + Date.now() + '_1',
          userId: user.id,
          status: 1, // 待付款
          totalAmount: 29800,
          actualAmount: 29800,
          addressInfo: JSON.stringify({
            name: '张三',
            phone: '13800138000',
            address: '广东省深圳市南山区科技园南区深南大道10000号'
          }),
          remark: '请尽快发货',
        },
      })

      await prisma.orderItem.create({
        data: {
          orderId: order1.id,
          skuId: products[0].skus[0]?.id || 'default_sku',
          quantity: 1,
          price: 29800,
          totalPrice: 29800,
          specInfo: JSON.stringify(products[0].skus[0]?.specInfo || []),
        },
      })
      orders.push(order1)

      // 订单2: 待发货
      if (products.length > 1) {
        const order2 = await prisma.order.create({
          data: {
            orderNo: 'ORDER_' + Date.now() + '_2',
            userId: user.id,
            status: 2, // 待发货
            totalAmount: 25900,
            actualAmount: 25900,
            addressInfo: JSON.stringify({
              name: '张三',
              phone: '13800138000',
              address: '广东省深圳市南山区科技园南区深南大道10000号'
            }),
            remark: '',
          },
        })

        await prisma.orderItem.create({
          data: {
            orderId: order2.id,
            productId: products[1].id,
            skuId: products[1].skus[0]?.skuId || 'default_sku',
            quantity: 1,
            price: 25900,
            totalAmount: 25900,
            productSnapshot: JSON.stringify({
              title: products[1].title,
              image: products[1].primaryImage,
              specs: products[1].skus[0]?.specInfo || []
            }),
          },
        })
        orders.push(order2)
      }

      // 订单3: 待收货
      if (products.length > 2) {
        const order3 = await prisma.order.create({
          data: {
            orderNo: 'ORDER_' + Date.now() + '_3',
            userId: user.id,
            status: 3, // 待收货
            totalAmount: 45900,
            payAmount: 45900,
            addressSnapshot: JSON.stringify({
              name: '张三',
              phone: '13800138000',
              address: '广东省深圳市南山区科技园南区深南大道10000号'
            }),
            remark: '',
          },
        })

        await prisma.orderItem.create({
          data: {
            orderId: order3.id,
            productId: products[2].id,
            skuId: products[2].skus[0]?.skuId || 'default_sku',
            quantity: 1,
            price: 45900,
            totalAmount: 45900,
            productSnapshot: JSON.stringify({
              title: products[2].title,
              image: products[2].primaryImage,
              specs: products[2].skus[0]?.specInfo || []
            }),
          },
        })
        orders.push(order3)
      }

      console.log(`订单数据创建完成，共创建 ${orders.length} 个订单`)
    }

    // 创建用户优惠券
    const coupons = await prisma.coupon.findMany({ take: 3 })
    if (coupons.length > 0) {
      for (const coupon of coupons) {
        await prisma.userCoupon.upsert({
          where: {
            userId_couponId: {
              userId: user.id,
              couponId: coupon.id
            }
          },
          update: {},
          create: {
            userId: user.id,
            couponId: coupon.id,
            status: 1, // 未使用
          },
        })
      }
      console.log(`用户优惠券创建完成，共 ${coupons.length} 张`)
    }

  } catch (error) {
    console.error('创建用户和订单数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
