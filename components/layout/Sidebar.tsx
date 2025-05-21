"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Trophy,
  Users,
  Calendar,
  ListChecks,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  HelpCircle,
  Bell,
  Layout,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isMobile?: boolean
}

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Reset collapsed state when switching between mobile and desktop
  useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/tournaments", label: "Quản lý giải đấu", icon: Layout },
    { href: "/details", label: "Chi tiết giải đấu", icon: Trophy },
    { href: "/participants", label: "Đội tham gia", icon: Users },
    { href: "/schedule", label: "Lịch thi đấu", icon: Calendar },
    { href: "/results", label: "Kết quả", icon: ListChecks },
    { href: "/leaderboard", label: "Bảng xếp hạng", icon: BarChart3 },
    { href: "/settings", label: "Cài đặt", icon: Settings },
  ]

  return (
    <aside
      className={cn(
        "bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col h-full custom-scrollbar",
        collapsed ? "w-[70px]" : "w-[250px]",
      )}
    >
      <div className="flex items-center p-4 border-b border-neutral-200">
        {!collapsed && (
          <div className="flex items-center space-x-3 flex-1">
            <div className="bg-primary-600 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-neutral-800">Tourna Master</h1>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto">
            <div className="bg-primary-600 p-2 rounded-full">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2">
          {!collapsed && <p className="text-xs font-semibold text-neutral-400 uppercase px-2 mb-2">Main</p>}
          <ul className="space-y-1">
            {navItems.slice(0, 2).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="px-3 mb-2">
          {!collapsed && <p className="text-xs font-semibold text-neutral-400 uppercase px-2 mb-2">Tournament</p>}
          <ul className="space-y-1">
            {navItems.slice(2, 7).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="px-3">
          {!collapsed && <p className="text-xs font-semibold text-neutral-400 uppercase px-2 mb-2">Account</p>}
          <ul className="space-y-1">
            {navItems.slice(7).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
            <li>
              <Link
                href="/help"
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                  pathname === "/help"
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                <HelpCircle className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>Help</span>}
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {!collapsed && (
        <div className="p-4 mx-3 mb-4 bg-primary-50 rounded-lg border border-primary-100">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary-100 rounded-full">
              <Bell className="h-4 w-4 text-primary-600" />
            </div>
            <h4 className="font-medium text-primary-700">Tip</h4>
          </div>
          <p className="text-xs text-primary-700">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-primary-200 text-primary-700 font-mono text-xs">
              ?
            </kbd>{" "}
            to see all shortcuts.
          </p>
        </div>
      )}

      <div className="p-4 border-t border-neutral-200">
        <button
          className={cn(
            "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors",
          )}
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
