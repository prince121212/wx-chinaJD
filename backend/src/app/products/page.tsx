"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
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
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface Product {
  id: string
  spuId: string
  title: string
  primaryImage: string
  status: number
  category: {
    id: string
    name: string
  }
  skus: Array<{
    price: number
    originPrice: number
    stockQuantity: number
  }>
  createdAt: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchProducts()
  }, [page, keyword])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      
      if (keyword) {
        params.append('keyword', keyword)
      }

      const response = await fetch(`/api/admin/products?${params}`)
      const result = await response.json()

      if (result.success) {
        setProducts(result.data.list)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error('Fetch products error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchProducts()
  }

  const getStatusText = (status: number) => {
    return status === 1 ? '上架' : '下架'
  }

  const getStatusColor = (status: number) => {
    return status === 1 ? 'text-green-600' : 'text-gray-500'
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">商品管理</h1>
              <p className="text-muted-foreground">
                管理商品信息、库存和状态
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              新增商品
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>商品列表</CardTitle>
              <div className="flex gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索商品名称..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-64"
                  />
                  <Button onClick={handleSearch} variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
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
                        <TableHead className="w-20">图片</TableHead>
                        <TableHead>商品信息</TableHead>
                        <TableHead>分类</TableHead>
                        <TableHead>价格</TableHead>
                        <TableHead>库存</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead className="w-32">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        const minPrice = Math.min(...product.skus.map(sku => sku.price))
                        const maxPrice = Math.max(...product.skus.map(sku => sku.price))
                        const totalStock = product.skus.reduce((sum, sku) => sum + sku.stockQuantity, 0)
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="relative w-16 h-16">
                                <Image
                                  src={product.primaryImage}
                                  alt={product.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  SPU: {product.spuId}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{product.category.name}</TableCell>
                            <TableCell>
                              <div>
                                {minPrice === maxPrice ? (
                                  <div>{formatPrice(minPrice)}</div>
                                ) : (
                                  <div>
                                    {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{totalStock}</TableCell>
                            <TableCell>
                              <span className={getStatusColor(product.status)}>
                                {getStatusText(product.status)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>

                  {products.length === 0 && !loading && (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无商品数据
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