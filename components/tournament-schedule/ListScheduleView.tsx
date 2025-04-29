"use client"

import { useState } from "react"
import { Clock, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react"
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
interface ListScheduleViewProps {
  matches: Match[]
  onUpdateMatch: (matchId: string, slotId: string) => Promise<void>
  tournament: Tournament | null
}

export default function ListScheduleView({ matches, onUpdateMatch, tournament }: ListScheduleViewProps) {
  console.log(tournament);

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

  const handleMarkCompleted = async (matchId: string, slotId: string) => {
    await onUpdateMatch(matchId, slotId)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-100 border-b border-neutral-200">
              <th
                className="px-4 py-3 text-left font-medium text-neutral-600 cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                <div className="flex items-center">
                  <span>Match Date</span>
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
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Teams</th>
              <th
                className="px-4 py-3 text-left font-medium text-neutral-600 cursor-pointer"
                onClick={() => toggleSort("round")}
              >
                <div className="flex items-center">
                  <span>Match Time</span>
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
              </th>{
                (tournament?.format === "GROUP_STAGE") && (
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
                )
              }
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Venue</th>
              <th className="px-4 py-3 text-left font-medium text-neutral-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedMatches.map((match) => (
              <tr
                key={match.id}
                className={`border-b border-neutral-200 hover:bg-neutral-50 ${expandedMatch === match.id ? "bg-neutral-50" : ""
                  }`}
              >
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

                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-row">
                    <span className="font-medium">{match.teamOne.teamName}</span>
                    <span className="font-medium px-2 text-primary-500">vs</span>
                    <span className="font-medium">{match.teamTwo.teamName}</span>
                  </div>
                </td>
                

                <td className="px-4 py-3"> <div className="text-neutral-500 text-sm flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {match.startTime} - {match.endTime}
                </div></td>
                {tournament?.format === "GROUP_STAGE" &&
                  (<td className="px-4 py-3">
                    {match.group && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Group {match.group}
                      </span>
                    )}
                  </td>)}
                <td className="px-4 py-3">

                  <div className="flex items-center text-neutral-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {tournament?.place}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {match.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Upcoming
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
