"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { Trophy, Users, Calendar, ListChecks, BarChart3, ChevronLeft, Settings } from "lucide-react"
import { useDataFetching } from "../../../context/DataFetchingContext"
import LoadingSpinner from "../../../components/ui-elements/LoadingSpinner"

interface Tournament {
  id: string
  title: string
  category: string
  startDate: Date
  endDate: Date
  status: "active" | "completed" | "upcoming"
}

export default function TournamentLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const pathname = usePathname()
  const tournamentId = params?.id as string
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { simulateFetch } = useDataFetching()

  useEffect(() => {
    const loadTournament = async () => {
      try {
        // Dữ liệu mẫu
        const sampleTournament: Tournament = {
          id: tournamentId,
          title: "Summer Football Championship 2023",
          category: "Bóng đá",
          startDate: new Date("2023-06-15"),
          endDate: new Date("2023-07-30"),
          status: "active",
        }

        // Giả lập API call
        const data = await simulateFetch(sampleTournament, 1000)
        setTournament(data)
      } catch (error) {
        console.error("Failed to load tournament:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTournament()
  }, [tournamentId, simulateFetch])

  const navItems = [
    {
      href: `/tournaments/${tournamentId}`,
      label: "Tổng quan",
      icon: Trophy,
    },
    {
      href: `/tournaments/${tournamentId}/details`,
      label: "Chi tiết",
      icon: Settings,
    },
    {
      href: `/tournaments/${tournamentId}/participants`,
      label: "Đội tham gia",
      icon: Users,
    },
    {
      href: `/tournaments/${tournamentId}/schedule`,
      label: "Lịch thi đấu",
      icon: Calendar,
    },
    {
      href: `/tournaments/${tournamentId}/results`,
      label: "Kết quả",
      icon: ListChecks,
    },
    {
      href: `/tournaments/${tournamentId}/leaderboard`,
      label: "Bảng xếp hạng",
      icon: BarChart3,
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-8 text-center">
          <h3 className="text-lg font-medium text-neutral-800 mb-2">Không tìm thấy giải đấu</h3>
          <p className="text-neutral-600 mb-6">Giải đấu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          <Link href="/tournaments" className="btn btn-primary">
            Quay lại danh sách giải đấu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div >
        <Link href="/tournaments" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Back to Tournament List</span>
        </Link>
        {/* <h1 className="text-3xl font-bold text-neutral-800 mb-2">{tournament.title}</h1>
        <div className="flex items-center">
          <span className="text-neutral-600 mr-2">{tournament.category}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              tournament.status === "active"
                ? "bg-success-100 text-success-800"
                : tournament.status === "upcoming"
                  ? "bg-primary-100 text-primary-800"
                  : "bg-neutral-100 text-neutral-800"
            }`}
          >
            {tournament.status === "active"
              ? "Đang diễn ra"
              : tournament.status === "upcoming"
                ? "Sắp diễn ra"
                : "Đã kết thúc"}
          </span>
        </div> */}
      </div>

      {/* Navigation */}
      {/* <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-2 mb-6 overflow-x-auto">
        <div className="flex min-w-max">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 font-medium"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div> */}

      {/* Content */}
      <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-4">{children}</div>
    </div>
  )
}
