"use client"

import { useState } from "react"
import type { Standing, Team, TournamentFormat } from "../types/tournament"
import ActionToolbar from "../components/ui-elements/ActionToolbar"
import { Trophy, Medal, FileDown } from "lucide-react"

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

// Generate sample standings
const generateSampleStandings = (): Standing[] => {
  return sampleTeams
    .map((team, index) => {
      const matchesPlayed = 3
      const wins = Math.floor(Math.random() * (matchesPlayed + 1))
      const draws = Math.floor(Math.random() * (matchesPlayed - wins + 1))
      const losses = matchesPlayed - wins - draws
      const goalsFor = wins * 2 + draws
      const goalsAgainst = losses * 2 + draws

      return {
        position: index + 1,
        team,
        matchesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference: goalsFor - goalsAgainst,
        points: wins * 3 + draws,
        form: Array(5)
          .fill(null)
          .map((_, i) => {
            if (i >= matchesPlayed) return undefined
            const rand = Math.random()
            if (rand < 0.6) return "W"
            if (rand < 0.8) return "D"
            return "L"
          })
          .filter(Boolean) as ("W" | "D" | "L")[],
      }
    })
    .sort((a, b) => {
      // Sort by points, then goal difference, then goals for
      if (a.points !== b.points) return b.points - a.points
      if (a.goalDifference !== b.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })
}

// Group standings by group
const groupStandingsByGroup = (standings: Standing[]): Record<string, Standing[]> => {
  const grouped: Record<string, Standing[]> = {}

  standings.forEach((standing) => {
    const group = standing.team.group || "Ungrouped"
    if (!grouped[group]) {
      grouped[group] = []
    }
    grouped[group].push(standing)
  })

  // Sort each group by position
  Object.keys(grouped).forEach((group) => {
    grouped[group].sort((a, b) => a.position - b.position)
  })

  return grouped
}

const sampleStandings = generateSampleStandings()
const groupedStandings = groupStandingsByGroup(sampleStandings)

export default function Leaderboard() {
  const [format, setFormat] = useState<TournamentFormat>("Group Stage")
  const [selectedGroup, setSelectedGroup] = useState<string>("A")
  const [standings, setStandings] = useState<Standing[]>(sampleStandings)

  const handleExportLeaderboard = () => {
    // In a real app, this would generate and download a PDF or Excel file
    alert("Export leaderboard functionality would be implemented here")
  }

  const handleFormatChange = (newFormat: TournamentFormat) => {
    setFormat(newFormat)
  }

  const filteredStandings =
    format === "Group Stage" ? standings.filter((s) => s.team.group === selectedGroup) : standings

  // Get top 3 teams for podium display
  const topTeams = [...standings].sort((a, b) => a.position - b.position).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      <ActionToolbar title="Leaderboard" totalItems={standings.length} showSearch={false}>
        <button
          onClick={handleExportLeaderboard}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
        >
          <FileDown className="h-5 w-5" />
          <span>Export Leaderboard</span>
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => handleFormatChange("Group Stage")}
            className={`px-4 py-2 rounded-md ${
              format === "Group Stage"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Group Stage
          </button>
          <button
            onClick={() => handleFormatChange("Round Robin")}
            className={`px-4 py-2 rounded-md ${
              format === "Round Robin"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Round Robin
          </button>
          <button
            onClick={() => handleFormatChange("Single Elimination")}
            className={`px-4 py-2 rounded-md ${
              format === "Single Elimination"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Knockout
          </button>
        </div>
      </ActionToolbar>

      {/* Podium display for top 3 teams */}
      {(format === "Group Stage" || format === "Round Robin") && (
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-center items-end space-y-4 md:space-y-0 md:space-x-8 bg-white rounded-lg shadow p-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <Medal className="h-8 w-8 text-gray-400" />
              </div>
              <div className="h-24 w-24 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold">2</span>
              </div>
              <div className="bg-gray-100 p-3 rounded-b-lg text-center w-full">
                <div className="font-bold">{topTeams[1]?.team.name || "-"}</div>
                <div className="text-sm text-gray-500">{topTeams[1]?.points || 0} pts</div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
              <div className="h-32 w-32 bg-yellow-200 rounded-t-lg flex items-center justify-center">
                <span className="text-3xl font-bold">1</span>
              </div>
              <div className="bg-yellow-100 p-4 rounded-b-lg text-center w-full">
                <div className="font-bold text-lg">{topTeams[0]?.team.name || "-"}</div>
                <div className="text-sm text-gray-500">{topTeams[0]?.points || 0} pts</div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <Medal className="h-8 w-8 text-orange-500" />
              </div>
              <div className="h-20 w-20 bg-orange-200 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold">3</span>
              </div>
              <div className="bg-orange-100 p-2 rounded-b-lg text-center w-full">
                <div className="font-bold">{topTeams[2]?.team.name || "-"}</div>
                <div className="text-sm text-gray-500">{topTeams[2]?.points || 0} pts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {format === "Group Stage" && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(groupedStandings)
            .sort()
            .map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-md ${
                  selectedGroup === group
                    ? "bg-emerald-500 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Group {group}
              </button>
            ))}
        </div>
      )}

      {(format === "Group Stage" || format === "Round Robin") && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    POS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    TEAM
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    MP
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    W
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    D
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    L
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    GF
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    GA
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    GD
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PTS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    FORM
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStandings.map((standing) => (
                  <tr key={standing.team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {standing.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{standing.team.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {standing.matchesPlayed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.wins}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.draws}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{standing.losses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {standing.goalsFor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {standing.goalsAgainst}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {standing.goalDifference > 0 ? `+${standing.goalDifference}` : standing.goalDifference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                      {standing.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {standing.form?.map((result, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              result === "W"
                                ? "bg-green-100 text-green-800"
                                : result === "D"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {format === "Single Elimination" && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Tournament Final Standings</h3>
            <p className="text-gray-500">Single Elimination Tournament Results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Winner */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-16 w-16 text-yellow-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Winner</h4>
              <p className="text-lg font-medium text-gray-700">{topTeams[0]?.team.name || "TBD"}</p>
            </div>

            {/* Runner-up */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <Medal className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Runner-up</h4>
              <p className="text-lg font-medium text-gray-700">{topTeams[1]?.team.name || "TBD"}</p>
            </div>

            {/* Third Place */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <Medal className="h-12 w-12 text-orange-500" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Third Place</h4>
              <p className="text-lg font-medium text-gray-700">{topTeams[2]?.team.name || "TBD"}</p>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Semi-finalists</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {sampleTeams.slice(0, 4).map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Quarter-finalists</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {sampleTeams.slice(4, 8).map((team) => (
                <li key={team.id}>{team.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
