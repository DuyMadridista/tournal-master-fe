"use client"

import type React from "react"

import { useState } from "react"
import { Clock, MapPin } from "lucide-react"
import { useDraggable } from "@dnd-kit/core"
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"

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

interface CalendarViewProps {
  matches: Match[]
  currentMonth: Date
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => Promise<void>
}

export default function CalendarView({ matches, currentMonth, onUpdateMatch }: CalendarViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const activeMatch = matches.find((match) => match.id === activeId) || null

  // Tạo mảng các ngày trong tháng
  const daysInMonth = getDaysInMonth(currentMonth)

  // Nhóm các trận đấu theo ngày
  const matchesByDay = matches.reduce(
    (acc, match) => {
      const dateStr = match.date.toISOString().split("T")[0]
      if (!acc[dateStr]) {
        acc[dateStr] = []
      }
      acc[dateStr].push(match)
      return acc
    },
    {} as Record<string, Match[]>,
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
    setIsDragging(true)
  }

  const handleDragEnd = async (event: any) => {
    setIsDragging(false)
    setActiveId(null)

    const { active, over } = event

    if (over && active.id !== over.id) {
      const match = matches.find((m) => m.id === active.id)
      const targetDate = over.id

      if (match && targetDate) {
        try {
          const newDate = new Date(targetDate)
          await onUpdateMatch(match.id, { date: newDate })
        } catch (error) {
          console.error("Failed to update match date:", error)
        }
      }
    }
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        {/* Header ngày trong tuần */}
        <div className="grid grid-cols-7 border-b border-neutral-200">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
            <div
              key={day}
              className={`p-2 text-center font-medium ${index === 0 ? "text-red-500" : "text-neutral-700"}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Lưới lịch */}
        <div className="grid grid-cols-7 auto-rows-fr">
          {daysInMonth.map((date, index) => {
            const dateStr = date.toISOString().split("T")[0]
            const dayMatches = matchesByDay[dateStr] || []
            const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
            const isToday = isCurrentDate(date)

            return (
              <DropArea
                key={dateStr}
                id={dateStr}
                className={`min-h-[120px] border border-neutral-100 p-2 ${
                  !isCurrentMonth ? "bg-neutral-50 text-neutral-400" : ""
                } ${isToday ? "bg-primary-50" : ""}`}
              >
                <div className="text-right mb-1">
                  <span
                    className={`inline-block rounded-full w-7 h-7 text-center leading-7 ${
                      isToday ? "bg-primary-500 text-white" : isCurrentMonth ? "text-neutral-700" : "text-neutral-400"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[80px]">
                  {dayMatches.map((match) => (
                    <DraggableMatch key={match.id} match={match} isDragging={activeId === match.id} />
                  ))}
                </div>
              </DropArea>
            )
          })}
        </div>
      </div>

      {/* Overlay khi kéo */}
      <DragOverlay>
        {isDragging && activeMatch && (
          <div className="p-1 bg-white rounded border border-primary-300 shadow-md w-[200px]">
            <div className="text-xs text-neutral-500 mb-1 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{activeMatch.time}</span>
            </div>
            <div className="text-xs font-medium">
              {activeMatch.team1.name} vs {activeMatch.team2.name}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

// Component cho vùng thả
function DropArea({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <div id={id} data-droppable="true" className={className}>
      {children}
    </div>
  )
}

// Component cho trận đấu có thể kéo
function DraggableMatch({ match, isDragging }: { match: Match; isDragging: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: match.id,
    data: { match },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-1 text-xs rounded border ${
        match.completed
          ? "bg-neutral-100 border-neutral-200 text-neutral-600"
          : "bg-primary-50 border-primary-200 text-primary-700"
      } cursor-move hover:shadow-sm transition-shadow`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-medium">{match.time}</span>
        {match.venue && (
          <span className="flex items-center text-neutral-500">
            <MapPin className="h-3 w-3 mr-0.5" />
            {match.venue}
          </span>
        )}
      </div>
      <div className="font-medium truncate">
        {match.team1.name} vs {match.team2.name}
      </div>
    </div>
  )
}

// Hàm lấy tất cả các ngày trong tháng hiển thị (bao gồm cả ngày từ tháng trước/sau để điền đủ lưới)
function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()

  // Ngày đầu tiên của tháng
  const firstDay = new Date(year, month, 1)
  // Ngày cuối cùng của tháng
  const lastDay = new Date(year, month + 1, 0)

  // Lấy ngày trong tuần của ngày đầu tiên (0 = Chủ nhật, 6 = Thứ bảy)
  const firstDayOfWeek = firstDay.getDay()

  // Tính số ngày cần lấy từ tháng trước
  const daysFromPrevMonth = firstDayOfWeek

  // Tính tổng số ngày cần hiển thị (đảm bảo đủ 6 hàng)
  const totalDays = 42 // 6 hàng x 7 ngày

  const days: Date[] = []

  // Thêm ngày từ tháng trước
  for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i)
    days.push(prevDate)
  }

  // Thêm ngày trong tháng hiện tại
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const currentDate = new Date(year, month, i)
    days.push(currentDate)
  }

  // Thêm ngày từ tháng sau
  const remainingDays = totalDays - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i)
    days.push(nextDate)
  }

  return days
}

// Kiểm tra xem có phải là ngày hôm nay không
function isCurrentDate(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}
