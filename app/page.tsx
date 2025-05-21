"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trophy, Users, Calendar, ListChecks, BarChart3, ArrowRight, Plus, Layout, Activity, UserPlus } from "lucide-react"
import Link from "next/link"
import { useDataFetching } from "../context/DataFetchingContext"
import LoadingSpinner from "../components/ui-elements/LoadingSpinner"
import PageHeader from "../components/ui-elements/PageHeader"
import api from '../apis/api'
import { getLocalStorage } from '../utils/localStorage'

// Define tournament type
interface Tournament {
  id: string
  title: string
  category: string
  status: string
  numberOfTeams: number
  numberOfMatches: number
  progress: number
  startDate?: Date
  endDate?: Date
}

// Helper function to get status label
function getStatusLabel(status: string): "Active" | "Completed" | "Upcoming" {
  switch (status) {
    case 'READY':
    case 'IN_PROGRESS':
    case 'NEED_INFORMATION':
      return 'Active'
    case 'FINISHED':
      return 'Completed'
    case 'DISCARDED':
    default:
      return 'Upcoming'
  }
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const { simulateFetch } = useDataFetching()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load dashboard stats
        await simulateFetch(null, 1000)
        
        // Load tournaments
        const token = getLocalStorage('token')
        if (!token) { return }
          
        const res = await api.get('/tournament?page=1', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        // Map API data to Tournament[]
        const apiData = res.data.data as any[]
        const mapped: Tournament[] = apiData.map((item) => {
          const status = item.status
          let startDate = undefined, endDate = undefined
          
          if (Array.isArray(item.eventDates) && item.eventDates.length > 0) {
            const dates = item.eventDates.map((d: any) => new Date(d.date))
            startDate = new Date(Math.min(...dates.map((d: any) => d.getTime())))
            endDate = new Date(Math.max(...dates.map((d: any) => d.getTime())))
          } else {
            startDate = endDate = new Date(item.createdAt)
          }
          
          return {
            id: item.id.toString(),
            title: item.title,
            category: item.category?.categoryName || '',
            status,
            startDate,
            endDate,
            numberOfTeams: item.numberOfTeams || 0,
            numberOfMatches: item.numberOfMatches || 0,
            progress: item.progress || 0,
          }
        })
        
        setTournaments(mapped)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [simulateFetch])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Welcome to Tourna Master" description="Manage your football tournaments easily">
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Active Tournaments"
          value={tournaments.filter(t => ['READY', 'IN_PROGRESS', 'NEED_INFORMATION'].includes(t.status)).length.toString()}
          icon={Trophy}
          color="bg-primary-500"
          change={tournaments.length > 0 ? `${tournaments.length} total` : "No tournaments"}
          positive={tournaments.length > 0}
        />
        <DashboardCard
          title="Total Teams"
          value={tournaments.reduce((sum, t) => sum + t.numberOfTeams, 0).toString()}
          icon={Users}
          color="bg-secondary-500"
          change="Across all tournaments"
          positive={true}
        />
        <DashboardCard
          title="Total Matches"
          value={tournaments.reduce((sum, t) => sum + t.numberOfMatches, 0).toString()}
          icon={Calendar}
          color="bg-accent-500"
          change="Scheduled matches"
        />
        <DashboardCard
          title="Completed Tournaments"
          value={tournaments.filter(t => t.status === 'FINISHED').length.toString()}
          icon={ListChecks}
          color="bg-success-500"
          change={tournaments.filter(t => t.progress === 100).length > 0 ? "100% complete" : "In progress"}
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card border border-neutral-200 p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
            <span className="p-1.5 bg-primary-100 rounded-md text-primary-600 mr-2">
              <Activity className="h-5 w-5" />
            </span>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {tournaments.length === 0 ? (
              <p className="text-neutral-500 text-center py-4">No recent activity</p>
            ) : (
              // Generate activity items based on tournament data
              tournaments.slice(0, 4).map((tournament, index) => {
                // Determine activity type based on tournament status
                let description = "Tournament created"
                let icon = Calendar
                let color = "bg-primary-100 text-primary-600"
                let time = "Recently"
                
                // Calculate relative time
                const now = new Date()
                const createdDate = tournament.startDate || now
                const diffDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
                
                if (diffDays === 0) {
                  time = "Today"
                } else if (diffDays === 1) {
                  time = "Yesterday"
                } else if (diffDays < 7) {
                  time = `${diffDays} days ago`
                } else if (diffDays < 30) {
                  time = `${Math.floor(diffDays / 7)} weeks ago`
                } else {
                  time = `${Math.floor(diffDays / 30)} months ago`
                }
                
                // Determine activity type based on status and progress
                if (tournament.status === 'FINISHED') {
                  description = "Tournament completed"
                  icon = Trophy
                  color = "bg-success-100 text-success-600"
                } else if (tournament.status === 'IN_PROGRESS') {
                  description = "Match results updated"
                  icon = ListChecks
                  color = "bg-accent-100 text-accent-600"
                }
                else if (tournament.numberOfMatches > 0) {
                  description = "Match schedule updated"
                  icon = Calendar
                  color = "bg-primary-100 text-primary-600"
                } else if (tournament.numberOfTeams > 0) {
                  description = `${tournament.numberOfTeams} teams registered`
                  icon = UserPlus
                  color = "bg-secondary-100 text-secondary-600"
                } 
                
                return (
                  <ActivityItem
                    key={tournament.id}
                    title={tournament.title}
                    description={description}
                    time={time}
                    icon={icon}
                    color={color}
                  />
                )
              })
            )}
          </div>
          <div className="mt-4 text-center">
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all activities
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
            <span className="p-1.5 bg-primary-100 rounded-md text-primary-600 mr-2">
              <Trophy className="h-5 w-5" />
            </span>
            Your Tournaments
          </h2>
          <div className="space-y-3">
            {tournaments.length === 0 ? (
              <p className="text-neutral-500 text-center py-4">No tournaments found</p>
            ) : (
              // Display up to 4 tournaments
              tournaments.slice(0, 4).map((tournament) => (
                <TournamentItem
                  key={tournament.id}
                  title={tournament.title}
                  status={getStatusLabel(tournament.status)}
                  progress={tournament.progress || 0}
                  href={`/tournaments/${tournament.id}`}
                />
              ))
            )}
          </div>
          <div className="mt-6">
            <Link href="/tournaments" className="w-full btn btn-primary flex items-center justify-center space-x-2">
              <Layout className="h-5 w-5" />
              <span>Manage all tournaments</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <QuickAccessCard
          title="Team Management"
          description="Add, edit or delete teams and players"
          icon={Users}
          href="/participants"
          color="bg-secondary-500"
        />
        <QuickAccessCard
          title="Match Schedule"
          description="Create and manage tournament match schedules"
          icon={Calendar}
          href="/schedule"
          color="bg-accent-500"
        />
        <QuickAccessCard
          title="Results & Leaderboard"
          description="View match results and tournament leaderboard"
          icon={BarChart3}
          href="/leaderboard"
          color="bg-success-500"
        />
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  icon: React.ElementType
  color: string
  change?: string
  positive?: boolean
}

