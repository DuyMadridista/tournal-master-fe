"use client"

import { useState } from "react"
import { Clock, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react"

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

interface ListScheduleViewProps {
  matches: Match[]
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => Promise<void>
}

export default function ListScheduleView({ matches, onUpdateMatch }: ListScheduleViewProps) {
  const [sortField, setSortField] = useState<"date" | "group" | "round">("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null)

  const toggleSort = (field: "date" | "group" | "round") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedMatches = [...matches].sort((a, b) => {
    if (sortField === "date") {
      const dateA = new Date(`${a.date.toISOString().split("T")[0]}T${a.startTime}`)
      const dateB = new Date(`${b.date.toISOString().split("T")[0]}T${b.startTime}`)
      return sortDirection === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    } else if (sortField === "group") {
      const groupA = a.group || ""
      const groupB = b.group || ""
      return sortDirection === "asc" ? groupA.localeCompare(groupB) : groupB.localeCompare(groupA)
    } else {
      const roundA = a.round || ""
      const roundB = b.round || ""
      return sortDirection === "asc" ? roundA.localeCompare(roundB) : roundB.localeCompare(roundA)
    }
  })

  const toggleMatchExpanded = (matchId: string) => {
    setExpandedMatch(expandedMatch === matchId ? null : matchId)
  }

  const handleMarkCompleted = async (matchId: string, completed: boolean) => {
    await onUpdateMatch(matchId, { completed })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Teams</th>
              <th
                className="px-4 py-3 text-left font-medium text-neutral-600 cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center">
                  <span>Date & Time</span>
                  {sortField === "date" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-neutral-600 cursor-pointer"
                onClick={() => toggleSort("group")}
              >
                <div className="flex items-center">
                  <span>Group</span>
                  {sortField === "group" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left font-medium text-neutral-600 cursor-pointer"
                onClick={() => toggleSort("round")}
              >
                <div className="flex items-center">
                  <span>Round</span>
                  {sortField === "round" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Venue</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-neutral-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedMatches.map((match) => (
              <tr
                key={match.id}
                className={`border-b border-neutral-200 hover:bg-neutral-50 ${
                  expandedMatch === match.id ? "bg-neutral-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{match.team1.name}</span>
                    <span className="font-medium">{match.team2.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                    <div>
                      <div>
                        {match.date.toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-neutral-500 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {match.startTime} - {match.endTime}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {match.group && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Group {match.group}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{match.round}</td>
                <td className="px-4 py-3">
                  {match.venue && (
                    <div className="flex items-center text-neutral-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {match.venue}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {match.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Scheduled
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => toggleMatchExpanded(match.id)}
                      className="p-1 rounded-md hover:bg-neutral-200"
                      aria-label="Toggle details"
                    >
                      {expandedMatch === match.id ? (
                        <ChevronUp className="h-5 w-5 text-neutral-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-600" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
