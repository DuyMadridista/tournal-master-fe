"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Calendar,
  Users,
  Info,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  ChevronRight,
} from "lucide-react"
import { toast } from "react-toastify"
import { Tournament } from "@/types/tournament"
import Link from "next/link"

interface Team {
  teamId: string
  teamName: string
}

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
    matchDayId: string
  }

interface ScheduleIssue {
  type: "team_overload" | "venue_conflict" | "rest_time" | "day_distribution"
  severity: "high" | "medium" | "low"
  description: string
  affectedMatches: Match[]
  affectedTeams?: Team[]
  recommendation: string
  actionable: boolean
}

interface ScheduleAnalysisResult {
  issues: ScheduleIssue[]
  score: number
  summary: string
  hasIssues: boolean
}

interface ScheduleAnalyzerProps {
  matches: Match[]
  onMoveMatchSuggestion: (
    matchId: string,
    suggestedDateId: string,
    suggestedStartTime: string,
    suggestedEndTime: string,
  ) => void
  tournament: Tournament | null
}

export default function ScheduleAnalyzer({ matches, onMoveMatchSuggestion, tournament }: ScheduleAnalyzerProps) {
  const [analysis, setAnalysis] = useState<ScheduleAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [expandedIssue, setExpandedIssue] = useState<number | null>(null)
  const [showAllIssues, setShowAllIssues] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "issues" | "suggestions">("overview")
  // Analyze schedule when matches change
  useEffect(() => {
    analyzeSchedule()
  }, [matches])

  const analyzeSchedule = async () => {
    setIsAnalyzing(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const result = performScheduleAnalysis(matches)
      setAnalysis(result)
    } catch (error) {
      console.error("Failed to analyze schedule:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const performScheduleAnalysis = (matches: Match[]): ScheduleAnalysisResult => {
    const issues: ScheduleIssue[] = []


    
    
    // Group matches by date
    const matchesByDate = groupMatchesByDate(matches)
    
    // Group matches by team
    const matchesByTeam = groupMatchesByTeam(matches)

    // Check for teams playing multiple matches in a day
    const teamOverloadIssues = checkTeamOverload(matchesByDate)
    issues.push(...teamOverloadIssues)

    // Check for insufficient rest time between matches
    const restTimeIssues = checkRestTime(matchesByTeam)
    issues.push(...restTimeIssues)

    // Check for uneven distribution of matches across days
    const distributionIssues = checkDayDistribution(matchesByDate)
    issues.push(...distributionIssues)

    // Calculate overall schedule score (0-100)
    const score = calculateScheduleScore(issues, matches.length)

    // Generate summary
    const summary = generateSummary(score, issues)

    return {
      issues,
      score,
      summary,
      hasIssues: issues.length > 0,
    }
  }

  const groupMatchesByDate = (matches: Match[]): Record<string, Match[]> => {
    return matches.reduce(
      (acc, match) => {
        //const dateStr = match.date.toISOString().split("T")[0]
        if (!acc[match.matchDayId]) {
          acc[match.matchDayId] = []
        }
        acc[match.matchDayId].push(match)
        return acc
      },
      {} as Record<string, Match[]>,
    )
  }

  const groupMatchesByTeam = (matches: Match[]): Record<string, Match[]> => {
    const result: Record<string, Match[]> = {}

    matches.forEach((match) => {
      // Add match to team1's matches
      if (!result[match.teamOne.teamId]) {
        result[match.teamOne.teamId] = []
      }
      result[match.teamOne.teamId].push(match)

      // Add match to team2's matches
      if (!result[match.teamTwo.teamId]) {
        result[match.teamTwo.teamId] = []
      }
      result[match.teamTwo.teamId].push(match)
    })

    return result
  }

  const checkTeamOverload = (
    matchesByDate: Record<string, Match[]>,
  ): ScheduleIssue[] => {
    const issues: ScheduleIssue[] = []
  
    Object.entries(matchesByDate).forEach(([dateStr, dateMatches]) => {
      // Group matches by team
      const teamMatchesCount: Record<string, Match[]> = {}
      dateMatches.forEach((m) => {
        teamMatchesCount[m.teamOne.teamId] ||= []
        teamMatchesCount[m.teamTwo.teamId] ||= []
        teamMatchesCount[m.teamOne.teamId].push(m)
        teamMatchesCount[m.teamTwo.teamId].push(m)
      })
  
      // For each team with >1 match/day
      Object.entries(teamMatchesCount).forEach(([teamId, teamMatches]) => {
        if (teamMatches.length <= 1) return
        const sample = teamMatches[0]
        const team =
          sample.teamOne.teamId === teamId ? sample.teamOne : sample.teamTwo
  
        // Find move suggestion
        const suggestion = findBestMatchToMove(
          teamMatches,
          matchesByDate,
          dateStr,
        )
  
        let severity : "high" | "medium" | "low" = 'high' 
        const description = `${team.teamName} has ${
          teamMatches.length
        } matches on ${new Date(teamMatches[0].date).toLocaleDateString(
          'vi-VN',
        )}`
  
        let recommendation = 'Consider adding more match days to redistribute matches'
        let actionable = false
  
        if (suggestion) {
          const { match, newDateStr } = suggestion
         severity = teamMatches.length > 2 ? 'high' : 'medium'
          recommendation = `Move match ${match.teamOne.teamName} vs ${match.teamTwo.teamName} to ${new Date(
            matchesByDate[newDateStr][0].date,
          ).toLocaleDateString('vi-VN')}`
          actionable = true
        }
  
        issues.push({
          type: 'team_overload',
          severity,
          description,
          affectedMatches: teamMatches,
          affectedTeams: [team],
          recommendation,
          actionable,
        })
      })
    })
  
    return issues
  }
  

  const checkRestTime = (matchesByTeam: Record<string, Match[]>): ScheduleIssue[] => {
    const issues: ScheduleIssue[] = []
    const MIN_REST_HOURS = 3 // Minimum hours between matches

    Object.entries(matchesByTeam).forEach(([teamId, teamMatches]) => {
      if (teamMatches.length <= 1) return

      // Sort matches by date and time
      const sortedMatches = [...teamMatches].sort((a, b) => {
        const dateA = new Date(`${a.date.toISOString().split("T")[0]}T${a.startTime}`)
        const dateB = new Date(`${b.date.toISOString().split("T")[0]}T${b.startTime}`)
        return dateA.getTime() - dateB.getTime()
      })

      // Check rest time between consecutive matches
      for (let i = 0; i < sortedMatches.length - 1; i++) {
        const currentMatch = sortedMatches[i]
        const nextMatch = sortedMatches[i + 1]

        const currentMatchEnd = new Date(`${currentMatch.date.toISOString().split("T")[0]}T${currentMatch.endTime}`)
        const nextMatchStart = new Date(`${nextMatch.date.toISOString().split("T")[0]}T${nextMatch.startTime}`)

        const restTimeHours = (nextMatchStart.getTime() - currentMatchEnd.getTime()) / (1000 * 60 * 60)

        if (restTimeHours < MIN_REST_HOURS && currentMatch.date.toDateString() === nextMatch.date.toDateString()) {
          // Get team info
          const team = currentMatch.teamOne.teamId === teamId ? currentMatch.teamOne : currentMatch.teamTwo

          // Find a better time slot for the next match
          const suggestedTime = getSuggestedTimeSlot(currentMatch.endTime, MIN_REST_HOURS)

          issues.push({
            type: "rest_time",
            severity: "high",
            description: `${team.teamName} only has ${restTimeHours.toFixed(1)} hours of rest between matches on ${currentMatch.date.toLocaleDateString("vi-VN")}`,
            affectedMatches: [currentMatch, nextMatch],
            affectedTeams: [team],
            recommendation: `Move match ${nextMatch.teamOne.teamName} vs ${nextMatch.teamTwo.teamName} to after ${suggestedTime}`,
            actionable: true,
          })
        }
      }
    })

    return issues
  }

  const checkDayDistribution = (matchesByDate: Record<string, Match[]>): ScheduleIssue[] => {
    const issues: ScheduleIssue[] = []

    const dates = Object.keys(matchesByDate)
    if (dates.length <= 1) return issues

    const matchesPerDay = dates.map((date) => matchesByDate[date].length)
    const totalMatches = matchesPerDay.reduce((sum, count) => sum + count, 0)
    const idealMatchesPerDay = totalMatches / dates.length

    // Check if any day has significantly more matches than ideal
    dates.forEach((dateStr, index) => {
      const matchCount = matchesByDate[dateStr].length
      const difference = matchCount - idealMatchesPerDay

      if (difference > 2) {
        // Find days with fewer matches
        const daysWithFewerMatches = dates
          .filter((d) => matchesByDate[d].length < idealMatchesPerDay)
          .sort((a, b) => matchesByDate[a].length - matchesByDate[b].length)

        if (daysWithFewerMatches.length > 0) {
          const targetDate = daysWithFewerMatches[0]
          const matchesToMove = Math.min(
            Math.ceil(difference),
            matchesByDate[dateStr].length - Math.floor(idealMatchesPerDay),
          )

          issues.push({
            type: "day_distribution",
            severity: matchesToMove > 2 ? "high" : "medium",
            description: `${new Date(dateStr).toLocaleDateString("vi-VN")} has too many matches (${matchCount} matches)`,
            affectedMatches: matchesByDate[dateStr],
            recommendation: `Move ${matchesToMove} matches from ${new Date(dateStr).toLocaleDateString("vi-VN")} to ${new Date(targetDate).toLocaleDateString("vi-VN")}`,
            actionable: true,
          })
        }
      }
    })

    return issues
  }

  const getSuggestedTimeSlot = (endTime: string, hoursToAdd: number): string => {
    const [hours, minutes] = endTime.split(":").map(Number)
    const newHours = hours + hoursToAdd
    const newMinutes = minutes

    // Format with leading zeros
    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`
  }

  const calculateScheduleScore = (issues: ScheduleIssue[], totalMatches: number): number => {
    if (totalMatches === 0) return 100

    // Calculate penalty based on issues
    let penalty = 0
    issues.forEach((issue) => {
      switch (issue.severity) {
        case "high":
          penalty += 15
          break
        case "medium":
          penalty += 10
          break
        case "low":
          penalty += 5
          break
      }
    })

    // Cap penalty at 100
    penalty = Math.min(penalty, 100)

    return 100 - penalty
  }

  const generateSummary = (score: number, issues: ScheduleIssue[]): string => {
    if (issues.length === 0) {
      return "The current schedule is well optimized."
    }

    if (score >= 80) {
      return "The schedule is quite good, but can still be improved."
    } else if (score >= 60) {
      return "The schedule has some issues that need to be addressed."
    } else {
      return "The schedule has several serious problems that need to be adjusted."
    }
  }

  function findBestMatchToMove(
    teamMatches: Match[],
    matchesByDate: Record<string, Match[]>,
    currentDateStr: string,
  ) {
    const allDates = Object.keys(matchesByDate).sort()
    const currentDateIndex = allDates.indexOf(currentDateStr)
  
    // Ưu tiên các trận có startTime muộn hơn
    const candidates = [...teamMatches].sort((a, b) =>
      b.startTime.localeCompare(a.startTime),
    )
  
    for (const match of candidates) {
      for (let i = 0; i < allDates.length; i++) {
        if (i === currentDateIndex) continue
  
        const otherDateStr = allDates[i]
        const dayMatches = matchesByDate[otherDateStr]
  
        const t1 = match.teamOne.teamId
        const t2 = match.teamTwo.teamId
  
        const conflict1 = dayMatches.some(
          (m) => m.teamOne.teamId === t1 || m.teamTwo.teamId === t1,
        )
        const conflict2 = dayMatches.some(
          (m) => m.teamOne.teamId === t2 || m.teamTwo.teamId === t2,
        )
  
        if (!conflict1 && !conflict2) {
          return { match, newDateStr: otherDateStr }
        }
      }
    }
  
    return null
  }

  const handleApplySuggestion = (issue: ScheduleIssue) => {

    
    if (!issue.actionable) return

    // For team overload issues, suggest moving a match to another day
    if (issue.type === "team_overload" && issue.affectedMatches.length > 0) {
      
      const matchesByDate = groupMatchesByDate(matches);
      const suggestion = findBestMatchToMove(issue.affectedMatches, matchesByDate, issue.affectedMatches[0].date.toISOString().split("T")[0]);
    
      if (suggestion) {
        const { match, newDateStr } = suggestion;
        onMoveMatchSuggestion(match.id, newDateStr, match.startTime, match.endTime);
      } else {
        console.warn("Could not find a suitable match to move without causing conflicts");
        toast.error("Could not find a suitable match to move without causing conflicts");
      }
    }

    // For rest time issues, suggest moving to a later time slot
    if (issue.type === "rest_time" && issue.affectedMatches.length > 1) {
      const currentMatch = issue.affectedMatches[0]
      const nextMatch = issue.affectedMatches[1]

      const currentMatchEnd = new Date(`${currentMatch.date.toISOString().split("T")[0]}T${currentMatch.endTime}`)
      const suggestedStartTime = getSuggestedTimeSlot(currentMatch.endTime, 3)

      // Calculate end time (assuming 1 hour duration)
      const [hours, minutes] = suggestedStartTime.split(":").map(Number)
      const endHours = hours + 1
      const suggestedEndTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`

      onMoveMatchSuggestion(nextMatch.id, nextMatch.matchDayId, suggestedStartTime, suggestedEndTime)
    }

    // For day distribution issues, suggest moving matches to less busy days
    if (issue.type === "day_distribution" && issue.affectedMatches.length > 0) {
      const matchesByDate = groupMatchesByDate(matches)
      const allDates = Object.keys(matchesByDate).sort()
      const currentDateStr = issue.affectedMatches[0].date.toISOString().split("T")[0]

      // Find days with fewer matches
      const daysWithFewerMatches = allDates
        .filter((d) => d !== currentDateStr)
        .sort((a, b) => matchesByDate[a].length - matchesByDate[b].length)

      if (daysWithFewerMatches.length > 0) {
        const targetDate = daysWithFewerMatches[0]
        const matchToMove = issue.affectedMatches[0]

        onMoveMatchSuggestion(matchToMove.id, targetDate, matchToMove.startTime, matchToMove.endTime)
      }
    }
  }

  const toggleExpandIssue = (index: number) => {
    setExpandedIssue(expandedIssue === index ? null : index)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-50 border-red-200"
      case "medium":
        return "text-amber-500 bg-amber-50 border-amber-200"
      case "low":
        return "text-yellow-500 bg-yellow-50 border-yellow-200"
      default:
        return "text-gray-500 bg-gray-50 border-gray-200"
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "team_overload":
        return <Users className="h-5 w-5" />
      case "rest_time":
        return <Clock className="h-5 w-5" />
      case "day_distribution":
        return <Calendar className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-50 border-green-200"
    if (score >= 60) return "bg-amber-50 border-amber-200"
    return "bg-red-50 border-red-200"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-6 w-6 text-amber-600" />
    return <AlertTriangle className="h-6 w-6 text-red-600" />
  }

  const getHighPriorityIssues = () => {
    if (!analysis) return []
    return analysis.issues.filter((issue) => issue.severity === "high")
  }

  const getMediumPriorityIssues = () => {
    if (!analysis) return []
    return analysis.issues.filter((issue) => issue.severity === "medium")
  }

  const getLowPriorityIssues = () => {
    if (!analysis) return []
    return analysis.issues.filter((issue) => issue.severity === "low")
  }

  const getActionableIssues = () => {
    if (!analysis) return []
    return analysis.issues.filter((issue) => issue.actionable)
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
        <span>Analyzing schedule...</span>
      </div>
    )
  }

  if (!analysis) {
    return null
  }

  // Perfect schedule - no issues
  if (analysis.issues.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-200">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-green-800">Perfect Schedule</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-green-600">100</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Rating Score</h4>
                <p className="text-green-600">The schedule has been perfectly optimized</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              The current schedule does not have any issues. All teams have reasonable rest time and the number of matches is evenly distributed between days.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Schedule with issues
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
      <div className={`px-6 py-4 border-b ${getScoreBackground(analysis.score)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getScoreIcon(analysis.score)}
            <h3 className="text-lg font-semibold ml-3">
              {analysis.score < 60
                ? "Schedule has serious issues"
                : analysis.score < 80
                  ? "Schedule needs improvement"
                  : "Schedule is quite good"}
            </h3>
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "overview" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "issues" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setActiveTab("issues")}
            >
              Issues ({analysis.issues.length})
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "suggestions" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              onClick={() => setActiveTab("suggestions")}
            >
              Suggestions ({getActionableIssues().length})
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Score card */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 border rounded-lg">
              <div className="flex flex-col items-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBackground(analysis.score)}`}
                >
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
                </div>
                <span className="mt-2 font-medium">Rating Score</span>
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Analysis Summary</h4>
                <p className="text-gray-700 mb-4">{analysis.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Serious Issues</div>
                      <div className="text-xl font-bold text-red-700">{getHighPriorityIssues().length}</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-amber-800">Medium Issues</div>
                      <div className="text-xl font-bold text-amber-700">{getMediumPriorityIssues().length}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
                    <Zap className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">Improvement Suggestions</div>
                      <div className="text-xl font-bold text-blue-700">{getActionableIssues().length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick fix section */}
            {getHighPriorityIssues().length > 0 && (
              <div className="border border-red-200 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                  <h4 className="font-semibold text-red-800 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Issues That Need Immediate Resolution
                  </h4>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {getHighPriorityIssues()
                      .slice(0, 2)
                      .map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{issue.description}</p>
                            <p className="text-sm text-gray-600 mt-1">{issue.recommendation}</p>
                          </div>
                          {issue.actionable && (
                            <button
                              onClick={() => handleApplySuggestion(issue)}
                              className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Fix now
                            </button>
                          )}
                          {issue.recommendation === "Consider adding more match days to redistribute matches" && (
                            <Link
                              href={`/tournaments/${tournament?.id}/details`}
                              className="ml-4 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Add more match days
                            </Link>
                          )}
                        </div>
                      ))}

                    {getHighPriorityIssues().length > 2 && (
                      <button
                        className="text-red-600 text-sm font-medium flex items-center hover:underline"
                        onClick={() => {
                          setActiveTab("issues")
                          setShowAllIssues(true)
                        }}
                      >
                         View all {getHighPriorityIssues().length} serious issues 
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Optimization suggestions */}
            {getActionableIssues().length > 0 && (
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Optimization suggestions
                  </h4>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {getActionableIssues()
                      .slice(0, 3)
                      .map((issue, index) => (
                        <div
                          key={index}
                          className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              {getIssueIcon(issue.type)}
                              <p className="font-medium text-gray-800 ml-2">{issue.description}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-7">{issue.recommendation}</p>
                          </div>
                          <button
                            onClick={() => handleApplySuggestion(issue)}
                            className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center whitespace-nowrap"
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Apply
                          </button>
                        </div>
                      ))}

                    {getActionableIssues().length > 3 && (
                      <button
                        className="text-blue-600 text-sm font-medium flex items-center hover:underline"
                        onClick={() => {
                          setActiveTab("suggestions")
                        }}
                      >
                        View all {getActionableIssues().length} suggestions
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "issues" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">All issues ({analysis.issues.length})</h4>
              <button
                className="text-sm text-blue-600 flex items-center"
                onClick={() => setShowAllIssues(!showAllIssues)}
              >
                {showAllIssues ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Collapse all
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Expand all
                  </>
                )}
              </button>
            </div>

            {/* High priority issues */}
            {getHighPriorityIssues().length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-red-800 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  High priority issues ({getHighPriorityIssues().length})
                </h5>
                <div className="space-y-3">
                  {getHighPriorityIssues().map((issue, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden border-red-200">
                      <div
                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-red-50 bg-red-50"
                        onClick={() => toggleExpandIssue(index)}
                      >
                        <div className="flex items-center">
                          {getIssueIcon(issue.type)}
                          <span className="ml-2 font-medium text-red-800">{issue.description}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs uppercase font-bold px-2 py-1 rounded-full mr-2 bg-red-100 text-red-800">
                            High priority
                          </span>
                          {expandedIssue === index || showAllIssues ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>

                      {(expandedIssue === index || showAllIssues) && (
                        <div className="p-4 border-t border-red-200 bg-white">
                          <div className="mb-3">
                            <h5 className="font-medium mb-2">Affected matches:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {issue.affectedMatches.map((match, idx) => (
                                <li key={idx}>
                                  {match.teamOne.teamName} vs {match.teamTwo.teamName} (
                                  {new Date(match.date).toLocaleDateString("vi-VN")} {match.startTime}-{match.endTime})
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex justify-between" >
                        <div className="flex items-start">
                          {/* <div> */}
                          <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h6 className="font-medium text-blue-800 mb-1">Recommendation:</h6>
                            <p className="text-blue-700">{issue.recommendation}</p>
                          </div>
                          {/* </div> */}
                          
                         
                        </div>
                        {issue.actionable ? (
                            <button
                              className="btn btn-sm bg-red-100 text-red-700 hover:bg-red-200 flex items-center border-0"
                              onClick={() => handleApplySuggestion(issue)}
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Apply
                            </button>
                          ) :(
                            <Link
                              href={`/tournaments/${tournament?.id}/details`}
                              className="ml-4 px-2 py-0.5 bg-green-200 text-green-700 rounded-md hover:bg-green-200 flex items-center"
                            >
                              <Zap className="h-4 w-4 mr-1" />
                              Add more match days
                            </Link>
                          ) }
                      </div>

                          
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium priority issues */}
            {getMediumPriorityIssues().length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-amber-800 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Medium priority issues ({getMediumPriorityIssues().length})
                </h5>
                <div className="space-y-3">
                  {getMediumPriorityIssues().map((issue, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden border-amber-200">
                      <div
                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-amber-50 bg-amber-50"
                        onClick={() => toggleExpandIssue(index + getHighPriorityIssues().length)}
                      >
                        <div className="flex items-center">
                          {getIssueIcon(issue.type)}
                          <span className="ml-2 font-medium text-amber-800">{issue.description}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs uppercase font-bold px-2 py-1 rounded-full mr-2 bg-amber-100 text-amber-800">
                            Medium priority
                          </span>
                          {expandedIssue === index + getHighPriorityIssues().length || showAllIssues ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>

                      {(expandedIssue === index + getHighPriorityIssues().length || showAllIssues) && (
                        <div className="p-4 border-t border-amber-200 bg-white">
                          <div className="mb-3">
                            <h5 className="font-medium mb-2">Affected matches:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {issue.affectedMatches.map((match, idx) => (
                                <li key={idx}>
                                  {match.teamOne.teamName} vs {match.teamTwo.teamName} (
                                  {new Date(match.date).toLocaleDateString("vi-VN")} {match.startTime}-{match.endTime})
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h6 className="font-medium text-blue-800 mb-1">Recommendation:</h6>
                            <p className="text-blue-700">{issue.recommendation}</p>
                          </div>
                        </div>
                      </div>

                          {issue.actionable && (
                            <button
                              className="btn btn-sm bg-amber-100 text-amber-700 hover:bg-amber-200 flex items-center border-0"
                              onClick={() => handleApplySuggestion(issue)}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Apply
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Low priority issues */}
            {getLowPriorityIssues().length > 0 && (
              <div>
                <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Low priority issues ({getLowPriorityIssues().length})
                </h5>
                <div className="space-y-3">
                  {getLowPriorityIssues().map((issue, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden border-yellow-200">
                      <div
                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-yellow-50 bg-yellow-50"
                        onClick={() =>
                          toggleExpandIssue(index + getHighPriorityIssues().length + getMediumPriorityIssues().length)
                        }
                      >
                        <div className="flex items-center">
                          {getIssueIcon(issue.type)}
                          <span className="ml-2 font-medium text-yellow-800">{issue.description}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-xs uppercase font-bold px-2 py-1 rounded-full mr-2 bg-yellow-100 text-yellow-800">
                            Low priority
                          </span>
                          {expandedIssue ===
                            index + getHighPriorityIssues().length + getMediumPriorityIssues().length ||
                          showAllIssues ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      </div>

                      {(expandedIssue === index + getHighPriorityIssues().length + getMediumPriorityIssues().length ||
                        showAllIssues) && (
                        <div className="p-4 border-t border-yellow-200 bg-white">
                          <div className="mb-3">
                            <h5 className="font-medium mb-2">Affected matches:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {issue.affectedMatches.map((match, idx) => (
                                <li key={idx}>
                                  {match.teamOne.teamName} vs {match.teamTwo.teamName} (
                                  {new Date(match.date).toLocaleDateString("vi-VN")} {match.startTime}-{match.endTime})
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h6 className="font-medium text-blue-800 mb-1">Recommendation:</h6>
                            <p className="text-blue-700">{issue.recommendation}</p>
                          </div>
                        </div>
                      </div>

                          {issue.actionable && (
                            <button
                              className="btn btn-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 flex items-center border-0"
                              onClick={() => handleApplySuggestion(issue)}
                            >
                              <ArrowRight className="h-4 w-4 mr-1" />
                              Apply
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "suggestions" && (
          <div>
            <h4 className="font-semibold text-lg mb-4">Actionable suggestions ({getActionableIssues().length})</h4>

            {getActionableIssues().length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">No actionable suggestions available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getActionableIssues().map((issue, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div
                      className={`p-4 ${
                        issue.severity === "high"
                          ? "bg-red-50 border-b border-red-200"
                          : issue.severity === "medium"
                            ? "bg-amber-50 border-b border-amber-200"
                            : "bg-yellow-50 border-b border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getIssueIcon(issue.type)}
                          <h5 className="font-medium ml-2">{issue.description}</h5>
                        </div>
                        <span
                          className={`text-xs uppercase font-bold px-2 py-1 rounded-full ${
                            issue.severity === "high"
                              ? "bg-red-100 text-red-800"
                              : issue.severity === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {issue.severity === "high"
                            ? "Serious"
                            : issue.severity === "medium"
                              ? "Medium"
                              : "Low"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-4">
                        <h6 className="font-medium mb-2">Issue:</h6>
                        <p className="text-gray-700">{issue.description}</p>
                      </div>

                      <div className="mb-4">
                        <h6 className="font-medium mb-2">Affected Matches:</h6>
                        <ul className="list-disc pl-5 space-y-1">
                          {issue.affectedMatches.slice(0, 3).map((match, idx) => (
                            <li key={idx} className="text-gray-700">
                              {match.teamOne.teamName} vs {match.teamTwo.teamName} (
                              {new Date(match.date).toLocaleDateString("vi-VN")} {match.startTime}-{match.endTime})
                            </li>
                          ))}
                          {issue.affectedMatches.length > 3 && (
                            <li className="text-gray-500 italic">
                              ...and {issue.affectedMatches.length - 3} other matches
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start">
                          <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <h6 className="font-medium text-blue-800 mb-1">Recommendation:</h6>
                            <p className="text-blue-700">{issue.recommendation}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          className={`px-4 py-2 rounded-md flex items-center ${
                            issue.severity === "high"
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                          onClick={() => handleApplySuggestion(issue)}
                        >
                          {issue.severity === "high" ? (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Fix Now
                            </>
                          ) : (
                            <>
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Apply Recommendation
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
