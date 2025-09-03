/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'tdesign.gtimg.com',
      'we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com',
      'pub-7d345f4cf2334fce864509d66ec976f3.r2.dev'
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig