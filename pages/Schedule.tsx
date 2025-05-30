"use client"

import { useState, useEffect } from "react"
import type React from "react"
import type { Match, Team, MatchDay } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { Calendar, Clock, MapPin, FileDown, Filter, Tag } from "lucide-react"
import { useDataFetching } from "../context/DataFetchingContext"
import SkeletonLoader from "../components/ui-elements/SkeletonLoader"

// Sample data for demonstration
const sampleTeams: Team[] = [
  {
    id: "team-1",
    name: "FC Barcelona",
    tier: 1,
    group: "A",
    leaderName: "Carlos Rodriguez",
    leaderEmail: "carlos@example.com",
    phoneNumber: "+1234567890",
    playerCount: 18,
  },
  {
    id: "team-2",
    name: "Real Madrid",
    tier: 2,
    group: "B",
    leaderName: "Miguel Fernandez",
    leaderEmail: "miguel@example.com",
    phoneNumber: "+0987654321",
    playerCount: 20,
  },
  {
    id: "team-3",
    name: "Manchester United",
    tier: 3,
    group: "C",
    leaderName: "James Wilson",
    leaderEmail: "james@example.com",
    phoneNumber: "+1122334455",
    playerCount: 22,
  },
  {
    id: "team-4",
    name: "Bayern Munich",
    tier: 4,
    group: "D",
    leaderName: "Hans Mueller",
    leaderEmail: "hans@example.com",
    phoneNumber: "+6677889900",
    playerCount: 19,
  },
]

// Sample match days
const sampleMatchDays: MatchDay[] = [
  {
    id: "md-1",
    date: new Date("2023-06-17"),
    name: "Group Stage - Round 1",
    isActive: true,
  },
  {
    id: "md-2",
    date: new Date("2023-06-18"),
    name: "Group Stage - Round 1",
    isActive: true,
  },
  {
    id: "md-3",
    date: new Date("2023-06-24"),
    name: "Group Stage - Round 2",
    isActive: true,
  },
  {
    id: "md-4",
    date: new Date("2023-06-25"),
    name: "Group Stage - Round 2",
    isActive: true,
  },
  {
    id: "md-5",
    date: new Date("2023-07-01"),
    name: "Group Stage - Round 3",
    isActive: true,
  },
  {
    id: "md-6",
    date: new Date("2023-07-02"),
    name: "Group Stage - Round 3",
    isActive: true,
  },
]

// Generate sample matches
const generateSampleMatches = (): Match[] => {
  const matches: Match[] = []

  // Group stage matches
  sampleMatchDays.forEach((matchDay, dayIndex) => {
    for (let i = 0; i < 3; i++) {
      const team1Index = (dayIndex + i) % sampleTeams.length
      const team2Index = (dayIndex + i + 1) % sampleTeams.length

      matches.push({
        id: `match-${matches.length + 1}`,
        date: matchDay.date,
        time: `${14 + i * 2}:00`,
        team1: sampleTeams[team1Index],
        team2: sampleTeams[team2Index],
        venue: `Field ${(i % 3) + 1}`,
        round: matchDay.name,
        group: sampleTeams[team1Index].group,
        completed: dayIndex < 2,
        matchDayId: matchDay.id,
      })
    }
  })

  return matches
}

const sampleMatches = generateSampleMatches()

// Group matches by match day
const groupMatchesByMatchDay = (matches: Match[], matchDays: MatchDay[]): Record<string, Match[]> => {
  const grouped: Record<string, Match[]> = {}

  matchDays.forEach((matchDay) => {
    const matchesForDay = matches.filter((match) => match.matchDayId === matchDay.id)
    if (matchesForDay.length > 0) {
      grouped[matchDay.id] = matchesForDay
    }
  })

  return grouped
}

