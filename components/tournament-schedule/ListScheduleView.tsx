"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"
import { DndContext, DragOverlay, closestCenter } from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { useDraggable, useDroppable } from "@dnd-kit/core"

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

interface ListScheduleViewProps {
  matches: Match[]
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => Promise<void>
}

export default function ListScheduleView({ matches, onUpdateMatch }: ListScheduleViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const activeMatch = matches.find((match) => match.id === activeId) || null

  // Nhóm các trận đấu theo ngày
  const matchesByDate = matches.reduce(
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

  // Sắp xếp các ngày
  const sortedDates = Object.keys(matchesByDate).sort()

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
      const targetDateStr = over.id

      if (match && targetDateStr) {
        try {
          const newDate = new Date(targetDateStr)
          await onUpdateMatch(match.id, { date: newDate })
        } catch (error) {
          console.error("Failed to update match date:", error)
        }
      }
    }
  }

  const formatDate = (dateStr: string): string => {
    return new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(dateStr))
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className="space-y-8">
        {sortedDates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
            <p className="text-neutral-600">Không có trận đấu nào được lên lịch.</p>
          </div>
        ) : (
          sortedDates.map((dateStr) => (
            <div key={dateStr} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
              <DropArea id={dateStr}>
                <div className="bg-primary-500 text-white px-6 py-3 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">{formatDate(dateStr)}</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {matchesByDate[dateStr].map((match) => (
                    <DraggableMatch key={match.id} match={match} isDragging={activeId === match.id} />
                  ))}
                </div>
              </DropArea>
            </div>
          ))
        )}
      </div>

      {/* Overlay khi kéo */}
      <DragOverlay>
        {isDragging && activeMatch && (
          <div className="p-4 bg-white rounded-lg border border-primary-300 shadow-md w-full max-w-md">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-2 text-gray-500 mb-2 md:mb-0">
                <Clock className="h-4 w-4" />
                <span>{activeMatch.time}</span>
                {activeMatch.venue && (
                  <>
                    <span className="mx-2">•</span>
                    <MapPin className="h-4 w-4" />
                    <span>{activeMatch.venue}</span>
                  </>
                )}
              </div>

              {activeMatch.group && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  Bảng {activeMatch.group}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-center">
              <div className="flex-1 text-right">
                <span className="text-lg font-medium">{activeMatch.team1.name}</span>
              </div>

              <div className="mx-4 text-center">
                <span className="text-xl font-bold text-gray-500">vs</span>
              </div>

              <div className="flex-1">
                <span className="text-lg font-medium">{activeMatch.team2.name}</span>
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

// Component cho vùng thả
function DropArea({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id,
  })

  return <div ref={setNodeRef}>{children}</div>
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
      className={`p-4 hover:bg-gray-50 cursor-move transition-colors ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-2 text-gray-500 mb-2 md:mb-0">
          <Clock className="h-4 w-4" />
          <span>{match.time}</span>
          {match.venue && (
            <>
              <span className="mx-2">•</span>
              <MapPin className="h-4 w-4" />
              <span>{match.venue}</span>
            </>
          )}
          {match.round && (
            <>
              <span className="mx-2">•</span>
              <span>{match.round}</span>
            </>
          )}
        </div>

        {match.group && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
            Bảng {match.group}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-center">
        <div className="flex-1 text-right">
          <span className="text-lg font-medium">{match.team1.name}</span>
        </div>

        <div className="mx-4 text-center">
          <span className="text-xl font-bold text-gray-500">vs</span>
        </div>

        <div className="flex-1">
          <span className="text-lg font-medium">{match.team2.name}</span>
        </div>
      </div>
    </div>
  )
}
