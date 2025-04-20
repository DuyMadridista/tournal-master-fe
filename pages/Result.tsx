"use client"

import { useState, useEffect } from "react"
import type { Match, Team, TournamentFormat } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { FileDown, Calendar, Clock, MapPin, Trophy, Eye } from "lucide-react"
import MatchDetailTabs from "../components/match-details/MatchDetailTabs"
import { useDataFetching } from "../context/DataFetchingContext"
import LoadingSpinner from "../components/ui-elements/LoadingSpinner"

// Sample data for demonstration
const sampleTeams: Team[] = [
  {
    id: "team-1",
    name: "FC Barcelona",
    tier: "A",
    group: "A",
    leaderName: "Carlos Rodriguez",
    leaderEmail: "carlos@example.com",
    phoneNumber: "+1234567890",
    playerCount: 18,
  },
  {
    id: "team-2",
    name: "Real Madrid",
    tier: "A",
    group: "B",
    leaderName: "Miguel Fernandez",
    leaderEmail: "miguel@example.com",
    phoneNumber: "+0987654321",
    playerCount: 20,
  },
  {
    id: "team-3",
    name: "Manchester United",
    tier: "A",
    group: "C",
    leaderName: "James Wilson",
    leaderEmail: "james@example.com",
    phoneNumber: "+1122334455",
    playerCount: 22,
  },
  {
    id: "team-4",
    name: "Bayern Munich",
    tier: "A",
    group: "D",
    leaderName: "Hans Mueller",
    leaderEmail: "hans@example.com",
    phoneNumber: "+6677889900",
    playerCount: 19,
  },
  {
    id: "team-5",
    name: "Liverpool",
    tier: "A",
    group: "A",
    leaderName: "Steven Gerrard",
    leaderEmail: "steven@example.com",
    phoneNumber: "+1231231234",
    playerCount: 21,
  },
  {
    id: "team-6",
    name: "PSG",
    tier: "A",
    group: "B",
    leaderName: "Pierre Dubois",
    leaderEmail: "pierre@example.com",
    phoneNumber: "+3334445555",
    playerCount: 20,
  },
  {
    id: "team-7",
    name: "Juventus",
    tier: "A",
    group: "C",
    leaderName: "Marco Rossi",
    leaderEmail: "marco@example.com",
    phoneNumber: "+6667778888",
    playerCount: 19,
  },
  {
    id: "team-8",
    name: "AC Milan",
    tier: "A",
    group: "D",
    leaderName: "Paolo Maldini",
    leaderEmail: "paolo@example.com",
    phoneNumber: "+9990001111",
    playerCount: 18,
  },
]

// Generate sample matches with results
const generateSampleMatches = (): Match[] => {
  const matches: Match[] = []
  const today = new Date()

  // Group stage matches
  for (let i = 0; i < 12; i++) {
    const matchDate = new Date(today)
    matchDate.setDate(today.getDate() - 7 + Math.floor(i / 4))

    const team1Index = i % sampleTeams.length
    const team2Index = (i + 1) % sampleTeams.length

    const completed = i < 8

    matches.push({
      id: `match-${i + 1}`,
      date: matchDate,
      time: `${14 + (i % 3) * 2}:00`,
      team1: sampleTeams[team1Index],
      team2: sampleTeams[team2Index],
      venue: `Field ${(i % 3) + 1}`,
      round: `Group Stage - Round ${Math.floor(i / 4) + 1}`,
      group: sampleTeams[team1Index].group,
      completed,
      score1: completed ? Math.floor(Math.random() * 5) : undefined,
      score2: completed ? Math.floor(Math.random() * 5) : undefined,
      events: completed ? generateMatchEvents(sampleTeams[team1Index], sampleTeams[team2Index]) : [],
      lineups: {
        team1: generateTeamLineup(sampleTeams[team1Index]),
        team2: generateTeamLineup(sampleTeams[team2Index]),
      },
    })
  }

  return matches
}

// Generate sample match events
const generateMatchEvents = (team1: Team, team2: Team) => {
  const events = []
  const totalEvents = Math.floor(Math.random() * 10) + 5

  for (let i = 0; i < totalEvents; i++) {
    const eventType = ["goal", "yellow-card", "red-card", "substitution"][Math.floor(Math.random() * 4)]
    const team = Math.random() > 0.5 ? team1 : team2
    const minute = Math.floor(Math.random() * 90) + 1

    events.push({
      id: `event-${i}`,
      type: eventType,
      minute,
      playerId: `player-${Math.floor(Math.random() * 11) + 1}`,
      playerName: `Player ${Math.floor(Math.random() * 11) + 1}`,
      playerNumber: Math.floor(Math.random() * 30) + 1,
      teamId: team.id,
      teamName: team.name,
      additionalInfo:
        eventType === "substitution"
          ? {
              substituteId: `player-${Math.floor(Math.random() * 7) + 12}`,
              substituteName: `Player ${Math.floor(Math.random() * 7) + 12}`,
              substituteNumber: Math.floor(Math.random() * 30) + 1,
            }
          : undefined,
    })
  }

  return events.sort((a, b) => a.minute - b.minute)
}

// Generate sample team lineup
const generateTeamLineup = (team: Team) => {
  const startingXI = []
  const substitutes = []

  // Generate starting XI
  for (let i = 1; i <= 11; i++) {
    let position = "Forward"
    if (i === 1) position = "Goalkeeper"
    else if (i <= 5) position = "Defender"
    else if (i <= 9) position = "Midfielder"

    startingXI.push({
      id: `player-${team.id}-${i}`,
      name: `Player ${i}`,
      number: i,
      position,
      isCaptain: i === 4,
    })
  }

  // Generate substitutes
  for (let i = 12; i <= 18; i++) {
    let position = "Forward"
    if (i === 12) position = "Goalkeeper"
    else if (i <= 14) position = "Defender"
    else if (i <= 16) position = "Midfielder"

    substitutes.push({
      id: `player-${team.id}-${i}`,
      name: `Player ${i}`,
      number: i,
      position,
    })
  }

  return {
    startingXI,
    substitutes,
  }
}

// Generate knockout matches for single elimination format
const generateKnockoutMatches = (): Match[] => {
  const matches: Match[] = []
  const today = new Date()

  // Quarter-finals
  for (let i = 0; i < 4; i++) {
    const matchDate = new Date(today)
    matchDate.setDate(today.getDate() - 7)

    matches.push({
      id: `qf-${i + 1}`,
      date: matchDate,
      time: `${14 + i * 2}:00`,
      team1: sampleTeams[i * 2],
      team2: sampleTeams[i * 2 + 1],
      venue: `Field ${(i % 3) + 1}`,
      round: "Quarter-final",
      completed: true,
      score1: Math.floor(Math.random() * 5),
      score2: Math.floor(Math.random() * 3),
      events: generateMatchEvents(sampleTeams[i * 2], sampleTeams[i * 2 + 1]),
      lineups: {
        team1: generateTeamLineup(sampleTeams[i * 2]),
        team2: generateTeamLineup(sampleTeams[i * 2 + 1]),
      },
    })
  }

  // Semi-finals
  const semifinalists = [
    matches[0].score1! > matches[0].score2! ? matches[0].team1 : matches[0].team2,
    matches[1].score1! > matches[1].score2! ? matches[1].team1 : matches[1].team2,
    matches[2].score1! > matches[2].score2! ? matches[2].team1 : matches[2].team2,
    matches[3].score1! > matches[3].score2! ? matches[3].team1 : matches[3].team2,
  ]

  for (let i = 0; i < 2; i++) {
    const matchDate = new Date(today)
    matchDate.setDate(today.getDate() - 3)

    matches.push({
      id: `sf-${i + 1}`,
      date: matchDate,
      time: `${16 + i * 3}:00`,
      team1: semifinalists[i * 2],
      team2: semifinalists[i * 2 + 1],
      venue: `Field 1`,
      round: "Semi-final",
      completed: true,
      score1: Math.floor(Math.random() * 4) + 1,
      score2: Math.floor(Math.random() * 3),
      events: generateMatchEvents(semifinalists[i * 2], semifinalists[i * 2 + 1]),
      lineups: {
        team1: generateTeamLineup(semifinalists[i * 2]),
        team2: generateTeamLineup(semifinalists[i * 2 + 1]),
      },
    })
  }

  // Final
  const finalists = [
    matches[4].score1! > matches[4].score2! ? matches[4].team1 : matches[4].team2,
    matches[5].score1! > matches[5].score2! ? matches[5].team1 : matches[5].team2,
  ]

  matches.push({
    id: `final`,
    date: today,
    time: `18:00`,
    team1: finalists[0],
    team2: finalists[1],
    venue: `Main Stadium`,
    round: "Final",
    completed: false,
    score1: undefined,
    score2: undefined,
    events: [],
    lineups: {
      team1: generateTeamLineup(finalists[0]),
      team2: generateTeamLineup(finalists[1]),
    },
  })

  return matches
}

