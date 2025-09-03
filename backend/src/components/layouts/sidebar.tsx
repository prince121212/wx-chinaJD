"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Gift, 
  Settings, 
  Image,
  BarChart3
} from "lucide-react"

const sidebarNavItems = [
  {
    title: "仪表盘",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "商品管理",
    href: "/products",
    icon: Package,
  },
  {
    title: "订单管理",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "用户管理",
    href: "/users",
    icon: Users,
  },
  {
    title: "优惠券管理",
    href: "/coupons",
    icon: Gift,
  },
  {
    title: "轮播图管理",
    href: "/banners",
    icon: Image,
  },
  {
    title: "统计分析",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "系统设置",
    href: "/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            零售管理后台
          </h2>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === item.href && "bg-secondary"
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}