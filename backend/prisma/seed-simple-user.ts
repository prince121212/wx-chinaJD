import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建简单用户数据...')

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

    if (!existingAddress) {
      await prisma.address.create({
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
      console.log('地址数据创建完成')
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

    console.log('简单用户数据创建完成')

  } catch (error) {
    console.error('创建用户数据失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
