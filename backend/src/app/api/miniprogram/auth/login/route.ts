import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { miniProgramLogin } from '@/lib/wechat'

export async function POST(request: NextRequest) {
  try {
    const { code, userInfo } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 调用微信接口获取 openid
    const wechatResult = await miniProgramLogin(code)
    
    if (wechatResult.errcode) {
      return NextResponse.json(
        { success: false, msg: wechatResult.errmsg },
        { status: 400 }
      )
    }

    const { openid, unionid } = wechatResult

    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { openid }
    })

    if (!user) {
      // 创建新用户
      user = await prisma.user.create({
        data: {
          openid,
          unionid,
          nickname: userInfo?.nickName,
          avatarUrl: userInfo?.avatarUrl,
          gender: userInfo?.gender || 0,
        }
      })
    } else if (userInfo) {
      // 更新用户信息
      user = await prisma.user.update({
        where: { openid },
        data: {
          nickname: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          gender: userInfo.gender || user.gender,
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        token: `user_${user.id}`, // 简化的token，实际项目应使用JWT
        userInfo: {
          id: user.id,
          nickname: user.nickname,
          avatarUrl: user.avatarUrl,
          phone: user.phone,
          gender: user.gender,
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, msg: '登录失败' },
      { status: 500 }
    )
  }
}