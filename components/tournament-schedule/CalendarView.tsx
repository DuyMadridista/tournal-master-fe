"use client"

import { useState } from "react"
import { Clock, MapPin } from "lucide-react"

interface Match {
  id: string
  date: Date
  startTime: string
  endTime: string
  teamOne: {
    teamId: string
    teamName: string
  }
  teamTwo: {
    teamId: string
    teamName: string
  }
  venue?: string
  round?: string
  group?: string
  completed: boolean
  matchDayId?: string
}

interface CalendarViewProps {
  matches: Match[]
  currentMonth: Date
  onUpdateMatch: (matchId: string, updates: string) => Promise<void>
}

export default function CalendarView({ matches, currentMonth, onUpdateMatch }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Generate calendar days for the current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Create calendar grid
  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null) // Empty cells for days before the 1st of the month
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }

  // Group matches by date
  const matchesByDate: Record<string, Match[]> = {}
  matches.forEach((match) => {
    const dateStr = match.date.toISOString().split("T")[0]
    if (!matchesByDate[dateStr]) {
      matchesByDate[dateStr] = []
    }
    matchesByDate[dateStr].push(match)
  })

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="grid grid-cols-7 gap-px bg-neutral-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-neutral-100 p-2 text-center font-medium text-neutral-600">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="bg-white p-2 min-h-[100px]" />
          }

          const dateStr = day.toISOString().split("T")[0]
          const dayMatches = matchesByDate[dateStr] || []
          const isToday =
            day.getDate() === new Date().getDate() &&
            day.getMonth() === new Date().getMonth() &&
            day.getFullYear() === new Date().getFullYear()
          const isSelected =
            selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth()

          return (
            <div
              key={dateStr}
              className={`bg-white p-2 min-h-[100px] border-t ${
                isToday ? "bg-blue-50" : isSelected ? "bg-neutral-50" : ""
              }`}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                    isToday ? "bg-blue-500 text-white" : isSelected ? "bg-neutral-200" : ""
                  }`}
                >
                  {day.getDate()}
                </span>
                {dayMatches.length > 0 && (
                  <span className="text-xs font-medium text-neutral-500">{dayMatches.length} matches</span>
                )}
              </div>

              <div className="space-y-1 overflow-y-auto max-h-[150px]">
                {dayMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`p-1 rounded text-xs ${
                      match.completed ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    <div className="flex items-center text-neutral-500 mb-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{match.startTime}</span>
                    </div>
                    <div className="font-medium">
                      {match.teamOne.teamName} vs {match.teamTwo.teamName}
                    </div>
                    {match.venue && (
                      <div className="flex items-center text-neutral-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{match.venue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
