"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Users, Calendar, ListChecks, BarChart3, ArrowRight, Edit, Clock, MapPin, Layers, LayoutGrid, Trophy } from "lucide-react"
import Link from "next/link"
import { useDataFetching } from "../../../context/DataFetchingContext"
import LoadingSpinner from "../../../components/ui-elements/LoadingSpinner"
import { Button } from "../../../components/ui/button"

interface EventDate {
  id: string
  date: string
  tournamentId: string
}

interface Category {
  id: string
  categoryName: string
}

interface Organizer {
  id: string
  fullName: string
  email: string
}

interface MatchOfEventDate {
  id: number
  numMatch: number
  round: number
  _startTime: string
  _endTime: string
  status: string
  teamOne?: {
    id: number
    name: string
  }
  teamTwo?: {
    id: number
    name: string
  }
  eventDate: EventDate
}

interface TournamentPlan {
  matchDuration: number
  timeBetween: number
  startTimeDefault: string
  endTimeDefault: string
}

interface Progress {
  totalTeam: number
  progress: number
  totalMatch: number
  upcomingMatch: number
  finishedMatch: number
}

interface UpcomingMatch {
  id: number
  teamOneResult: number
  teamTwoResult: number
  _startTime: string
  _endTime: string
  matchDuration: number
  title: string | null
  type: string
  createdAt: string
  updatedAt: string
  round: number
  seedIndex: number
  eventDate: EventDate
  teamOne?: {
    teamId: number
    teamName: string
  }
  teamTwo?: {
    teamId: number
    teamName: string
  }
}

interface TournamentDetail {
  id: number
  title: string
  description: string
  category: Category
  status: string
  organizers: Organizer[]
  eventDates: EventDate[]
  format: string
  numberOfPlayers: number
  numberOfGroups: number
  teamsPerGroup: number
  advancePerGroup: number
  place: string
}

interface TournamentResponse {
  data: TournamentDetail
  success: boolean
  total: number
  additionalData: {
    matchOfEventDates: MatchOfEventDate[]
    tournamentPlan: TournamentPlan
    progress: Progress
    upcomingMatch: UpcomingMatch[]
  }
}

