"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trophy, Users, Calendar, ListChecks, BarChart3, ArrowRight, Plus, Layout } from "lucide-react"
import Link from "next/link"
import { useDataFetching } from "../context/DataFetchingContext"
import LoadingSpinner from "../components/ui-elements/LoadingSpinner"
import PageHeader from "../components/ui-elements/PageHeader"

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { simulateFetch } = useDataFetching()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await simulateFetch(null, 1500)
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
          title="Running Tournaments"
          value="3"
          icon={Trophy}
          color="bg-primary-500"
          change="+1 this month"
          positive={true}
        />
        <DashboardCard
          title="Total Teams"
          value="48"
          icon={Users}
          color="bg-secondary-500"
          change="+12 this month"
          positive={true}
        />
        <DashboardCard
          title="Upcoming Matches"
          value="24"
          icon={Calendar}
          color="bg-accent-500"
          change="Next: Tomorrow"
        />
        <DashboardCard
          title="Completed Matches"
          value="36"
          icon={ListChecks}
          color="bg-success-500"
          change="+8 this week"
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card border border-neutral-200 p-6">
          <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
            <span className="p-1.5 bg-primary-100 rounded-md text-primary-600 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            Recent Activities
          </h2>
          <div className="space-y-4">
            <ActivityItem
              title="Tournament Created"
              description="Summer Football Championship 2023 has been created"
              time="2 hours ago"
              icon={Trophy}
              color="bg-primary-100 text-primary-700"
            />
            <ActivityItem
              title="Teams Added"
              description="8 new teams have been added to Summer Football Championship"
              time="Yesterday"
              icon={Users}
              color="bg-secondary-100 text-secondary-700"
            />
            <ActivityItem
              title="Schedule Updated"
              description="Match schedule has been updated for Winter League"
              time="2 days ago"
              icon={Calendar}
              color="bg-accent-100 text-accent-700"
            />
            <ActivityItem
              title="Results Recorded"
              description="Results for 12 matches have been recorded"
              time="3 days ago"
              icon={ListChecks}
              color="bg-success-100 text-success-700"
            />
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
            <TournamentItem
              title="Summer Football Championship 2023"
              status="Active"
              progress={45}
              href="/tournaments/tour-1"
            />
            <TournamentItem title="Winter League 2023" status="Active" progress={78} href="/tournaments/tour-2" />
            <TournamentItem title="Spring Cup 2023" status="Active" progress={12} href="/tournaments/tour-3" />
            <TournamentItem title="Fall Tournament 2022" status="Completed" progress={100} href="/tournaments/tour-4" />
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
