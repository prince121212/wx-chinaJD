import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const m = pathname.match(/^\/api\/miniprogram\/products\/([^/]+)$/)
  if (m) {
    const id = m[1]
    const url = request.nextUrl.clone()
    url.pathname = '/api/miniprogram/products'
    url.searchParams.set('id', id)
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = { matcher: ['/api/miniprogram/products/:path*'] }

