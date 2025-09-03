import { Sidebar } from "@/components/layouts/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">统计分析</h1>
            <p className="text-muted-foreground">
              查看销售数据和用户行为分析
            </p>
          </div>

          <div className="grid gap-6">
            {/* 销售统计 */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">今日销售</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥12,345.67</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% 较昨日
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">本月销售</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥345,678.90</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% 较上月
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">订单转化率</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">
                    +0.5% 较上周
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">客单价</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥89.50</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% 较上月
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 销售趋势图 */}
            <Card>
              <CardHeader>
                <CardTitle>销售趋势</CardTitle>
                <CardDescription>
                  最近30天的销售数据趋势
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
                  <p className="text-muted-foreground">销售趋势图表 (需要集成图表库)</p>
                </div>
              </CardContent>
            </Card>

            {/* 商品分析 */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>热销商品 TOP 5</CardTitle>
                  <CardDescription>
                    本月最受欢迎的商品
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                          <p className="text-sm font-medium">白色连衣裙</p>
                          <p className="text-xs text-muted-foreground">销量: 156件</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">¥29,800</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                          <p className="text-sm font-medium">智能音箱</p>
                          <p className="text-xs text-muted-foreground">销量: 89件</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">¥9,900</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                          <p className="text-sm font-medium">蓝牙耳机</p>
                          <p className="text-xs text-muted-foreground">销量: 67件</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">¥19,900</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>用户行为分析</CardTitle>
                  <CardDescription>
                    用户访问和行为数据
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">页面浏览量</span>
                      <span className="text-sm font-medium">12,345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">独立访客</span>
                      <span className="text-sm font-medium">3,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">平均停留时间</span>
                      <span className="text-sm font-medium">3min 45s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">购物车添加率</span>
                      <span className="text-sm font-medium">12.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">支付成功率</span>
                      <span className="text-sm font-medium">85.6%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}