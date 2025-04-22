"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, AlertTriangle, RefreshCw } from "lucide-react"
import { DndContext, DragOverlay, closestCenter, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { toast } from "react-toastify"

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

interface TimeSlot {
  id: string
  date: Date
  startTime: string
  endTime: string
  match: Match | null
  isEmpty: boolean
}

interface SlotScheduleViewProps {
  matches: Match[]
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => Promise<void>
  dateFilter: "all" | string
}

export default function SlotScheduleView({ matches, onUpdateMatch, dateFilter }: SlotScheduleViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>({})
  const [planSettings, setPlanSettings] = useState({
    matchDuration: 60,
    timeBetweenMatches: 10,
    startTime: "08:00",
    endTime: "18:00",
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const activeMatch = matches.find((match) => match.id === activeId) || null

  // Generate time slots for each date and assign matches to slots
  useEffect(() => {
    // Group dates from matches
    const uniqueDates = Array.from(new Set(matches.map((match) => match.date.toISOString().split("T")[0]))).sort()

    // Define standard time slots for each day
    const standardTimeSlots = [
      { start: "08:00", end: "09:00" },
      { start: "09:10", end: "10:10" },
      { start: "10:20", end: "11:20" },
      { start: "14:00", end: "15:00" },
      { start: "16:00", end: "17:00" },
      { start: "18:00", end: "19:00" },
    ]

    // Create slots for each date
    const slots: Record<string, TimeSlot[]> = {}

    uniqueDates.forEach((dateStr) => {
      const date = new Date(dateStr)
      const slotsForDate: TimeSlot[] = []

      // Create standard slots for this date
      standardTimeSlots.forEach((timeSlot, index) => {
        slotsForDate.push({
          id: `slot-${dateStr}-${timeSlot.start}`,
          date,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          match: null,
          isEmpty: true,
        })
      })

      // Assign matches to slots
      matches.forEach((match) => {
        const matchDateStr = match.date.toISOString().split("T")[0]
        if (matchDateStr === dateStr) {
          // Find the slot with matching start time
          const slotIndex = slotsForDate.findIndex((slot) => slot.startTime === match.startTime)
          if (slotIndex !== -1) {
            slotsForDate[slotIndex].match = match
            slotsForDate[slotIndex].isEmpty = false
          }
        }
      })

      slots[dateStr] = slotsForDate
    })

    setTimeSlots(slots)
  }, [matches])

  // Add a visual indicator when dragging to show where the match can be dropped
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
    setIsDragging(true)

    // Add a subtle animation to all drop areas to indicate they can receive the match
    document.querySelectorAll('[data-droppable="true"]').forEach((el) => {
      el.classList.add("pulse-animation")
    })
  }

  // Thay đổi hàm handleDragEnd để đảm bảo cập nhật đúng cách
  const handleDragEnd = async (event: any) => {
    setIsDragging(false)
    setActiveId(null)

    // Remove the animation from all drop areas
    document.querySelectorAll('[data-droppable="true"]').forEach((el) => {
      el.classList.remove("pulse-animation")
    })

    const { active, over } = event

    if (over && active.id !== over.id) {
      const match = matches.find((m) => m.id === active.id)
      if (!match) return;

      // slotId format: slot-YYYY-MM-DD-HH:MM
      const regex = /^slot-(\d{4}-\d{2}-\d{2})-(\d{2}:\d{2})$/;
      const matchResult = over.id.match(regex);
      if (!matchResult) return;
      const slotDate = matchResult[1];
      const slotStartTime = matchResult[2];

      const slots = timeSlots[slotDate] || [];
      const targetSlot = slots.find((slot) => slot.startTime === slotStartTime);
      // Only allow drop if slot is empty
      if (targetSlot && targetSlot.isEmpty) {
        try {
          await onUpdateMatch(match.id, {
            date: new Date(slotDate),
            startTime: targetSlot.startTime,
            endTime: targetSlot.endTime,
          });
        } catch (error) {
          console.error("Failed to update match date:", error);
        }
      }
      else {
        toast.error("This slot has already had a match");
      }
    }
  }

  const handlePlanSettingChange = (setting: keyof typeof planSettings, value: string | number) => {
    setPlanSettings((prev) => ({
      ...prev,
      [setting]: value,
    }))
  }

  const handleGenerateSchedule = () => {
    alert("Schedule generation would be implemented here")
  }

  // Filter dates based on dateFilter
  const filteredDates = Object.keys(timeSlots)
    .filter((date) => dateFilter === "all" || date === dateFilter)
    .sort()

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="flex-1 space-y-8">
          {filteredDates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
              <p className="text-neutral-600">No matches scheduled.</p>
            </div>
          ) : (
            filteredDates.map((dateStr) => (
              <div key={dateStr} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                <div className="bg-blue-200 px-6 py-3">
                  <h3 className="text-lg font-semibold">
                    {new Date(dateStr).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {timeSlots[dateStr].map((slot) => (
                    <SlotDropArea key={slot.id} slot={slot} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Overlay when dragging */}
        <DragOverlay>
          {isDragging && activeMatch && (
            <div className="p-4 bg-white rounded-lg border border-primary-300 shadow-md w-full max-w-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    {activeMatch.startTime} - {activeMatch.endTime}
                  </span>
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
                    Group {activeMatch.group}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-center">
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

      {/* Plan Information Sidebar */}
      <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-neutral-200 p-6 h-fit">
        <h3 className="text-xl font-bold mb-6">Plan Information</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Match duration</label>
            <div className="flex">
              <input
                type="number"
                value={planSettings.matchDuration}
                onChange={(e) => handlePlanSettingChange("matchDuration", Number.parseInt(e.target.value))}
                className="flex-1 input input-bordered"
              />
              <span className="flex items-center justify-center px-4 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-md">
                minutes
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time between matches</label>
            <div className="flex">
              <input
                type="number"
                value={planSettings.timeBetweenMatches}
                onChange={(e) => handlePlanSettingChange("timeBetweenMatches", Number.parseInt(e.target.value))}
                className="flex-1 input input-bordered"
              />
              <span className="flex items-center justify-center px-4 bg-neutral-100 border border-l-0 border-neutral-300 rounded-r-md">
                minutes
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start time of event date</label>
            <div className="relative">
              <input
                type="time"
                value={planSettings.startTime}
                onChange={(e) => handlePlanSettingChange("startTime", e.target.value)}
                className="w-full input input-bordered"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End time of event date</label>
            <div className="relative">
              <input
                type="time"
                value={planSettings.endTime}
                onChange={(e) => handlePlanSettingChange("endTime", e.target.value)}
                className="w-full input input-bordered"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateSchedule}
            className="w-full btn btn-primary p-3 flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            GENERATE
          </button>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Schedule generation is disabled as the tournament has already started
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for a match that can be dragged
function DraggableMatch({ match }: { match: Match }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: match.id,
    data: { match },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-lg border ${
        match.completed
          ? "bg-neutral-100 border-neutral-200 text-neutral-600"
          : "bg-white border-primary-200 hover:border-primary-400"
      } cursor-move hover:shadow-md transition-all ${isDragging ? "opacity-50" : "opacity-100"}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">#{match.team1.id.split("-")[1]}</div>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Home</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">#{match.team2.id.split("-")[1]}</div>
        <div className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">Away</div>
      </div>

      {match.venue && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {match.venue}
        </div>
      )}
    </div>
  )
}

// Component for a slot that can receive matches
function SlotDropArea({ slot }: { slot: TimeSlot }) {
  const { setNodeRef, isOver } = useDroppable({
    id: slot.id,
  })

  return (
    <div
      ref={setNodeRef}
      data-droppable="true"
      className={`p-3 rounded-lg ${
        isOver
          ? "border-2 border-primary-400 bg-primary-50"
          : slot.isEmpty
            ? "border-2 border-dashed border-gray-300 bg-gray-50"
            : "border border-gray-200 bg-white"
      } min-h-[120px] transition-colors duration-200`}
    >
      <div className="text-sm font-medium text-gray-700 mb-2">
        {slot.startTime} - {slot.endTime}
      </div>

      {slot.isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center text-sm text-gray-500 py-4">
          <p>
            Slot {slot.startTime.split(":")[0]} • {slot.startTime}
          </p>
          <p className="text-gray-400 mt-1">Drop match here</p>
        </div>
      ) : (
        <div>{slot.match && <DraggableMatch match={slot.match} />}</div>
      )}
    </div>
  )
}
