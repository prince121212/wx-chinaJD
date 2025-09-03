import { Sidebar } from "@/components/layouts/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
            <p className="text-muted-foreground">
              配置系统参数和基本设置
            </p>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>基本设置</CardTitle>
                <CardDescription>系统基本配置信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">系统名称</label>
                    <input 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      defaultValue="零售管理后台"
                      placeholder="请输入系统名称"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">系统描述</label>
                    <textarea 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      rows={3}
                      defaultValue="TDesign零售小程序管理后台"
                      placeholder="请输入系统描述"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>小程序配置</CardTitle>
                <CardDescription>微信小程序相关配置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">小程序 AppID</label>
                    <input 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      defaultValue="wx640831368d15e774"
                      placeholder="请输入小程序AppID"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">API Base URL</label>
                    <input 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      defaultValue="http://localhost:3000/api/miniprogram"
                      placeholder="请输入API地址"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>存储配置</CardTitle>
                <CardDescription>文件存储相关配置</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">存储服务</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="cloudflare-r2">Cloudflare R2</option>
                      <option value="aliyun-oss">阿里云OSS</option>
                      <option value="qiniu">七牛云</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">CDN域名</label>
                    <input 
                      className="w-full mt-1 px-3 py-2 border rounded-md" 
                      defaultValue="https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev"
                      placeholder="请输入CDN域名"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <button className="px-4 py-2 border rounded-md hover:bg-gray-50">
                重置
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                保存设置
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}