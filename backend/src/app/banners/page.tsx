import { Sidebar } from "@/components/layouts/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BannersPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">轮播图管理</h1>
              <p className="text-muted-foreground">
                管理首页轮播图和广告位
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              添加轮播图
            </button>
          </div>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>轮播图列表</CardTitle>
                <CardDescription>
                  管理小程序首页的轮播图展示
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 轮播图项目 */}
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-500">图片预览</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">春节大促销</h3>
                      <p className="text-sm text-gray-500">全场商品8折起，满200减50</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>链接类型: 商品详情</span>
                        <span>排序: 1</span>
                        <span>状态: 
                          <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded">已启用</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                        编辑
                      </button>
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                        禁用
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">
                        删除
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-500">图片预览</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">新品上市</h3>
                      <p className="text-sm text-gray-500">潮流服饰新品首发，限时优惠</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>链接类型: 商品分类</span>
                        <span>排序: 2</span>
                        <span>状态: 
                          <span className="ml-1 px-2 py-1 bg-green-100 text-green-800 rounded">已启用</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                        编辑
                      </button>
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                        禁用
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">
                        删除
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg opacity-50">
                    <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-sm text-gray-500">图片预览</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">品牌合作</h3>
                      <p className="text-sm text-gray-500">知名品牌联合促销活动</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>链接类型: 外部链接</span>
                        <span>排序: 3</span>
                        <span>状态: 
                          <span className="ml-1 px-2 py-1 bg-gray-100 text-gray-800 rounded">已禁用</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                        编辑
                      </button>
                      <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
                        启用
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50">
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 设置面板 */}
            <Card>
              <CardHeader>
                <CardTitle>轮播设置</CardTitle>
                <CardDescription>
                  配置轮播图的显示参数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">自动播放间隔</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="3000">3秒</option>
                      <option value="5000" selected>5秒</option>
                      <option value="8000">8秒</option>
                      <option value="10000">10秒</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">轮播高度</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="180">180px</option>
                      <option value="200" selected>200px</option>
                      <option value="220">220px</option>
                      <option value="240">240px</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">圆角大小</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="0">无圆角</option>
                      <option value="4">小圆角</option>
                      <option value="8" selected>中圆角</option>
                      <option value="12">大圆角</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">指示器样式</label>
                    <select className="w-full mt-1 px-3 py-2 border rounded-md">
                      <option value="dots" selected>圆点</option>
                      <option value="lines">线条</option>
                      <option value="numbers">数字</option>
                      <option value="none">隐藏</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    保存设置
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}