"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Menu, X, Moon, Sun, Search, Bell, User, Users } from "lucide-react"
import DualSidebar from "./DualSidebar"
import { useMediaQuery } from "../../hooks/use-media-query"
import LoadingOverlay from "../ui-elements/LoadingOverlay"
import Link from "next/link"
import { usePathname, useParams, useRouter } from "next/navigation"
import { getLocalStorage, removeLocalStorage } from '../../utils/localStorage'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [user, setUser] = useState<{ firstName?: string; lastName?: string; email?: string } | null>(null)
  const isMobile = useMediaQuery("(max-width: 1024px)")
  const pathname = usePathname()
  const params = useParams()
  const tournamentId = params?.id as string
  const router = useRouter();

  useEffect(() => {
    const userStr = getLocalStorage('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [])

  const handleLogout = () => {
    // Use the new auth cookie system for logout
    import('../../utils/authCookies').then(({ clearAuthData }) => {
      clearAuthData();
      router.push('/landing');
    });
  }

  // Handle scroll events to add shadow to header when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle("dark")
  }

  // Get page title based on current path
  const getPageTitle = () => {
    const pathSegments = pathname.split("/").filter(Boolean)
    if (pathSegments.length === 0) return "Dashboard"

    const segment = pathSegments[0]
    if (segment === "tournaments") {
      if (pathSegments.length === 1) return "Tournaments"
      if (pathSegments.length === 2) return "Tournament Overview"
      if (pathSegments.length >= 3) {
        const section = pathSegments[2]
        return `Tournament ${section.charAt(0).toUpperCase() + section.slice(1)}`
      }
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // Check if we're in a tournament context
  const isInTournamentContext = pathname.includes("/tournaments/") && tournamentId
  
  // Initialize isLanding state
  const [isLanding, setIsLanding] = useState(false)
  
  // Check if we're on landing or signup page, but only on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLanding(
        window.location.pathname.startsWith('/landing') || 
        window.location.pathname.startsWith('/signup')
      )
    }
  }, [pathname])

  if (isLanding) return <>{children}</>
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <LoadingOverlay />

      <header
        className={`sticky top-0 z-50 bg-gradient-to-r from-primary-500 to-primary-600 text-white transition-all duration-300 ${
          scrolled ? "shadow-lg" : ""
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-primary-500/30 text-primary-50 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}

          {isMobile && (
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">Tourna Master</h1>
            </div>
          )}

          {!isMobile && (
            <div className="flex items-center">
              <div className="w-[250px] flex items-center px-4">
                <div className="bg-purple-600 p-2 rounded-full mr-2">
                <Trophy className="h-6 w-6 text-white" />
              </div>
                <h2 className="text-lg font-semibold text-white">Tourna Master</h2>
              </div>
              {/* <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-primary-300" />
                </div>
                <input
                  type="search"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-primary-400 rounded-md bg-primary-800/20 text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div> */}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-primary-500/30 text-primary-50 hover:text-white transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen)
                  setUserMenuOpen(false)
                }}
                className="p-2 rounded-full hover:bg-primary-500/30 text-primary-50 hover:text-white transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-primary-600"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-dropdown border border-neutral-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-neutral-200">
                    <h3 className="font-semibold text-neutral-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    <div className="p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary-100 rounded-full">
                          <Trophy className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800">New tournament created</p>
                          <p className="text-xs text-neutral-500">Summer Football Championship 2023 was created</p>
                          <p className="text-xs text-neutral-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-secondary-100 rounded-full">
                          <Users className="h-5 w-5 text-secondary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800">New team registered</p>
                          <p className="text-xs text-neutral-500">FC Barcelona has joined the tournament</p>
                          <p className="text-xs text-neutral-400 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-accent-100 rounded-full">
                          <CalendarIcon className="h-5 w-5 text-accent-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-800">Schedule updated</p>
                          <p className="text-xs text-neutral-500">Match schedule was updated for Winter League</p>
                          <p className="text-xs text-neutral-400 mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-neutral-50 border-t border-neutral-200 text-center">
                    <button className="text-sm text-primary-600 font-medium hover:text-primary-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen)
                  setNotificationsOpen(false)
                }}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-primary-500/30 text-primary-50 hover:text-white transition-colors"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-primary-400 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                {!isMobile && (
                  <>
                    <span className="text-sm font-medium">{user?.firstName + ' ' + user?.lastName || 'Duy Luu'}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-dropdown border border-neutral-200 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-neutral-200">
  <p className="text-sm font-medium text-neutral-800">{user?.firstName + ' ' + user?.lastName || 'No name'}</p>
  <p className="text-xs text-neutral-500">{user?.email || ''}</p>
</div>
                  <div className="py-2">
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Account Settings
                    </Link>
                    <Link
                      href="/help"
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      Help & Support
                    </Link>
                  </div>
                  <div className="py-2 border-t border-neutral-200">
                    <button
  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
  onClick={handleLogout}
>
  Logout
</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar - always visible */}
        {!isMobile && <DualSidebar />}

        {/* Mobile sidebar - shown/hidden based on state */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-50 animate-slide-in-left">
              <DualSidebar isMobile={true} />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-neutral-50 custom-scrollbar">{children}</main>
      </div>
    </div>
  )
}

function Trophy(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  )
}
