interface WeChatAuthResponse {
  access_token?: string
  expires_in?: number
  refresh_token?: string
  openid?: string
  scope?: string
  unionid?: string
  errcode?: number
  errmsg?: string
}

interface WeChatUserInfo {
  openid: string
  nickname?: string
  sex?: number
  language?: string
  city?: string
  province?: string
  country?: string
  headimgurl?: string
  privilege?: string[]
  unionid?: string
}

export async function getWeChatAccessToken(code: string): Promise<WeChatAuthResponse> {
  const appid = process.env.WECHAT_APPID!
  const secret = process.env.WECHAT_SECRET!
  
  const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`
  
  const response = await fetch(url)
  return await response.json()
}

export async function getWeChatUserInfo(accessToken: string, openid: string): Promise<WeChatUserInfo> {
  const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${accessToken}&openid=${openid}&lang=zh_CN`
  
  const response = await fetch(url)
  return await response.json()
}

// 小程序登录
export async function miniProgramLogin(code: string): Promise<{ openid: string; session_key: string; unionid?: string; errcode?: number; errmsg?: string }> {
  const appid = process.env.WECHAT_APPID!
  const secret = process.env.WECHAT_SECRET!
  
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
  
  const response = await fetch(url)
  return await response.json()
}