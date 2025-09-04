import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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
      // 首先获取总数
      const { count: totalCount, error: countError } = await supabase
        .from('Product')
        .select('*', { count: 'exact', head: true })
        .eq('status', 1)

      if (countError) {
        throw countError
      }

      const total = totalCount || 0
      const offset = (page - 1) * limit

      // 如果请求的页面超出范围，返回空结果
      if (offset >= total && total > 0) {
        return {
          products: [],
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      }

      // 获取数据
      const { data, error } = await supabase
        .from('Product')
        .select('*')
        .eq('status', 1)
        .order('sortOrder', { ascending: true })
        .order('id', { ascending: true })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      return {
        products: data || [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('获取产品列表失败:', error)
      throw error
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
      console.error('获取产品详情失败:', error)
      throw error
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
      console.error('获取产品SKU失败:', error)
      throw error
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
      console.error('获取分类列表失败:', error)
      throw error
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
      console.error('获取轮播图列表失败:', error)
      throw error
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
      console.error('获取优惠券列表失败:', error)
      throw error
    }
  }
}