import { Sidebar } from "@/components/layouts/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CouponsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">优惠券管理</h1>
              <p className="text-muted-foreground">
                创建和管理优惠券活动
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              创建优惠券
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总优惠券</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">
                  +3 本月新增
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">已使用</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground">
                  使用率 68%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">节省金额</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥12,456</div>
                <p className="text-xs text-muted-foreground">
                  用户总节省
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活跃优惠券</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  正在进行中
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>优惠券列表</CardTitle>
              <CardDescription>
                管理所有优惠券的状态和使用情况
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">优惠券名称</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">类型</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">面额</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">使用门槛</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">已发放/总数</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">有效期</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">状态</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">新用户专享券</td>
                      <td className="p-4">满减券</td>
                      <td className="p-4">¥10</td>
                      <td className="p-4">满¥100</td>
                      <td className="p-4">85/100</td>
                      <td className="p-4">2024-01-31</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">进行中</span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                        <button className="text-sm text-red-600 hover:text-red-800">停用</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">春节特惠券</td>
                      <td className="p-4">满减券</td>
                      <td className="p-4">¥20</td>
                      <td className="p-4">满¥200</td>
                      <td className="p-4">150/200</td>
                      <td className="p-4">2024-02-15</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">进行中</span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                        <button className="text-sm text-red-600 hover:text-red-800">停用</button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">VIP专享券</td>
                      <td className="p-4">折扣券</td>
                      <td className="p-4">9折</td>
                      <td className="p-4">满¥500</td>
                      <td className="p-4">45/50</td>
                      <td className="p-4">2024-03-01</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">待开始</span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                        <button className="text-sm text-red-600 hover:text-red-800">删除</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4">元旦促销券</td>
                      <td className="p-4">满减券</td>
                      <td className="p-4">¥50</td>
                      <td className="p-4">满¥300</td>
                      <td className="p-4">200/200</td>
                      <td className="p-4">2024-01-03</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">已结束</span>
                      </td>
                      <td className="p-4">
                        <button className="text-sm text-blue-600 hover:text-blue-800 mr-2">查看</button>
                        <button className="text-sm text-green-600 hover:text-green-800">复制</button>
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