"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Users, Calendar, ListChecks, BarChart3, ArrowRight, Edit, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useDataFetching } from "../../../context/DataFetchingContext"
import LoadingSpinner from "../../../components/ui-elements/LoadingSpinner"

interface TournamentDetail {
  id: string
  title: string
  category: string
  format: string
  location: string
  description: string
  startDate: Date
  endDate: Date
  status: "active" | "completed" | "upcoming"
  teamsCount: number
  matchesCount: number
  completedMatches: number
  upcomingMatches: number
  progress: number
  organizers: { name: string; role: string }[]
  nextMatches: {
    id: string
    date: Date
    time: string
    team1: string
    team2: string
    venue: string
  }[]
}

export default function TournamentOverview() {
  const params = useParams()
  const tournamentId = params?.id as string
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { simulateFetch } = useDataFetching()

  useEffect(() => {
    const loadTournament = async () => {
      try {
        // Dữ liệu mẫu
        const sampleTournament: TournamentDetail = {
          id: tournamentId,
          title: "Summer Football Championship 2023",
          category: "Bóng đá",
          format: "Vòng bảng + Loại trực tiếp",
          location: "Sân vận động Thành phố",
          description: "Giải đấu bóng đá mùa hè thường niên dành cho các đội nghiệp dư.",
          startDate: new Date("2023-06-15"),
          endDate: new Date("2023-07-30"),
          status: "active",
          teamsCount: 16,
          matchesCount: 32,
          completedMatches: 14,
          upcomingMatches: 18,
          progress: 45,
          organizers: [
            { name: "Nguyễn Văn A", role: "Quản lý giải đấu" },
            { name: "Trần Thị B", role: "Điều phối viên" },
            { name: "Lê Văn C", role: "Trọng tài chính" },
          ],
          nextMatches: [
            {
              id: "match-1",
              date: new Date(Date.now() + 86400000), // Ngày mai
              time: "15:00",
              team1: "FC Barcelona",
              team2: "Real Madrid",
              venue: "Sân A",
            },
            {
              id: "match-2",
              date: new Date(Date.now() + 86400000), // Ngày mai
              time: "17:30",
              team1: "Manchester United",
              team2: "Bayern Munich",
              venue: "Sân B",
            },
            {
              id: "match-3",
              date: new Date(Date.now() + 172800000), // Ngày kia
              time: "16:00",
              team1: "Liverpool",
              team2: "PSG",
              venue: "Sân A",
            },
          ],
        }

        // Giả lập API call
        const data = await simulateFetch(sampleTournament, 1500)
        setTournament(data)
      } catch (error) {
        console.error("Failed to load tournament details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTournament()
  }, [tournamentId, simulateFetch])

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-medium text-neutral-800 mb-2">Không thể tải thông tin giải đấu</h3>
        <p className="text-neutral-600">Đã xảy ra lỗi khi tải thông tin chi tiết của giải đấu.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Tổng quan giải đấu</h2>
        <Link href={`/tournaments/${tournamentId}/edit`} className="btn btn-outline flex items-center space-x-2">
          <Edit className="h-5 w-5" />
          <span>Chỉnh sửa</span>
        </Link>
      </div>

      {/* Tiến độ giải đấu */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-neutral-800 mb-3">Tiến độ giải đấu</h3>
        <div className="w-full bg-neutral-200 rounded-full h-3 mb-2">
          <div className="bg-primary-500 h-3 rounded-full" style={{ width: `${tournament.progress}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Bắt đầu: {formatDate(tournament.startDate)}</span>
          <span>{tournament.progress}% hoàn thành</span>
          <span>Kết thúc: {formatDate(tournament.endDate)}</span>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Đội tham gia</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{tournament.teamsCount}</p>
          <Link
            href={`/tournaments/${tournamentId}/participants`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>Xem chi tiết</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-secondary-100 text-secondary-600 mr-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Tổng số trận</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{tournament.matchesCount}</p>
          <Link
            href={`/tournaments/${tournamentId}/schedule`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>Xem lịch thi đấu</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-success-100 text-success-600 mr-3">
              <ListChecks className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Đã hoàn thành</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{tournament.completedMatches}</p>
          <Link
            href={`/tournaments/${tournamentId}/results`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>Xem kết quả</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-accent-100 text-accent-600 mr-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Sắp diễn ra</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{tournament.upcomingMatches}</p>
          <Link
            href={`/tournaments/${tournamentId}/schedule`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>Xem lịch sắp tới</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Thông tin giải đấu và trận đấu sắp tới */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Thông tin giải đấu */}
        <div>
          <h3 className="text-lg font-medium text-neutral-800 mb-3">Thông tin giải đấu</h3>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Thể thức</p>
                <p className="font-medium">{tournament.format}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Địa điểm</p>
                <p className="font-medium">{tournament.location}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Mô tả</p>
                <p className="font-medium">{tournament.description}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Ban tổ chức</p>
                <ul className="space-y-2">
                  {tournament.organizers.map((organizer, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="font-medium">{organizer.name}</span>
                      <span className="text-neutral-500">{organizer.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/tournaments/${tournamentId}/details`}
                className="btn btn-outline flex items-center justify-center space-x-2 w-full"
              >
                <span>Xem chi tiết đầy đủ</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trận đấu sắp tới */}
        <div>
          <h3 className="text-lg font-medium text-neutral-800 mb-3">Trận đấu sắp tới</h3>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="space-y-4">
              {tournament.nextMatches.map((match) => (
                <div key={match.id} className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                  <div className="flex items-center text-sm text-neutral-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-3">
                      {new Intl.DateTimeFormat("vi-VN", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      }).format(match.date)}
                    </span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="mr-3">{match.time}</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{match.venue}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex-1 text-right">
                      <span className="font-medium">{match.team1}</span>
                    </div>
                    <div className="mx-4 text-center">
                      <span className="text-lg font-bold text-neutral-400">VS</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-medium">{match.team2}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/tournaments/${tournamentId}/schedule`}
                className="btn btn-outline flex items-center justify-center space-x-2 w-full"
              >
                <span>Xem lịch thi đấu đầy đủ</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Liên kết nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/tournaments/${tournamentId}/participants`}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">Đội tham gia</h4>
            <p className="text-sm text-neutral-500">Quản lý các đội tham gia giải đấu</p>
          </div>
          <ArrowRight className="h-4 w-4 ml-auto text-primary-500" />
        </Link>

        <Link
          href={`/tournaments/${tournamentId}/schedule`}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <div className="p-2 rounded-full bg-secondary-100 text-secondary-600 mr-3">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">Lịch thi đấu</h4>
            <p className="text-sm text-neutral-500">Xem và quản lý lịch thi đấu</p>
          </div>
          <ArrowRight className="h-4 w-4 ml-auto text-primary-500" />
        </Link>

        <Link
          href={`/tournaments/${tournamentId}/leaderboard`}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <div className="p-2 rounded-full bg-accent-100 text-accent-600 mr-3">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">Bảng xếp hạng</h4>
            <p className="text-sm text-neutral-500">Xem bảng xếp hạng hiện tại</p>
          </div>
          <ArrowRight className="h-4 w-4 ml-auto text-primary-500" />
        </Link>
      </div>
    </div>
  )
}
