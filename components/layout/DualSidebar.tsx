"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
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
  Info,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DualSidebarProps {
  isMobile?: boolean
}

export default function DualSidebar({ isMobile = false }: DualSidebarProps) {
  const pathname = usePathname()
  const params = useParams()
    const router = useRouter();
  const tournamentId = params?.id as string
  const [collapsed, setCollapsed] = useState(false)
  const [tournamentSidebarOpen, setTournamentSidebarOpen] = useState(true)
  const handleLogout = () => {
    // Use the new auth cookie system for logout
    import('../../utils/authCookies').then(({ clearAuthData }) => {
      clearAuthData();
      router.push('/landing');
    });
  }
  // Reset collapsed state when switching between mobile and desktop
  useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  // Check if we're in a tournament context
  const isInTournamentContext = pathname.includes("/tournaments/") && tournamentId

  // Global navigation items
  const globalNavItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/tournaments", label: "Tournaments", icon: Layout },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Support", icon: HelpCircle },
  ]

  // Tournament-specific navigation items
  const tournamentNavItems = [
    {
      href: `/tournaments/${tournamentId}`,
      label: "Overview",
      icon: Info,
    },
    {
      href: `/tournaments/${tournamentId}/details`,
      label: "Details",
      icon: Trophy,
    },
    {
      href: `/tournaments/${tournamentId}/participants`,
      label: "Participants",
      icon: Users,
    },
    {
      href: `/tournaments/${tournamentId}/schedule`,
      label: "Schedule",
      icon: Calendar,
    },
    {
      href: `/tournaments/${tournamentId}/results`,
      label: "Results",
      icon: ListChecks,
    },
    {
      href: `/tournaments/${tournamentId}/leaderboard`,
      label: "Leaderboard",
      icon: BarChart3,
    },
  ]

  return (
    <div className="flex h-full">
      {/* Global Sidebar */}
      {!isInTournamentContext && (
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
          <div className="px-3 mb-6">
            {!collapsed && <p className="text-xs font-semibold text-neutral-400 uppercase px-2 mb-2">Main</p>}
            <ul className="space-y-1">
              {globalNavItems.map((item) => {
                const isActive =
                  pathname === item.href || (item.href === "/tournaments" && pathname.startsWith("/tournaments/"))
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

          {!collapsed && (
            <div className="p-4 mx-3 mb-4 bg-primary-50 rounded-lg border border-primary-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-primary-100 rounded-full">
                  <Bell className="h-4 w-4 text-primary-600" />
                </div>
                <h4 className="font-medium text-primary-700">Pro Tips</h4>
              </div>
              <p className="text-xs text-primary-700">
                Use keyboard shortcuts for faster navigation. Press{" "}
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-primary-200 text-primary-700 font-mono text-xs">
                  ?
                </kbd>{" "}
                to view all shortcuts.
              </p>
            </div>
          )}

          <div className="p-4 border-t border-neutral-200">
            <button
              className={cn(
                "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors",
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </aside>
      )}
      

      {/* Tournament Sidebar - Only shown when in a tournament context */}
      {isInTournamentContext && (
        <aside
          className={cn(
            "bg-white border-r border-neutral-200 transition-all duration-300 flex flex-col h-full custom-scrollbar",
            tournamentSidebarOpen ? "w-[250px]" : "w-[0px] overflow-hidden",
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="bg-secondary-600 p-2 rounded-full">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-800 truncate">Tournament Menu</h2>
            </div>
            {!isMobile && (
              <button
                onClick={() => setTournamentSidebarOpen(!tournamentSidebarOpen)}
                className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
                aria-label={tournamentSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            <div className="px-3 mb-2">
              <ul className="space-y-1">
                {tournamentNavItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
                          isActive
                            ? "bg-secondary-50 text-secondary-700 font-medium"
                            : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          <div className="p-4 mx-3 mb-4 bg-secondary-50 rounded-lg border border-secondary-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-secondary-100 rounded-full">
                <Info className="h-4 w-4 text-secondary-600" />
              </div>
              <h4 className="font-medium text-secondary-700">Tournament Info</h4>
            </div>
            <p className="text-xs text-secondary-700">
              You are currently viewing tournament details. Use the navigation above to explore different sections.
            </p>
          </div>
        </aside>
      )}

      {/* Mobile Tournament Sidebar Toggle */}
      {isInTournamentContext && isMobile && (
        <button
          onClick={() => setTournamentSidebarOpen(!tournamentSidebarOpen)}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-full bg-secondary-600 text-white shadow-lg"
          aria-label={tournamentSidebarOpen ? "Close tournament menu" : "Open tournament menu"}
        >
          {tournamentSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}
    </div>
  )
}
