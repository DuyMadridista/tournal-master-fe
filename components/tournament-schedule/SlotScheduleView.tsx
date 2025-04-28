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

interface TimeSlot {
  id: string
  date: Date
  startTime: string
  endTime: string
  matches: Match | null

}

interface SlotScheduleViewProps {
  matches: Match[]
  onUpdateMatch: (matchId: string, slotID:string ) => Promise<void>
  dateFilter: "all" | string
  eventDates: any[]
}

export default function SlotScheduleView({ matches, onUpdateMatch, dateFilter, eventDates }: SlotScheduleViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
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
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id.toString())
    setIsDragging(true)
    document.querySelectorAll('[data-droppable="true"]').forEach((el) => {
      el.classList.add("pulse-animation")
    })
  }
  const handleDragEnd = async (event: any) => {
    console.log("Drag End Event", event);
    setIsDragging(false)
    setActiveId(null)
    
    // Remove the animation from all drop areas
    document.querySelectorAll('[data-droppable="true"]').forEach((el) => {
      el.classList.remove("pulse-animation")
    })

    const { active, over } = event
    console.log(over, active.id, over.id);
    
    if (over && active.id !== over.id) {
      console.log("shjadsj");
      
      const match = matches.find((m) => m.id.toString() === active.id.toString())
      if (!match) return;
;
      const slot = eventDates.flatMap(e => e.slots).find(s => s.id === over.id) || null;

      // Only allow drop if slot is empty
      if (slot && !slot.matches) {
        try {
          await onUpdateMatch(match.id, slot.id)
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
  console.log(eventDates);
  
  const handleGenerateSchedule = () => {
    alert("Schedule generation would be implemented here")
  }

  // Filter eventDates based on dateFilter
  const filteredEventDates = eventDates
    .filter((ed) => dateFilter === "all" || ed.date === dateFilter)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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
          {filteredEventDates.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
              <p className="text-neutral-600">No matches scheduled.</p>
            </div>
          ) : (
            filteredEventDates.map((eventDate) => (
              <div key={eventDate.date} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                <div className="bg-blue-200 px-6 py-3">
                  <h3 className="text-lg font-semibold">
                    {new Date(eventDate.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {eventDate.slots?.map((slot: any) => (
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
                  <span className="text-lg font-medium">{activeMatch.teamOne.teamName}</span>
                </div>

                <div className="mx-4 text-center">
                  <span className="text-xl font-bold text-gray-500">vs</span>
                </div>

                <div className="flex-1">
                  <span className="text-lg font-medium">{activeMatch.teamTwo.teamName}</span>
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
  });

  // Safely handle missing team1/team2
  const team1Id = match.teamOne?.teamId ? (match.teamOne.teamId) : "";
  const team2Id = match.teamTwo?.teamId ? (match.teamTwo.teamId) : "";
  const team1Name = match.teamOne?.teamName || "";
  const team2Name = match.teamTwo?.teamName || "";

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
        <div className="text-sm font-medium">{team1Name}</div>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Home</div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm font-medium">{team2Name}</div>
        <div className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">Away</div>
      </div>

      {match.venue && (
        <div className="mt-2 text-xs text-gray-500 flex items-center">
          <MapPin className="h-3 w-3 mr-1" />
          {match.venue}
        </div>
      )}
    </div>
  );
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
          : slot.matches===null
            ? "border-2 border-dashed border-gray-300 bg-gray-50"
            : "border border-gray-200 bg-white"
      } min-h-[120px] transition-colors duration-200`}
    >
      <div className="text-sm font-medium text-gray-700 mb-2">
        {slot.startTime} - {slot.endTime}
      </div>

      {slot.matches ===null ? (
        <div className="h-full flex flex-col items-center justify-center text-sm text-gray-500 py-4">
          <p>
            Slot {slot.startTime.split(":")[0]} • {slot.startTime}
          </p>
          <p className="text-gray-400 mt-1">Drop match here</p>
        </div>
      ) : (
        <div>{slot.matches && <DraggableMatch match={slot.matches} />}</div>
      )}
    </div>
  )
}
