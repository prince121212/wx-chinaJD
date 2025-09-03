import { Sidebar } from "@/components/layouts/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UsersPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
            <p className="text-muted-foreground">
              查看和管理小程序用户信息
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户数</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +12% 较上月
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">567</div>
                <p className="text-xs text-muted-foreground">
                  +8% 较上月
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">新增用户</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89</div>
                <p className="text-xs text-muted-foreground">
                  本月新增
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">留存率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">
                  7日留存率
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>
                所有注册用户的详细信息
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">头像</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">昵称</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">openid</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">注册时间</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">订单数</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">消费金额</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          👤
                        </div>
                      </td>
                      <td className="p-4">微信用户001</td>
                      <td className="p-4 text-sm text-gray-500">oGZUI5***</td>
                      <td className="p-4">2024-01-15</td>
                      <td className="p-4">5</td>
                      <td className="p-4">¥1,258.00</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">活跃</span>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          👤
                        </div>
                      </td>
                      <td className="p-4">微信用户002</td>
                      <td className="p-4 text-sm text-gray-500">oGZUI6***</td>
                      <td className="p-4">2024-01-14</td>
                      <td className="p-4">2</td>
                      <td className="p-4">¥456.00</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">普通</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          👤
                        </div>
                      </td>
                      <td className="p-4">微信用户003</td>
                      <td className="p-4 text-sm text-gray-500">oGZUI7***</td>
                      <td className="p-4">2024-01-13</td>
                      <td className="p-4">0</td>
                      <td className="p-4">¥0.00</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">新用户</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}