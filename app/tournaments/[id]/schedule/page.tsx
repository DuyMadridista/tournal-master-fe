"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Calendar, List, FileDown, Plus, Filter, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useDataFetching } from "../../../../context/DataFetchingContext"
import LoadingSpinner from "../../../../components/ui-elements/LoadingSpinner"
import CalendarView from "../../../../components/tournament-schedule/CalendarView"
import ListScheduleView from "../../../../components/tournament-schedule/ListScheduleView"
import SlotScheduleView from "@/components/tournament-schedule/SlotScheduleView"

interface Match {
  id: string
  date: Date
  startTime: string
  endTime: string
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
  const tournamentId = params?.id as string
  const [view, setView] = useState<"list" | "calendar" | "slot">("slot")
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateFilter, setDateFilter] = useState<"all" | string>("all")
  const { simulateFetch } = useDataFetching()

  useEffect(() => {
    const loadMatches = async () => {
      try {
        // Sample data with specific times for slots
        const today = new Date()
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)
        const dayAfterTomorrow = new Date(today)
        dayAfterTomorrow.setDate(today.getDate() + 2)

        // Create sample dates
        const dates = [today, tomorrow, dayAfterTomorrow]

        // Create sample time slots
        const timeSlots = [
          { start: "08:00", end: "09:00" },
          { start: "09:10", end: "10:10" },
          { start: "10:20", end: "11:20" },
          { start: "14:00", end: "15:00" },
          { start: "16:00", end: "17:00" },
          { start: "18:00", end: "19:00" },
        ]

        // Create teams
        const teams = [
          { id: "team-1", name: "FC Barcelona" },
          { id: "team-2", name: "Real Madrid" },
          { id: "team-3", name: "Manchester United" },
          { id: "team-4", name: "Bayern Munich" },
          { id: "team-5", name: "Liverpool" },
          { id: "team-6", name: "PSG" },
          { id: "team-7", name: "Juventus" },
          { id: "team-8", name: "AC Milan" },
        ]

        // Generate matches for each date
        const sampleMatches: Match[] = []

        // Create some matches with assigned slots
        dates.forEach((date, dateIndex) => {
          // Only fill some slots to leave empty ones for dragging
          const filledSlots = dateIndex === 0 ? [0, 1, 2] : dateIndex === 1 ? [0, 3] : [1, 2]

          filledSlots.forEach((slotIndex) => {
            const timeSlot = timeSlots[slotIndex]
            const team1Index = (dateIndex + slotIndex) % teams.length
            const team2Index = (dateIndex + slotIndex + 4) % teams.length

            sampleMatches.push({
              id: `match-${dateIndex}-${slotIndex}`,
              date: new Date(date),
              startTime: timeSlot.start,
              endTime: timeSlot.end,
              team1: teams[team1Index],
              team2: teams[team2Index],
              venue: `Field ${String.fromCharCode(65 + (slotIndex % 3))}`,
              round: `Round ${Math.floor((dateIndex * timeSlots.length + slotIndex) / 8) + 1}`,
              group: String.fromCharCode(65 + (slotIndex % 4)),
              completed: dateIndex === 0 && slotIndex < 2,
              matchDayId: `md-${dateIndex + 1}`,
            })
          })
        })

        // Simulate API call
        const data = await simulateFetch(sampleMatches, 1500)
        setMatches(data)
      } catch (error) {
        console.error("Failed to load matches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMatches()
  }, [tournamentId])

  const handleExportSchedule = async () => {
    try {
      // Simulate API call
      await simulateFetch(null, 1000)
      alert("Schedule exported successfully!")
    } catch (error) {
      console.error("Failed to export schedule:", error)
    }
  }

  // Cập nhật hàm handleUpdateMatch để đảm bảo cập nhật state đúng cách
  const handleUpdateMatch = async (matchId: string, updates: Partial<Match>) => {
    try {
      // Cập nhật state trước khi gọi API để UI phản ánh ngay lập tức
      setMatches((prevMatches) =>
        prevMatches.map((match) => (match.id === matchId ? { ...match, ...updates } : match))
      );
      // Gọi API giả lập, KHÔNG setMatches lại sau khi await
      await simulateFetch(null, 1000);

      // Không cần cập nhật state lần nữa vì đã cập nhật ở trên
    } catch (error) {
      console.error("Failed to update match:", error)
      // Nếu có lỗi, có thể cần phục hồi state về trạng thái trước đó
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
      {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-neutral-800">Schedule</h2>

        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportSchedule} className="btn btn-outline flex items-center space-x-2 p-2">
            <FileDown className="h-5 w-5" />
            <span>Export Schedule</span>
          </button>

          <button className="btn btn-primary flex items-center space-x-2 p-2">
            <Plus className="h-5 w-5" />
            <span>Add Match</span>
          </button>
        </div>
      </div> */}

      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-3 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 p-2">
          <button
            onClick={() => setView("slot")}
            className={`btn ${view === "slot" ? "btn-primary" : "btn-outline"} flex items-center space-x-2 p-2`}
          >
            <Clock className="h-5 w-5" />
            <span>Slots</span>
          </button>

          <button
            onClick={() => setView("list")}
            className={`btn ${view === "list" ? "btn-primary" : "btn-outline"} flex items-center space-x-2 p-2`}
          >
            <List className="h-5 w-5" />
            <span>List</span>
          </button>

          <button
            onClick={() => setView("calendar")}
            className={`btn ${view === "calendar" ? "btn-primary" : "btn-outline"} flex items-center space-x-2 p-2`}
          >
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </button>
        </div>

        {view === "calendar" && (
          <div className="flex items-center space-x-2">
            <button onClick={handlePreviousMonth} className="btn btn-sm btn-outline p-1" aria-label="Previous Month">
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button onClick={handleToday} className="btn btn-sm btn-outline">
              Today
            </button>

            <div className="text-lg font-medium">
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                year: "numeric",
              }).format(currentMonth)}
            </div>

            <button onClick={handleNextMonth} className="btn btn-sm btn-outline p-1" aria-label="Next Month">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {view === "slot" && (
          <div className="flex items-center space-x-2 p-2 border rounded-lg border-neutral-400">
            <select
              className="select select-bordered border-neutral-200 border-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              {Array.from(new Set(matches.map((m) => m.date.toISOString().split("T")[0]))).map((date) => (
                <option key={date} value={date} className="text-neutral-800 border-none">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {view === "list" ? (
        <ListScheduleView matches={matches} onUpdateMatch={handleUpdateMatch} />
      ) : view === "calendar" ? (
        <CalendarView matches={matches} currentMonth={currentMonth} onUpdateMatch={handleUpdateMatch} />
      ) : (
        <SlotScheduleView matches={matches} onUpdateMatch={handleUpdateMatch} dateFilter={dateFilter} />
      )}
    </div>
  )
}