const sampleGroupMatches = generateSampleMatches()
const sampleKnockoutMatches = generateKnockoutMatches()

// Group matches by date
const groupMatchesByDate = (matches: Match[]): Record<string, Match[]> => {
  const grouped: Record<string, Match[]> = {}

  matches.forEach((match) => {
    const dateStr = match.date.toISOString().split("T")[0]
    if (!grouped[dateStr]) {
      grouped[dateStr] = []
    }
    grouped[dateStr].push(match)
  })

  return grouped
}

interface ResultProps {
  tournamentId?: string
}

export default function Result({ tournamentId }: ResultProps) {
  const [format, setFormat] = useState<TournamentFormat>("Group Stage")
  const [groupMatches, setGroupMatches] = useState<Match[]>([])
  const [knockoutMatches, setKnockoutMatches] = useState<Match[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { simulateFetch } = useDataFetching()

  // Load match data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API calls
        const groupData = await simulateFetch(sampleGroupMatches, 1500)
        const knockoutData = await simulateFetch(sampleKnockoutMatches, 500)

        setGroupMatches(groupData)
        setKnockoutMatches(knockoutData)
      } catch (error) {
        console.error("Failed to load match data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [simulateFetch])

  const matches = format === "Single Elimination" ? knockoutMatches : groupMatches

  const filteredMatches = matches.filter(
    (match) =>
      match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (match.venue && match.venue.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (match.round && match.round.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const groupedMatches = groupMatchesByDate(filteredMatches)

  const handleExportResults = () => {
    // In a real app, this would generate and download a PDF or Excel file
    alert("Export results functionality would be implemented here")
  }

  const handleFormatChange = (newFormat: TournamentFormat) => {
    setFormat(newFormat)
  }

  const handleScoreChange = (matchId: string, team: "team1" | "team2", score: number) => {
    if (format === "Single Elimination") {
      setKnockoutMatches(
        knockoutMatches.map((match) => {
          if (match.id === matchId) {
            return {
              ...match,
              [team === "team1" ? "score1" : "score2"]: score,
            }
          }
          return match
        }),
      )
    } else {
      setGroupMatches(
        groupMatches.map((match) => {
          if (match.id === matchId) {
            return {
              ...match,
              [team === "team1" ? "score1" : "score2"]: score,
            }
          }
          return match
        }),
      )
    }
  }

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleViewMatchDetails = (match: Match) => {
    setSelectedMatch(match)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar title="Results" totalItems={matches.length} onSearch={setSearchQuery}>
        <button
          onClick={handleExportResults}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
        >
          <FileDown className="h-5 w-5" />
          <span>Export Results</span>
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => handleFormatChange("Group Stage")}
            className={`px-4 py-2 rounded-md ${
              format === "Group Stage"
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Group Stage
          </button>
          <button
            onClick={() => handleFormatChange("Round Robin")}
            className={`px-4 py-2 rounded-md ${
              format === "Round Robin"
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Round Robin
          </button>
          <button
            onClick={() => handleFormatChange("Single Elimination")}
            className={`px-4 py-2 rounded-md ${
              format === "Single Elimination"
                ? "bg-primary-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Knockout
          </button>
        </div>
      </ActionToolbar>

      {/* Match Details View */}
      {selectedMatch && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-neutral-800">Match Details</h2>
            <button onClick={() => setSelectedMatch(null)} className="btn btn-outline">
              Back to Results
            </button>
          </div>
          <MatchDetailTabs match={selectedMatch} />
        </div>
      )}

      {!selectedMatch && (format === "Group Stage" || format === "Round Robin") && (
        <div className="space-y-8">
          {Object.keys(groupedMatches)
            .sort()
            .map((dateStr) => (
              <div key={dateStr} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="bg-primary-500 text-white px-6 py-3 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">{formatDate(dateStr)}</h3>
                </div>

                <div className="divide-y divide-gray-200">
                  {groupedMatches[dateStr].map((match) => (
                    <div key={match.id} className="p-4 hover:bg-gray-50">
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
                            Group {match.group}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center justify-center">
                        <div className="flex-1 text-right">
                          <span className="text-lg font-medium">{match.team1.name}</span>
                        </div>

                        <div className="mx-4 flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={match.score1 !== undefined ? match.score1 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team1", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-10 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                          <span className="text-xl font-bold text-gray-500">-</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score2 !== undefined ? match.score2 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team2", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-10 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                        </div>

                        <div className="flex-1 flex items-center">
                          <span className="text-lg font-medium">{match.team2.name}</span>
                          {match.completed && (
                            <button
                              onClick={() => handleViewMatchDetails(match)}
                              className="ml-4 btn btn-sm btn-outline flex items-center space-x-1"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Details</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {!selectedMatch && format === "Single Elimination" && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tournament Bracket</h3>

          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Tournament bracket visualization */}
              <div className="flex justify-between">
                {/* Quarter-finals */}
                <div className="flex flex-col space-y-16">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Quarter-finals</span>
                  </div>

                  {knockoutMatches
                    .filter((m) => m.round === "Quarter-final")
                    .map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.time}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1.name}</span>
                          <span className="font-bold">{match.score1}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2.name}</span>
                          <span className="font-bold">{match.score2}</span>
                        </div>

                        <div className="mt-2 text-right">
                          <button
                            onClick={() => handleViewMatchDetails(match)}
                            className="text-primary-600 hover:text-primary-800 text-sm flex items-center justify-end space-x-1 ml-auto"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Semi-finals */}
                <div className="flex flex-col space-y-32 mt-24">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Semi-finals</span>
                  </div>

                  {knockoutMatches
                    .filter((m) => m.round === "Semi-final")
                    .map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.time}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1.name}</span>
                          <span className="font-bold">{match.score1}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2.name}</span>
                          <span className="font-bold">{match.score2}</span>
                        </div>

                        <div className="mt-2 text-right">
                          <button
                            onClick={() => handleViewMatchDetails(match)}
                            className="text-primary-600 hover:text-primary-800 text-sm flex items-center justify-end space-x-1 ml-auto"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Final */}
                <div className="flex flex-col mt-56">
                  <div className="text-center mb-2">
                    <span className="text-sm font-medium text-gray-500">Final</span>
                  </div>

                  {knockoutMatches
                    .filter((m) => m.round === "Final")
                    .map((match) => (
                      <div key={match.id} className="w-64 border border-gray-200 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-2">
                          {match.date.toLocaleDateString()} • {match.time}
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{match.team1.name}</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score1 !== undefined ? match.score1 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team1", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="font-medium">{match.team2.name}</span>
                          <input
                            type="number"
                            min="0"
                            value={match.score2 !== undefined ? match.score2 : ""}
                            onChange={(e) => handleScoreChange(match.id, "team2", Number.parseInt(e.target.value) || 0)}
                            className="w-12 h-8 text-center border border-gray-300 rounded-md"
                            disabled={match.completed}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Winner display (would show once final is completed) */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-primary-50 border border-primary-200 rounded-lg p-6">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-700 mb-1">Tournament Winner</h4>
              <p className="text-gray-500">Complete the final match to determine the winner</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
