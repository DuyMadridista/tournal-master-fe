"use client"

import { useState } from "react"
import { Clock, MapPin, Award, Shirt, ArrowRightLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface Player {
  id: string
  name: string
  number: number
  position: string
}

interface MatchEvent {
  id: string
  type: "goal" | "yellow-card" | "red-card" | "substitution"
  minute: number
  playerId: string
  playerName: string
  playerNumber: number
  teamId: string
  teamName: string
  additionalInfo?: {
    substituteId?: string
    substituteName?: string
    substituteNumber?: number
  }
}

interface LineupPlayer extends Player {
  isCaptain?: boolean
  events?: MatchEvent[]
}

interface Lineup {
  startingXI: LineupPlayer[]
  substitutes: LineupPlayer[]
}

interface MatchDetailTabsProps {
  match: {
    id: string
    date: Date
    time: string
    venue: string
    team1: {
      id: string
      name: string
      score?: number
    }
    team2: {
      id: string
      name: string
      score?: number
    }
    events: MatchEvent[]
    lineups: {
      team1: Lineup
      team2: Lineup
    }
    completed: boolean
  }
}

export default function MatchDetailTabs({ match }: MatchDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<"general" | "details">("general")

  // Group events by team
  const team1Events = match.events.filter((event) => event.teamId === match.team1.id)
  const team2Events = match.events.filter((event) => event.teamId === match.team2.id)

  // Count events by type
  const countEventsByType = (events: MatchEvent[], type: MatchEvent["type"]) => {
    return events.filter((event) => event.type === type).length
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      {/* Match header */}
      <div className="bg-primary-500 text-white p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center space-x-2 text-primary-100">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(match.date).toLocaleDateString()} - {match.time}
            </span>
            {match.venue && (
              <>
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4" />
                <span>{match.venue}</span>
              </>
            )}
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-700 text-white">
              {match.completed ? "Completed" : "Upcoming"}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0">
          <div className="flex-1 text-center md:text-right">
            <h3 className="text-xl font-bold">{match.team1.name}</h3>
          </div>

          <div className="mx-8 text-center">
            <div className="text-3xl font-bold">
              {match.completed ? (
                <>
                  {match.team1.score} - {match.team2.score}
                </>
              ) : (
                "vs"
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold">{match.team2.name}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab("general")}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "general"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300",
            )}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={cn(
              "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === "details"
                ? "border-primary-500 text-primary-600"
                : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300",
            )}
          >
            Details
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="p-4">
        {activeTab === "general" && (
          <div className="space-y-6">
            {/* Match summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Goals</h4>
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{countEventsByType(team1Events, "goal")}</div>
                    <div className="text-sm text-neutral-500">{match.team1.name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{countEventsByType(team2Events, "goal")}</div>
                    <div className="text-sm text-neutral-500">{match.team2.name}</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Yellow Cards</h4>
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {countEventsByType(team1Events, "yellow-card")}
                    </div>
                    <div className="text-sm text-neutral-500">{match.team1.name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {countEventsByType(team2Events, "yellow-card")}
                    </div>
                    <div className="text-sm text-neutral-500">{match.team2.name}</div>
                  </div>
                </div>
              </div>

              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                <h4 className="text-sm font-medium text-neutral-500 mb-2">Red Cards</h4>
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{countEventsByType(team1Events, "red-card")}</div>
                    <div className="text-sm text-neutral-500">{match.team1.name}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{countEventsByType(team2Events, "red-card")}</div>
                    <div className="text-sm text-neutral-500">{match.team2.name}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Match events timeline */}
            <div>
              <h4 className="text-lg font-medium text-neutral-800 mb-3">Match Events</h4>

              {match.events.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">No events recorded for this match</div>
              ) : (
                <div className="space-y-2">
                  {match.events
                    .sort((a, b) => a.minute - b.minute)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center p-3 bg-white rounded-lg border border-neutral-200 hover:bg-neutral-50"
                      >
                        <div className="w-12 text-center font-mono text-sm text-neutral-500">{event.minute}'</div>

                        <div className="w-10 flex justify-center">
                          {event.type === "goal" && <Award className="h-5 w-5 text-primary-500" />}
                          {event.type === "yellow-card" && <div className="h-5 w-4 bg-yellow-400 rounded-sm" />}
                          {event.type === "red-card" && <div className="h-5 w-4 bg-red-600 rounded-sm" />}
                          {event.type === "substitution" && <ArrowRightLeft className="h-5 w-5 text-green-500" />}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-neutral-800">{event.playerName}</span>
                            <span className="ml-2 text-sm text-neutral-500">({event.playerNumber})</span>
                          </div>

                          {event.type === "goal" && (
                            <div className="text-sm text-neutral-500">Goal for {event.teamName}</div>
                          )}

                          {event.type === "yellow-card" && <div className="text-sm text-neutral-500">Yellow card</div>}

                          {event.type === "red-card" && <div className="text-sm text-neutral-500">Red card</div>}

                          {event.type === "substitution" && event.additionalInfo && (
                            <div className="text-sm text-neutral-500">
                              Substituted for {event.additionalInfo.substituteName} (
                              {event.additionalInfo.substituteNumber})
                            </div>
                          )}
                        </div>

                        <div className="w-24 text-right text-sm font-medium">{event.teamName}</div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="space-y-6">
            {/* Team lineups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team 1 Lineup */}
              <div>
                <h4 className="text-lg font-medium text-neutral-800 mb-3">{match.team1.name} Lineup</h4>

                <div className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="bg-primary-100 text-primary-800 px-4 py-2 font-medium">Starting XI</div>

                  <div className="divide-y divide-neutral-200">
                    {match.lineups.team1.startingXI.map((player) => (
                      <div key={player.id} className="p-3 flex items-center hover:bg-white">
                        <div className="w-8 text-center font-medium text-neutral-500">{player.number}</div>

                        <div className="flex-1 flex items-center">
                          <Shirt className="h-5 w-5 text-primary-500 mr-2" />
                          <span className="font-medium">{player.name}</span>
                          {player.isCaptain && (
                            <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-1.5 py-0.5 rounded">
                              (C)
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-neutral-500">{player.position}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-neutral-100 text-neutral-800 px-4 py-2 font-medium">Substitutes</div>

                  <div className="divide-y divide-neutral-200">
                    {match.lineups.team1.substitutes.map((player) => (
                      <div key={player.id} className="p-3 flex items-center hover:bg-white">
                        <div className="w-8 text-center font-medium text-neutral-500">{player.number}</div>

                        <div className="flex-1">
                          <span className="font-medium">{player.name}</span>
                        </div>

                        <div className="text-sm text-neutral-500">{player.position}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Team 2 Lineup */}
              <div>
                <h4 className="text-lg font-medium text-neutral-800 mb-3">{match.team2.name} Lineup</h4>

                <div className="bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
                  <div className="bg-secondary-100 text-secondary-800 px-4 py-2 font-medium">Starting XI</div>

                  <div className="divide-y divide-neutral-200">
                    {match.lineups.team2.startingXI.map((player) => (
                      <div key={player.id} className="p-3 flex items-center hover:bg-white">
                        <div className="w-8 text-center font-medium text-neutral-500">{player.number}</div>

                        <div className="flex-1 flex items-center">
                          <Shirt className="h-5 w-5 text-secondary-500 mr-2" />
                          <span className="font-medium">{player.name}</span>
                          {player.isCaptain && (
                            <span className="ml-2 text-xs bg-secondary-100 text-secondary-800 px-1.5 py-0.5 rounded">
                              (C)
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-neutral-500">{player.position}</div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-neutral-100 text-neutral-800 px-4 py-2 font-medium">Substitutes</div>

                  <div className="divide-y divide-neutral-200">
                    {match.lineups.team2.substitutes.map((player) => (
                      <div key={player.id} className="p-3 flex items-center hover:bg-white">
                        <div className="w-8 text-center font-medium text-neutral-500">{player.number}</div>

                        <div className="flex-1">
                          <span className="font-medium">{player.name}</span>
                        </div>

                        <div className="text-sm text-neutral-500">{player.position}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
