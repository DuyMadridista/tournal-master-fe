"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { CalendarIcon, List, FileDown, Plus, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { useDataFetching } from "../../../../context/DataFetchingContext"
import LoadingSpinner from "../../../../components/ui-elements/LoadingSpinner"
import CalendarView from "../../../../components/tournament-schedule/CalendarView"
import ListScheduleView from "../../../../components/tournament-schedule/ListScheduleView"

interface Match {
  id: string
  date: Date
  time: string
  team1: {
    id: string
    name: string
  }
  team2: {
    id: string
    name: string
  }
  venue?: string
  round?: string
  group?: string
  completed: boolean
  matchDayId?: string
}

export default function TournamentSchedulePage() {
  const params = useParams()
  const tournamentId = params.id as string
  const [view, setView] = useState<"list" | "calendar">("list")
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { simulateFetch } = useDataFetching()

  useEffect(() => {
    const loadMatches = async () => {
      try {
        // Dữ liệu mẫu
        const today = new Date()
        const sampleMatches: Match[] = Array.from({ length: 30 }, (_, i) => {
          const matchDate = new Date(today)
          matchDate.setDate(today.getDate() - 10 + i)

          return {
            id: `match-${i + 1}`,
            date: matchDate,
            time: `${14 + (i % 3) * 2}:00`,
            team1: {
              id: `team-${(i % 8) + 1}`,
              name: [
                "FC Barcelona",
                "Real Madrid",
                "Manchester United",
                "Bayern Munich",
                "Liverpool",
                "PSG",
                "Juventus",
                "AC Milan",
              ][i % 8],
            },
            team2: {
              id: `team-${((i + 4) % 8) + 1}`,
              name: [
                "FC Barcelona",
                "Real Madrid",
                "Manchester United",
                "Bayern Munich",
                "Liverpool",
                "PSG",
                "Juventus",
                "AC Milan",
              ][(i + 4) % 8],
            },
            venue: `Sân ${String.fromCharCode(65 + (i % 3))}`,
            round: `Vòng ${Math.floor(i / 8) + 1}`,
            group: String.fromCharCode(65 + (i % 4)),
            completed: i < 15,
            matchDayId: `md-${Math.floor(i / 3) + 1}`,
          }
        })

        // Giả lập API call
        const data = await simulateFetch(sampleMatches, 1500)
        setMatches(data)
      } catch (error) {
        console.error("Failed to load matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMatches()
  }, [tournamentId, simulateFetch])

  const handleExportSchedule = async () => {
    try {
      // Giả lập API call
      await simulateFetch(null, 1000)
      alert("Lịch thi đấu đã được xuất thành công!")
    } catch (error) {
      console.error("Failed to export schedule:", error)
    }
  }

  const handleUpdateMatch = async (matchId: string, updates: Partial<Match>) => {
    try {
      // Giả lập API call
      await simulateFetch(null, 1000)

      // Cập nhật trận đấu trong state
      setMatches(matches.map((match) => (match.id === matchId ? { ...match, ...updates } : match)))
    } catch (error) {
      console.error("Failed to update match:", error)
    }
  }

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  const handleToday = () => {
    setCurrentMonth(new Date())
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-neutral-800">Lịch thi đấu</h2>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportSchedule} className="btn btn-outline flex items-center space-x-2">
            <FileDown className="h-5 w-5" />
            <span>Xuất lịch</span>
          </button>

          <button className="btn btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Thêm trận đấu</span>
          </button>
        </div>
      </div>

      {/* Thanh công cụ */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-3 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView("list")}
            className={`btn ${view === "list" ? "btn-primary" : "btn-outline"} flex items-center space-x-2`}
          >
            <List className="h-5 w-5" />
            <span>Danh sách</span>
          </button>

          <button
            onClick={() => setView("calendar")}
            className={`btn ${view === "calendar" ? "btn-primary" : "btn-outline"} flex items-center space-x-2`}
          >
            <CalendarIcon className="h-5 w-5" />
            <span>Lịch</span>
          </button>
        </div>

        {view === "calendar" && (
          <div className="flex items-center space-x-2">
            <button onClick={handlePreviousMonth} className="btn btn-sm btn-outline p-1" aria-label="Tháng trước">
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button onClick={handleToday} className="btn btn-sm btn-outline">
              Hôm nay
            </button>

            <div className="text-lg font-medium">
              {new Intl.DateTimeFormat("vi-VN", {
                month: "long",
                year: "numeric",
              }).format(currentMonth)}
            </div>

            <button onClick={handleNextMonth} className="btn btn-sm btn-outline p-1" aria-label="Tháng sau">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        <div>
          <button className="btn btn-outline flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Nội dung */}
      {view === "list" ? (
        <ListScheduleView matches={matches} onUpdateMatch={handleUpdateMatch} />
      ) : (
        <CalendarView matches={matches} currentMonth={currentMonth} onUpdateMatch={handleUpdateMatch} />
      )}
    </div>
  )
}
