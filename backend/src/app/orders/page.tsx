"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layouts/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { formatPrice } from "@/lib/utils"
import { Search, Eye, Package } from "lucide-react"

interface Order {
  id: string
  orderNo: string
  status: number
  totalAmount: number
  actualAmount: number
  addressInfo: any
  user: {
    nickname: string
    phone: string
  }
  items: Array<{
    quantity: number
    price: number
    product: {
      title: string
      image: string
    }
  }>
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [orderNo, setOrderNo] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchOrders()
  }, [page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (orderNo) {
        params.append('orderNo', orderNo)
      }
      
      if (statusFilter) {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/admin/orders?${params}`)
      const result = await response.json()

      if (result.success) {
        setOrders(result.data.list)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchOrders()
  }

  const getStatusText = (status: number) => {
    const statusMap: { [key: number]: string } = {
      1: '待付款',
      2: '已付款',
      3: '已发货',
      4: '已完成',
      5: '已取消'
    }
    return statusMap[status] || '未知'
  }

  const getStatusColor = (status: number) => {
    const colorMap: { [key: number]: string } = {
      1: 'text-orange-600',
      2: 'text-blue-600',
      3: 'text-purple-600',
      4: 'text-green-600',
      5: 'text-gray-500'
    }
    return colorMap[status] || 'text-gray-500'
  }

  const updateOrderStatus = async (orderId: string, newStatus: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      const result = await response.json()
      
      if (result.success) {
        fetchOrders() // 重新获取订单列表
      } else {
        alert(result.msg)
      }
    } catch (error) {
      console.error('Update order status error:', error)
      alert('更新失败')
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">订单管理</h1>
            <p className="text-muted-foreground">
              管理订单状态和发货处理
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>订单列表</CardTitle>
              <div className="flex gap-4">
                <Input
                  placeholder="搜索订单号..."
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-64"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPage(1)
                  }}
                  className="px-3 py-2 border border-input rounded-md"
                >
                  <option value="">全部状态</option>
                  <option value="1">待付款</option>
                  <option value="2">已付款</option>
                  <option value="3">已发货</option>
                  <option value="4">已完成</option>
                  <option value="5">已取消</option>
                </select>
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="text-muted-foreground">加载中...</div>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>订单信息</TableHead>
                        <TableHead>用户信息</TableHead>
                        <TableHead>商品信息</TableHead>
                        <TableHead>金额</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>下单时间</TableHead>
                        <TableHead className="w-32">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.orderNo}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.addressInfo?.name} {order.addressInfo?.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.user?.nickname || '未知用户'}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.user?.phone || ''}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.product.title.slice(0, 30)}
                                  {item.product.title.length > 30 ? '...' : ''} 
                                  x{item.quantity}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <div className="text-sm text-muted-foreground">
                                  等{order.items.length}件商品
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{formatPrice(order.actualAmount)}</div>
                              {order.actualAmount !== order.totalAmount && (
                                <div className="text-sm text-muted-foreground line-through">
                                  {formatPrice(order.totalAmount)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={getStatusColor(order.status)}>
                              {getStatusText(order.status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status === 2 && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateOrderStatus(order.id, 3)}
                                >
                                  <Package className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {orders.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无订单数据
                    </div>
                  )}

                  {total > limit && (
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm text-muted-foreground">
                        共 {total} 条记录，第 {page} 页
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          disabled={page <= 1}
                          onClick={() => setPage(page - 1)}
                        >
                          上一页
                        </Button>
                        <Button
                          variant="outline"
                          disabled={page * limit >= total}
                          onClick={() => setPage(page + 1)}
                        >
                          下一页
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}