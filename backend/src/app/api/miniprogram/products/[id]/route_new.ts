import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 强制动态渲染
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const spuId = params.id
    console.log('商品详情路由代理 - 重定向到工作的API:', { spuId, userAgent })

    // 构建新的API URL
    const baseUrl = request.url.split('/api/')[0]
    const newApiUrl = `${baseUrl}/api/miniprogram/product-detail?id=${spuId}`
    
    console.log('重定向到:', newApiUrl)
    
    // 调用工作的API
    const response = await fetch(newApiUrl, {
      method: 'GET',
      headers: {
        'user-agent': userAgent,
      }
    })
    
    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('商品详情代理错误:', error)
    return NextResponse.json(
      { success: false, msg: '获取商品详情失败' },
      { status: 500 }
    )
  }
}