export default function Schedule() {
  const [matches, setMatches] = useState<Match[]>([])
  const [matchDays, setMatchDays] = useState<MatchDay[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [selectedMatchDay, setSelectedMatchDay] = useState<string | null>(null)
  const { simulateFetch, isLoading } = useDataFetching()

  // Simulate initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call with a longer delay for initial load
        const matchDaysData = await simulateFetch(sampleMatchDays, 1000)
        setMatchDays(matchDaysData)

        const matchesData = await simulateFetch(sampleMatches, 1000)
        setMatches(matchesData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadData()
  }, [simulateFetch])

  const filteredMatches = matches.filter(
    (match) =>
      (selectedMatchDay ? match.matchDayId === selectedMatchDay : true) &&
      (match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (match.venue && match.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (match.round && match.round.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const groupedMatches = selectedMatchDay
    ? { [selectedMatchDay]: filteredMatches }
    : groupMatchesByMatchDay(filteredMatches, matchDays)

  const handleExportSchedule = async () => {
    try {
      // Simulate API call to export schedule
      await simulateFetch(null, 1500)
      alert("Schedule exported successfully!")
    } catch (error) {
      console.error("Failed to export schedule:", error)
    }
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // This would be implemented with a drag and drop library in a real app
  const handleDragStart = (e: React.DragEvent, matchId: string) => {
    e.dataTransfer.setData("matchId", matchId)
  }

  const handleDrop = async (e: React.DragEvent, targetMatchDayId: string, targetIndex: number) => {
    e.preventDefault()
    const matchId = e.dataTransfer.getData("matchId")

    try {
      // Simulate API call to update match date and time
      await simulateFetch(null, 1000)

      // Update the match's match day
      const updatedMatches = matches.map((match) => {
        if (match.id === matchId) {
          const targetMatchDay = matchDays.find((day) => day.id === targetMatchDayId)
          if (targetMatchDay) {
            return {
              ...match,
              date: targetMatchDay.date,
              matchDayId: targetMatchDayId,
            }
          }
        }
        return match
      })

      setMatches(updatedMatches)
      alert(`Match ${matchId} moved to ${targetMatchDayId} at position ${targetIndex}`)
    } catch (error) {
      console.error("Failed to move match:", error)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const getMatchDayName = (matchDayId: string): string => {
    const matchDay = matchDays.find((day) => day.id === matchDayId)
    return matchDay ? matchDay.name : "Unknown Match Day"
  }

  const getMatchDayDate = (matchDayId: string): Date | null => {
    const matchDay = matchDays.find((day) => day.id === matchDayId)
    return matchDay ? matchDay.date : null
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 bg-white rounded-xl p-5 shadow-md border border-neutral-200 animate-pulse">
          <div className="h-8 w-48 bg-neutral-200 rounded mb-4"></div>
          <div className="flex justify-between">
            <div className="h-10 w-64 bg-neutral-200 rounded"></div>
            <div className="flex space-x-2">
              <div className="h-10 w-36 bg-neutral-200 rounded"></div>
              <div className="h-10 w-24 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
              <div className="bg-neutral-200 h-12 w-full"></div>
              <div className="p-4 space-y-4">
                <SkeletonLoader variant="rectangular" className="h-20" />
                <SkeletonLoader variant="rectangular" className="h-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar title="Schedule" totalItems={matches.length} onSearch={setSearchQuery}>
        <button
          onClick={handleExportSchedule}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
          disabled={isLoading}
        >
          <FileDown className="h-5 w-5" />
          <span>{isLoading ? "Exporting..." : "Export Schedule"}</span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="h-5 w-5" />
          <span>Filter</span>
        </button>
      </ActionToolbar>

      {/* Match Day Filter */}
      <div className="mb-6 bg-white rounded-lg shadow p-4 border border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary-500" />
          Filter by Match Day
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedMatchDay(null)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selectedMatchDay === null
                ? "bg-primary-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            All Match Days
          </button>
          {matchDays.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedMatchDay(day.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedMatchDay === day.id
                  ? "bg-primary-600 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
              }).format(day.date)}{" "}
              - {day.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {Object.keys(groupedMatches).length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-neutral-500">No matches found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          Object.keys(groupedMatches).map((matchDayId) => {
            const matchDayDate = getMatchDayDate(matchDayId)
            return (
              <div
                key={matchDayId}
                className={`bg-white rounded-lg shadow overflow-hidden transition-opacity duration-300 ${isLoading ? "opacity-60" : "opacity-100"}`}
                onDragOver={handleDragOver}
              >
                <div className="bg-emerald-500 text-white px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <h3 className="text-lg font-semibold">
                      {matchDayDate ? formatDate(matchDayDate) : "Unknown Date"}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">{getMatchDayName(matchDayId)}</span>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {groupedMatches[matchDayId].map((match, matchIndex) => (
                    <div
                      key={match.id}
                      className="p-4 hover:bg-gray-50 cursor-move transition-all duration-200"
                      draggable
                      onDragStart={(e) => handleDragStart(e, match.id)}
                      onDrop={(e) => handleDrop(e, matchDayId, matchIndex)}
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                            Group {match.group}
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
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
