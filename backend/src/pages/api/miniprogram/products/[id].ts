import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ success: false, msg: 'Method Not Allowed' })
  }

  try {
    const { id } = req.query
    const spuId = Array.isArray(id) ? id[0] : id
    if (!spuId) {
      return res.status(400).json({ success: false, msg: '缺少商品ID参数' })
    }

    // 代理到已工作的新接口（App Router）
    const baseUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`
    const url = `${baseUrl}/api/miniprogram/product-detail?id=${encodeURIComponent(spuId)}`

    const r = await fetch(url, { headers: { 'user-agent': req.headers['user-agent'] || '' } })
    const data = await r.json()

    return res.status(r.status).json(data)
  } catch (err: any) {
    console.error('Pages API 代理错误:', err)
    return res.status(500).json({ success: false, msg: '获取商品详情失败' })
  }
}

