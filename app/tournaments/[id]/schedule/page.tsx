"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Calendar, List, FileDown, Plus, Filter, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useDataFetching } from "../../../../context/DataFetchingContext"
import LoadingSpinner from "../../../../components/ui-elements/LoadingSpinner"
import CalendarView from "../../../../components/tournament-schedule/CalendarView"
import ListScheduleView from "../../../../components/tournament-schedule/ListScheduleView"
import SlotScheduleView from "@/components/tournament-schedule/SlotScheduleView"
import axios from "axios"
import { toast } from "react-toastify"
import api, { getTournamentById } from "@/apis/api"
import { Tournament } from "@/types/tournament"

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

export default function TournamentSchedulePage() {
  const params = useParams()
  const tournamentId = params?.id as string
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [view, setView] = useState<"list" | "calendar" | "slot">("slot")
  const [matches, setMatches] = useState<Match[]>([])
  const [eventDates, setEventDates] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [dateFilter, setDateFilter] = useState<"all" | string>("all")
  const { simulateFetch } = useDataFetching()

  const loadMatches = async () => {
    setIsLoading(true)
    try {
      const res = await api.get(`/generate/${tournamentId}`)
      const apiData = res.data?.data || []
      setEventDates(apiData)
      mapEventDatesToMatches(apiData)
    } catch (error) {
      console.error("Failed to load matches:", error)
      toast.error("Failed to load matches")
    } finally {
      setIsLoading(false)
    }
  }
  const handleAfterGenerate = () => {
    loadMatches()
  }
  useEffect(() => {
    getTournamentById(tournamentId).then((res) => {
      setTournament(res.data)
    })
    loadMatches()
  }, [tournamentId])

  const mapEventDatesToMatches = (eventDates: any) => {
    const matches: Match[] = []
    eventDates.forEach((eventDate: any) => {
          eventDate.slots.forEach((slot: any) => {
            if (slot.matches) {
              matches.push({
                id: String(slot.matches.id),
                date: new Date(eventDate.date),
                startTime: slot.startTime,
                endTime: slot.endTime,
                teamOne: {
                  teamId: String(slot.matches.teamOne?.teamId),
                  teamName: slot.matches.teamOne?.teamName,
                },
                teamTwo: {
                  teamId: String(slot.matches.teamTwo?.teamId),
                  teamName: slot.matches.teamTwo?.teamName,
                },
                venue: tournament?.place ?? "", 
                round: undefined, 
                group: slot.matches.group ?? undefined,
                completed: new Date() > new Date(eventDate.date), 
                matchDayId: String(eventDate.eventDateId),
              })
            }
          })
        })
    setMatches(matches)
  }

  const handleUpdateMatch = async (matchId: string, slotId: string) => {
    const backup = JSON.parse(JSON.stringify(eventDates));
    try {
      const match = matches.find((m) => m.id === matchId);
      if (match) {
        const newEventDates = eventDates.map((eventDate) => ({
          ...eventDate,
          slots: eventDate.slots.map((slot: any) => {
            if (slot.matches?.id == matchId) {
              return { ...slot, matches: null };
            }
            if (slot.id == slotId) {
              return { ...slot, matches: match };
            }
            return slot;
          }),
        }));
        setEventDates(newEventDates);
        mapEventDatesToMatches(newEventDates);
      }
      await api.put(`/tournament/${tournamentId}/match/dragDrop`, {
        matchId,
        newSlotId: slotId,
      });
      toast.success("Match updated successfully!");
    } catch (error) {
      toast.error("Failed to update match");
      setEventDates(backup);
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
        <ListScheduleView matches={matches} onUpdateMatch={handleUpdateMatch} tournament={tournament} />
      ) : view === "calendar" ? (
        <CalendarView matches={matches} currentMonth={currentMonth} onUpdateMatch={handleUpdateMatch} />
      ) : (
        <SlotScheduleView
          matches={matches}
          onUpdateMatch={handleUpdateMatch}
          dateFilter={dateFilter}
          eventDates={eventDates}
          tournament={tournament}
          onAfterGenerate={handleAfterGenerate}
        />
      )}
    </div>
  )
}