function DashboardCard({ title, value, icon: Icon, color, change, positive }: DashboardCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card border border-neutral-200 p-6 transition-all duration-200 hover:shadow-card-hover">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-800">{value}</h3>
          {change && (
            <p
              className={`text-xs font-medium mt-1 ${
                positive ? "text-success-600" : positive === false ? "text-red-600" : "text-neutral-500"
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  title: string
  description: string
  time: string
  icon: React.ElementType
  color: string
}

function ActivityItem({ title, description, time, icon: Icon, color }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
      <div className={`p-2 rounded-full ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-neutral-800">{title}</h4>
        <p className="text-sm text-neutral-600">{description}</p>
        <p className="text-xs text-neutral-400 mt-1">{time}</p>
      </div>
    </div>
  )
}

interface TournamentItemProps {
  title: string
  status: "Active" | "Completed" | "Upcoming"
  progress: number
  href: string
}

function TournamentItem({ title, status, progress, href }: TournamentItemProps) {
  const statusColors = {
    Active: "bg-success-100 text-success-800",
    Completed: "bg-neutral-100 text-neutral-800",
    Upcoming: "bg-primary-100 text-primary-800",
  }

  return (
    <Link
      href={href}
      className="block p-3 rounded-lg border border-neutral-200 hover:border-primary-200 hover:bg-primary-50/30 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-neutral-800">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[status]}`}>
          {status === "Active" ? "In Progress" : status === "Completed" ? "Completed" : "Upcoming"}
        </span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2 mb-1">
        <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-500">{progress}% completed</span>
        <ArrowRight className="h-4 w-4 text-primary-500" />
      </div>
    </Link>
  )
}

interface QuickAccessCardProps {
  title: string
  description: string
  icon: React.ElementType
  href: string
  color: string
}

function QuickAccessCard({ title, description, icon: Icon, href, color }: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-xl shadow-card border border-neutral-200 p-6 transition-all duration-200 hover:shadow-card-hover hover:border-primary-200"
    >
      <div className={`p-3 rounded-full ${color} inline-block mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-neutral-800 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 mb-4">{description}</p>
      <div className="flex items-center text-primary-600 font-medium">
        <span>Get Started</span>
        <ArrowRight className="h-4 w-4 ml-2" />
      </div>
    </Link>
  )
}