export default function TournamentOverview() {
  const params = useParams()
  const tournamentId = params?.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [tournament, setTournament] = useState<TournamentDetail | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([])

  useEffect(() => {
    const loadTournament = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`http://localhost:6969/api/tournament/overview/${tournamentId}`)
        const data = await response.json()
        
        // Set tournament details
        if (data.data) {
          setTournament(data.data)
        }
        
        // Set progress data
        if (data.additionalData && data.additionalData.progress) {
          setProgress(data.additionalData.progress)
        }
        
        // Set upcoming matches
        if (data.additionalData && data.additionalData.upcomingMatch) {
          setUpcomingMatches(data.additionalData.upcomingMatch)
        }
      } catch (error) {
        console.error("Failed to load tournament details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTournament()
  }, [tournamentId])

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Get start and end dates from event dates array
  const getStartDate = (eventDates: EventDate[]): string => {
    if (!eventDates || eventDates.length === 0) return ""
    const dates = [...eventDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return dates[0].date
  }

  const getEndDate = (eventDates: EventDate[]): string => {
    if (!eventDates || eventDates.length === 0) return ""
    const dates = [...eventDates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return dates[0].date
  }

  const formatMatchTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(":")
    return `${hours}:${minutes}`
  }

  const getFormatDisplay = (format: string): string => {
    switch (format) {
      case "GROUP_STAGE":
        return "Group Stage"
      case "KNOCKOUT":
        return "Knockout"
      case "ROUND_ROBIN":
        return "Round Robin"
      default:
        return format
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!tournament || !progress) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <p className="text-center text-neutral-600">Tournament data not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{tournament.title}</h1>
            <div className="flex items-center mt-2 text-sm text-neutral-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>
                {formatDate(getStartDate(tournament.eventDates))} - {formatDate(getEndDate(tournament.eventDates))}
              </span>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">

            <Link href={`/tournaments/${tournamentId}/leaderboard`} className="flex items-center bg-primary-500 text-white px-4 py-2 rounded-md">
              <Trophy className="w-4 h-4 mr-1" />
              Leaderboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-full">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-neutral-500">Location</div>
              <div className="text-neutral-800">{tournament.place}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-full">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-neutral-500">Category</div>
              <div className="text-neutral-800">{tournament.category.categoryName}</div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-amber-100 p-2 rounded-full">
              <LayoutGrid className="w-5 h-5 text-amber-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-neutral-500">Format</div>
              <div className="text-neutral-800">{getFormatDisplay(tournament.format)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Tournament Overview</h2>
      </div>

      {/* Tournament Progress */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-neutral-800 mb-3">Tournament Progress</h3>
        <div className="w-full bg-neutral-200 rounded-full h-3 mb-2">
          <div className="bg-primary-500 h-3 rounded-full" style={{ width: `${progress.progress}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Start: {formatDate(getStartDate(tournament.eventDates))}</span>
          <span>{progress.progress}% completed</span>
          <span>End: {formatDate(getEndDate(tournament.eventDates))}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Participating Teams</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{progress.totalTeam}</p>
          <Link
            href={`/tournaments/${tournamentId}/participants`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>View details</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-secondary-100 text-secondary-600 mr-3">
              <Calendar className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Total Matches</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{progress.totalMatch}</p>
          <Link
            href={`/tournaments/${tournamentId}/schedule`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>View schedule</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-success-100 text-success-600 mr-3">
              <ListChecks className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Completed</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{progress.finishedMatch}</p>
          <Link
            href={`/tournaments/${tournamentId}/results`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>View results</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-accent-100 text-accent-600 mr-3">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h4 className="text-lg font-medium text-neutral-800">Upcoming</h4>
          </div>
          <p className="text-3xl font-bold text-neutral-800">{progress.upcomingMatch}</p>
          <Link
            href={`/tournaments/${tournamentId}/schedule`}
            className="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <span>View upcoming schedule</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Tournament Information and Upcoming Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tournament Information */}
        <div>
          <h3 className="text-lg font-medium text-neutral-800 mb-3">Tournament Information</h3>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Format</p>
                <p className="font-medium">{getFormatDisplay(tournament.format)}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Location</p>
                <p className="font-medium">{tournament.place}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Description</p>
                <p className="font-medium">{tournament.description}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Organizers</p>
                <ul className="space-y-2">
                  {tournament.organizers.map((organizer, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="font-medium">{organizer.fullName}</span>
                      <span className="text-neutral-500">{organizer.email}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/tournaments/${tournamentId}/details`}
                className="btn btn-outline flex items-center justify-center space-x-2 w-full"
              >
                <span>View full details</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Matches */}
        <div>
          <h3 className="text-lg font-medium text-neutral-800 mb-3">Upcoming Matches</h3>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
            <div className="space-y-4">
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <div key={match.id} className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                    <div className="flex items-center text-sm text-neutral-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="mr-3">
                        {formatDate(match.eventDate.date)}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="mr-3">{formatMatchTime(match._startTime)}</span>
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Round {match.round}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="flex-1 text-right">
                        <span className="font-medium">{match.teamOne?.teamName || 'TBD'}</span>
                      </div>
                      <div className="mx-4 text-center">
                        <span className="text-lg font-bold text-neutral-400">VS</span>
                      </div>
                      <div className="flex-1">
                        <span className="font-medium">{match.teamTwo?.teamName || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-neutral-500">
                  No upcoming matches scheduled
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <Link
                href={`/tournaments/${tournamentId}/schedule`}
                className="btn btn-outline flex items-center justify-center space-x-2 w-full"
              >
                <span>View full schedule</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Liên kết nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href={`/tournaments/${tournamentId}/participants`}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <div className="p-2 rounded-full bg-primary-100 text-primary-600 mr-3">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">Participants</h4>
            <p className="text-sm text-neutral-500">Manage tournament participants</p>
          </div>
          <ArrowRight className="h-4 w-4 ml-auto text-primary-500" />
        </Link>

        <Link
          href={`/tournaments/${tournamentId}/schedule`}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <div className="p-2 rounded-full bg-secondary-100 text-secondary-600 mr-3">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">Schedule</h4>
            <p className="text-sm text-neutral-500">View and manage tournament schedule</p>
          </div>
          <ArrowRight className="h-4 w-4 ml-auto text-primary-500" />
        </Link>

        <Link
          href={`/tournaments/${tournamentId}/leaderboard`}
          className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 hover:border-primary-200 hover:shadow-md transition-all duration-200 flex items-center"
        >
          <div className="p-2 rounded-full bg-accent-100 text-accent-600 mr-3">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-medium text-neutral-800">Leaderboard</h4>
            <p className="text-sm text-neutral-500">View current leaderboard</p>
          </div>
          <ArrowRight className="h-4 w-4 ml-auto text-primary-500" />
        </Link>
      </div>
    </div>
  )
}
