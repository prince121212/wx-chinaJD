import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// 使用Prisma直连PostgreSQL作为备用方案
const prisma = new PrismaClient()

// 数据访问层接口
export interface Product {
  id: number
  saasId: string
  storeId: string
  spuId: string
  title: string
  description?: string
  categoryId?: number
  primaryImage?: string
  images?: string
  minPrice: number
  maxPrice: number
  minSalePrice: number
  maxSalePrice: number
  totalStock: number
  soldCount: number
  viewCount: number
  sortOrder: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface ProductSku {
  id: number
  productId: string
  skuId: string
  title: string
  image?: string
  price: string
  salePrice?: string
  stock: number
  soldCount: number
  specs?: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  icon?: string
  image?: string
  sortOrder: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface Banner {
  id: number
  title?: string
  image: string
  link?: string
  linkType: string
  sortOrder: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  id: number
  title: string
  description?: string
  type: string
  value: string
  minAmount?: string
  maxDiscount?: string
  startTime?: string
  endTime?: string
  totalCount: number
  usedCount: number
  status: number
  createdAt: string
  updatedAt: string
}

// 数据访问服务类
export class SupabaseService {
  // 获取产品列表
  static async getProducts(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('Product')
        .select('*', { count: 'exact' })
        .eq('status', 1)
        .order('sortOrder', { ascending: true })
        .order('id', { ascending: true })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      return {
        products: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.log('Supabase REST API失败，使用Prisma直连:', (error as any)?.message || error)

      // 使用Prisma作为备用方案
      const skip = (page - 1) * limit
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where: { status: 1 },
          orderBy: [
            { sortOrder: 'asc' },
            { id: 'asc' }
          ],
          skip,
          take: limit
        }),
        prisma.product.count({
          where: { status: 1 }
        })
      ])

      return {
        products,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  // 根据SPU ID获取产品详情
  static async getProductBySpuId(spuId: string) {
    try {
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('spuId', spuId)
        .eq('status', 1)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.log('Supabase REST API失败，使用Prisma直连:', (error as any)?.message || error)

      // 使用Prisma作为备用方案
      return await prisma.product.findFirst({
        where: {
          spuId,
          status: 1
        }
      })
    }
  }

  // 获取产品的SKU列表
  static async getProductSkus(productId: number | string) {
    try {
      const { data, error } = await supabase
        .from('ProductSku')
        .select('*')
        .eq('productId', productId)
        .eq('status', 1)
        .order('id', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.log('Supabase REST API失败，使用Prisma直连:', (error as any)?.message || error)

      // 使用Prisma作为备用方案
      return await prisma.productSku.findMany({
        where: {
          productId: String(productId),
          status: 1
        },
        orderBy: { id: 'asc' }
      })
    }
  }

  // 获取分类列表
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('Category')
        .select('*')
        .eq('status', 1)
        .order('sortOrder', { ascending: true })
        .order('id', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.log('Supabase REST API失败，使用Prisma直连:', (error as any)?.message || error)

      // 使用Prisma作为备用方案
      return await prisma.category.findMany({
        where: { status: 1 },
        orderBy: [
          { sortOrder: 'asc' },
          { id: 'asc' }
        ]
      })
    }
  }

  // 获取轮播图列表
  static async getBanners() {
    try {
      const { data, error } = await supabase
        .from('Banner')
        .select('*')
        .eq('status', 1)
        .order('sortOrder', { ascending: true })
        .order('id', { ascending: true })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.log('Supabase REST API失败，使用Prisma直连:', (error as any)?.message || error)

      // 使用Prisma作为备用方案
      return await prisma.banner.findMany({
        where: { status: 1 },
        orderBy: [
          { sortOrder: 'asc' },
          { id: 'asc' }
        ]
      })
    }
  }

  // 获取优惠券列表
  static async getCoupons(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('Coupon')
        .select('*')
        .eq('status', 1)
        .order('id', { ascending: true })
        .limit(limit)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.log('Supabase REST API失败，使用Prisma直连:', (error as any)?.message || error)

      // 使用Prisma作为备用方案
      return await prisma.coupon.findMany({
        where: { status: 1 },
        orderBy: { id: 'asc' },
        take: limit
      })
    }
  }
}