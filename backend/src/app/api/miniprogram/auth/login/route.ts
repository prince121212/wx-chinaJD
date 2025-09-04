import { NextRequest, NextResponse } from 'next/server'

// 登录API - 暂时禁用，使用Supabase后需要重新实现
export async function POST(request: NextRequest) {
  try {
    const { code, userInfo } = await request.json()

    if (!code) {
      return NextResponse.json(
        { success: false, msg: '缺少必要参数' },
        { status: 400 }
      )
    }

    console.log('登录功能暂时禁用 - 需要Supabase实现')

    // 返回模拟登录成功
    const user = {
      id: 'test_user_123',
      nickname: userInfo?.nickName || '幸运猫',
      avatarUrl: userInfo?.avatarUrl || 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/JD/victoria-druc-qAYoFgD_-5E-unsplash.jpg',
      phone: null,
      gender: userInfo?.gender || 1,
    }

    return NextResponse.json({
      success: true,
      data: {
        token: `user_${user.id}`, // 简化的token
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