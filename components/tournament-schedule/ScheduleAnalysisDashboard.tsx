"use client"

import { useState, useEffect } from "react"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Info,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  RefreshCw,
  Filter,
  BarChart3,
  Layers,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Match, Team } from "@/types/tournament"

// Define issue types
type IssueSeverity = "critical" | "high" | "medium" | "low"
type IssueType =
  | "team_overload"
  | "venue_conflict"
  | "rest_time"
  | "day_distribution"
  | "missing_team"
  | "invalid_date"
  | "overlapping_matches"
  | "uneven_distribution"

interface ScheduleIssue {
  id: string
  type: IssueType
  severity: IssueSeverity
  title: string
  description: string
  affectedMatches: Match[]
  affectedTeams?: Team[]
  recommendation: string
  autoFixable: boolean
  autoFixDescription?: string
}

interface ScheduleAnalysisResult {
  issues: ScheduleIssue[]
  score: number
  summary: string
  hasIssues: boolean
  issuesByType: Record<IssueType, number>
  issuesBySeverity: Record<IssueSeverity, number>
  teamsWithIssues: Team[]
  datesWithIssues: string[]
  totalMatches: number
  analyzedMatches: number
}

interface ScheduleAnalysisDashboardProps {
  matches: Match[]
  onFixIssue: (issueId: string, matchIds: string[], action: string, params?: any) => Promise<boolean>
  onRefreshAnalysis?: () => void
}

export default function ScheduleAnalysisDashboard({
  matches,
  onFixIssue,
  onRefreshAnalysis,
}: ScheduleAnalysisDashboardProps) {
  const [analysis, setAnalysis] = useState<ScheduleAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("overview")
  const [severityFilter, setSeverityFilter] = useState<IssueSeverity | "all">("all")
  const [typeFilter, setTypeFilter] = useState<IssueType | "all">("all")
  const [fixingIssueId, setFixingIssueId] = useState<string | null>(null)
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())

  // Analyze schedule when matches change
  useEffect(() => {
    analyzeSchedule()
  }, [matches])

  const analyzeSchedule = async () => {
    setIsAnalyzing(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = performScheduleAnalysis(matches)
      setAnalysis(result)
    } catch (error) {
      console.error("Failed to analyze schedule:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const performScheduleAnalysis = (matches: Match[]): ScheduleAnalysisResult => {
    // This is a mock implementation - in a real app, this would be more sophisticated
    const issues: ScheduleIssue[] = []

    // Group matches by date
    const matchesByDate = groupMatchesByDate(matches)

    // Group matches by team
    const matchesByTeam = groupMatchesByTeam(matches)

    // Group matches by venue
    const matchesByVenue = groupMatchesByVenue(matches)

    // Check for teams playing multiple matches in a day
    checkTeamOverload(matchesByDate, matchesByTeam, issues)

    // Check for venue conflicts
    checkVenueConflicts(matchesByVenue, issues)

    // Check for insufficient rest time between matches
    checkRestTime(matchesByTeam, issues)

    // Check for uneven distribution of matches across days
    checkDayDistribution(matchesByDate, issues)

    // Check for overlapping matches
    checkOverlappingMatches(matches, issues)

    // Check for invalid dates
    checkInvalidDates(matches, issues)

    // Calculate statistics
    const issuesByType = countIssuesByType(issues)
    const issuesBySeverity = countIssuesBySeverity(issues)
    const teamsWithIssues = getTeamsWithIssues(issues)
    const datesWithIssues = getDatesWithIssues(issues)

    // Calculate overall schedule score (0-100)
    const score = calculateScheduleScore(issues, matches.length)

    // Generate summary
    const summary = generateSummary(score, issues)

    return {
      issues,
      score,
      summary,
      hasIssues: issues.length > 0,
      issuesByType,
      issuesBySeverity,
      teamsWithIssues,
      datesWithIssues,
      totalMatches: matches.length,
      analyzedMatches: matches.length,
    }
  }

  // Helper functions for analysis
  const groupMatchesByDate = (matches: Match[]): Record<string, Match[]> => {
    return matches.reduce(
      (acc, match) => {
        const dateStr = match.date.toISOString().split("T")[0]
        if (!acc[dateStr]) {
          acc[dateStr] = []
        }
        acc[dateStr].push(match)
        return acc
      },
      {} as Record<string, Match[]>,
    )
  }

  const groupMatchesByTeam = (matches: Match[]): Record<string, Match[]> => {
    const result: Record<string, Match[]> = {}

    matches.forEach((match) => {
      // Add match to team1's matches
      if (!result[match.team1.id]) {
        result[match.team1.id] = []
      }
      result[match.team1.id].push(match)

      // Add match to team2's matches
      if (!result[match.team2.id]) {
        result[match.team2.id] = []
      }
      result[match.team2.id].push(match)
    })

    return result
  }

  const groupMatchesByVenue = (matches: Match[]): Record<string, Match[]> => {
    return matches.reduce(
      (acc, match) => {
        if (match.venue) {
          if (!acc[match.venue]) {
            acc[match.venue] = []
          }
          acc[match.venue].push(match)
        }
        return acc
      },
      {} as Record<string, Match[]>,
    )
  }

  const checkTeamOverload = (
    matchesByDate: Record<string, Match[]>,
    matchesByTeam: Record<string, Match[]>,
    issues: ScheduleIssue[],
  ) => {
    // Check each date
    Object.entries(matchesByDate).forEach(([dateStr, dateMatches]) => {
      // Track matches per team on this date
      const teamMatchesCount: Record<string, Match[]> = {}

      // Count matches per team on this date
      dateMatches.forEach((match) => {
        if (!teamMatchesCount[match.team1.id]) {
          teamMatchesCount[match.team1.id] = []
        }
        if (!teamMatchesCount[match.team2.id]) {
          teamMatchesCount[match.team2.id] = []
        }

        teamMatchesCount[match.team1.id].push(match)
        teamMatchesCount[match.team2.id].push(match)
      })

      // Find teams with too many matches
      Object.entries(teamMatchesCount).forEach(([teamId, teamMatches]) => {
        if (teamMatches.length > 1) {
          // Get team info
          const team =
            matches.find((m) => m.team1.id === teamId || m.team2.id === teamId)?.team1.id === teamId
              ? matches.find((m) => m.team1.id === teamId || m.team2.id === teamId)?.team1
              : matches.find((m) => m.team1.id === teamId || m.team2.id === teamId)?.team2

          if (team) {
            const severity: IssueSeverity = teamMatches.length > 2 ? "critical" : "high"

            issues.push({
              id: `team_overload_${teamId}_${dateStr}`,
              type: "team_overload",
              severity,
              title: `Đội ${team.name} có quá nhiều trận đấu trong một ngày`,
              description: `${team.name} có ${teamMatches.length} trận đấu trong ngày ${new Date(dateStr).toLocaleDateString("vi-VN")}`,
              affectedMatches: teamMatches,
              affectedTeams: [team],
              recommendation: `Di chuyển một trong các trận đấu của ${team.name} sang ngày khác để đảm bảo đội không phải thi đấu quá nhiều trong một ngày.`,
              autoFixable: true,
              autoFixDescription: `Tự động di chuyển trận đấu sang ngày khác có ít trận đấu hơn`,
            })
          }
        }
      })
    })
  }

  const checkVenueConflicts = (matchesByVenue: Record<string, Match[]>, issues: ScheduleIssue[]) => {
    Object.entries(matchesByVenue).forEach(([venue, venueMatches]) => {
      // Sort matches by date and time
      const sortedMatches = [...venueMatches].sort((a, b) => {
        const dateA = new Date(`${a.date.toISOString().split("T")[0]}T${a.startTime}`)
        const dateB = new Date(`${b.date.toISOString().split("T")[0]}T${b.startTime}`)
        return dateA.getTime() - dateB.getTime()
      })

      // Check for overlapping time slots
      for (let i = 0; i < sortedMatches.length - 1; i++) {
        const currentMatch = sortedMatches[i]
        const nextMatch = sortedMatches[i + 1]

        const currentMatchEnd = new Date(`${currentMatch.date.toISOString().split("T")[0]}T${currentMatch.endTime}`)
        const nextMatchStart = new Date(`${nextMatch.date.toISOString().split("T")[0]}T${nextMatch.startTime}`)

        // If dates are the same and there's an overlap
        if (currentMatch.date.toDateString() === nextMatch.date.toDateString() && currentMatchEnd > nextMatchStart) {
          issues.push({
            id: `venue_conflict_${venue}_${currentMatch.id}_${nextMatch.id}`,
            type: "venue_conflict",
            severity: "critical",
            title: `Xung đột địa điểm thi đấu tại ${venue}`,
            description: `Hai trận đấu được lên lịch cùng một thời điểm tại ${venue} vào ngày ${currentMatch.date.toLocaleDateString("vi-VN")}`,
            affectedMatches: [currentMatch, nextMatch],
            recommendation: `Di chuyển một trong hai trận đấu sang thời gian khác hoặc thay đổi địa điểm thi đấu.`,
            autoFixable: true,
            autoFixDescription: `Tự động điều chỉnh thời gian bắt đầu của trận đấu thứ hai`,
          })
        }
      }
    })
  }

  const checkRestTime = (matchesByTeam: Record<string, Match[]>, issues: ScheduleIssue[]) => {
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
          const team = currentMatch.team1.id === teamId ? currentMatch.team1 : currentMatch.team2

          issues.push({
            id: `rest_time_${teamId}_${currentMatch.id}_${nextMatch.id}`,
            type: "rest_time",
            severity: "high",
            title: `Thời gian nghỉ không đủ cho đội ${team.name}`,
            description: `${team.name} chỉ có ${restTimeHours.toFixed(1)} giờ nghỉ giữa hai trận đấu trong ngày ${currentMatch.date.toLocaleDateString("vi-VN")}`,
            affectedMatches: [currentMatch, nextMatch],
            affectedTeams: [team],
            recommendation: `Tăng thời gian nghỉ giữa hai trận đấu lên ít nhất ${MIN_REST_HOURS} giờ.`,
            autoFixable: true,
            autoFixDescription: `Tự động điều chỉnh thời gian bắt đầu của trận đấu thứ hai`,
          })
        }
      }
    })
  }

  const checkDayDistribution = (matchesByDate: Record<string, Match[]>, issues: ScheduleIssue[]) => {
    const dates = Object.keys(matchesByDate)
    if (dates.length <= 1) return

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
            id: `day_distribution_${dateStr}`,
            type: "day_distribution",
            severity: matchesToMove > 2 ? "high" : "medium",
            title: `Phân bố trận đấu không đều`,
            description: `Ngày ${new Date(dateStr).toLocaleDateString("vi-VN")} có quá nhiều trận đấu (${matchCount} trận)`,
            affectedMatches: matchesByDate[dateStr],
            recommendation: `Di chuyển ${matchesToMove} trận từ ngày ${new Date(dateStr).toLocaleDateString("vi-VN")} sang ngày ${new Date(targetDate).toLocaleDateString("vi-VN")}`,
            autoFixable: true,
            autoFixDescription: `Tự động phân bố lại các trận đấu giữa các ngày`,
          })
        }
      }
    })
  }

  const checkOverlappingMatches = (matches: Match[], issues: ScheduleIssue[]) => {
    // Group matches by date
    const matchesByDate = groupMatchesByDate(matches)

    Object.entries(matchesByDate).forEach(([dateStr, dateMatches]) => {
      // Sort matches by start time
      const sortedMatches = [...dateMatches].sort((a, b) => {
        return a.startTime.localeCompare(b.startTime)
      })

      // Check for overlapping time slots for the same team
      for (let i = 0; i < sortedMatches.length - 1; i++) {
        const currentMatch = sortedMatches[i]
        const nextMatch = sortedMatches[i + 1]

        const currentMatchEnd = currentMatch.endTime
        const nextMatchStart = nextMatch.startTime

        // Check if the same team is playing in both matches
        const team1InBoth = currentMatch.team1.id === nextMatch.team1.id || currentMatch.team1.id === nextMatch.team2.id
        const team2InBoth = currentMatch.team2.id === nextMatch.team1.id || currentMatch.team2.id === nextMatch.team2.id

        if ((team1InBoth || team2InBoth) && currentMatchEnd > nextMatchStart) {
          const affectedTeam = team1InBoth ? currentMatch.team1 : currentMatch.team2

          issues.push({
            id: `overlapping_matches_${currentMatch.id}_${nextMatch.id}`,
            type: "overlapping_matches",
            severity: "critical",
            title: `Trận đấu chồng chéo cho đội ${affectedTeam.name}`,
            description: `Đội ${affectedTeam.name} có hai trận đấu chồng chéo về thời gian vào ngày ${new Date(dateStr).toLocaleDateString("vi-VN")}`,
            affectedMatches: [currentMatch, nextMatch],
            affectedTeams: [affectedTeam],
            recommendation: `Di chuyển một trong hai trận đấu sang thời gian khác hoặc ngày khác.`,
            autoFixable: true,
            autoFixDescription: `Tự động điều chỉnh thời gian bắt đầu của trận đấu thứ hai`,
          })
        }
      }
    })
  }

  const checkInvalidDates = (matches: Match[], issues: ScheduleIssue[]) => {
    const now = new Date()

    matches.forEach((match) => {
      // Check for past dates
      if (match.date < now && !match.completed) {
        issues.push({
          id: `invalid_date_past_${match.id}`,
          type: "invalid_date",
          severity: "medium",
          title: `Ngày thi đấu không hợp lệ`,
          description: `Trận đấu ${match.team1.name} vs ${match.team2.name} được lên lịch vào ngày trong quá khứ (${match.date.toLocaleDateString("vi-VN")})`,
          affectedMatches: [match],
          affectedTeams: [match.team1, match.team2],
          recommendation: `Cập nhật ngày thi đấu hoặc đánh dấu trận đấu đã hoàn thành.`,
          autoFixable: true,
          autoFixDescription: `Tự động cập nhật ngày thi đấu sang ngày gần nhất có thể`,
        })
      }

      // Check for invalid time format
      const startTimeParts = match.startTime.split(":")
      const endTimeParts = match.endTime.split(":")

      if (
        startTimeParts.length !== 2 ||
        endTimeParts.length !== 2 ||
        isNaN(Number.parseInt(startTimeParts[0])) ||
        isNaN(Number.parseInt(startTimeParts[1])) ||
        isNaN(Number.parseInt(endTimeParts[0])) ||
        isNaN(Number.parseInt(endTimeParts[1]))
      ) {
        issues.push({
          id: `invalid_time_format_${match.id}`,
          type: "invalid_date",
          severity: "medium",
          title: `Định dạng thời gian không hợp lệ`,
          description: `Trận đấu ${match.team1.name} vs ${match.team2.name} có định dạng thời gian không hợp lệ (${match.startTime}-${match.endTime})`,
          affectedMatches: [match],
          affectedTeams: [match.team1, match.team2],
          recommendation: `Cập nhật thời gian bắt đầu và kết thúc theo định dạng HH:MM.`,
          autoFixable: true,
          autoFixDescription: `Tự động sửa định dạng thời gian`,
        })
      }

      // Check if end time is before start time
      const startHour = Number.parseInt(startTimeParts[0])
      const startMinute = Number.parseInt(startTimeParts[1])
      const endHour = Number.parseInt(endTimeParts[0])
      const endMinute = Number.parseInt(endTimeParts[1])

      if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        issues.push({
          id: `invalid_time_range_${match.id}`,
          type: "invalid_date",
          severity: "high",
          title: `Thời gian kết thúc trước thời gian bắt đầu`,
          description: `Trận đấu ${match.team1.name} vs ${match.team2.name} có thời gian kết thúc (${match.endTime}) trước thời gian bắt đầu (${match.startTime})`,
          affectedMatches: [match],
          affectedTeams: [match.team1, match.team2],
          recommendation: `Điều chỉnh thời gian bắt đầu và kết thúc để đảm bảo thời gian kết thúc sau thời gian bắt đầu.`,
          autoFixable: true,
          autoFixDescription: `Tự động điều chỉnh thời gian kết thúc`,
        })
      }
    })
  }

  const countIssuesByType = (issues: ScheduleIssue[]): Record<IssueType, number> => {
    const result = {} as Record<IssueType, number>

    issues.forEach((issue) => {
      if (!result[issue.type]) {
        result[issue.type] = 0
      }
      result[issue.type]++
    })

    return result
  }

  const countIssuesBySeverity = (issues: ScheduleIssue[]): Record<IssueSeverity, number> => {
    const result = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    }

    issues.forEach((issue) => {
      result[issue.severity]++
    })

    return result
  }

  const getTeamsWithIssues = (issues: ScheduleIssue[]): Team[] => {
    const teamsMap = new Map<string, Team>()

    issues.forEach((issue) => {
      if (issue.affectedTeams) {
        issue.affectedTeams.forEach((team) => {
          teamsMap.set(team.id, team)
        })
      }
    })

    return Array.from(teamsMap.values())
  }

  const getDatesWithIssues = (issues: ScheduleIssue[]): string[] => {
    const datesSet = new Set<string>()

    issues.forEach((issue) => {
      issue.affectedMatches.forEach((match) => {
        datesSet.add(match.date.toISOString().split("T")[0])
      })
    })

    return Array.from(datesSet)
  }

  const calculateScheduleScore = (issues: ScheduleIssue[], totalMatches: number): number => {
    if (totalMatches === 0) return 100

    // Calculate penalty based on issues
    let penalty = 0
    issues.forEach((issue) => {
      switch (issue.severity) {
        case "critical":
          penalty += 20
          break
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

    return Math.max(0, 100 - penalty)
  }

  const generateSummary = (score: number, issues: ScheduleIssue[]): string => {
    if (issues.length === 0) {
      return "The schedule is already optimized and there are no issues detected."
    }

    if (score >= 80) {
      return "The schedule is good, but there are still some minor issues that can be improved."
    } else if (score >= 60) {
      return "The schedule has some issues that need to be resolved to ensure fairness and effectiveness."
    } else if (score >= 40) {
      return "The schedule has many serious issues that need to be adjusted before it can be used."
    } else {
      return "The schedule has many serious issues and needs to be thoroughly reconsidered."
    }
  }

  // UI helper functions
  const getIssueIcon = (type: IssueType) => {
    switch (type) {
      case "team_overload":
        return <Users className="h-5 w-5" />
      case "venue_conflict":
        return <X className="h-5 w-5" />
      case "rest_time":
        return <Clock className="h-5 w-5" />
      case "day_distribution":
        return <Calendar className="h-5 w-5" />
      case "missing_team":
        return <Users className="h-5 w-5" />
      case "invalid_date":
        return <Calendar className="h-5 w-5" />
      case "overlapping_matches":
        return <Layers className="h-5 w-5" />
      case "uneven_distribution":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getIssueTypeLabel = (type: IssueType): string => {
    switch (type) {
      case "team_overload":
        return "Quá tải đội"
      case "venue_conflict":
        return "Xung đột địa điểm"
      case "rest_time":
        return "Thời gian nghỉ"
      case "day_distribution":
        return "Phân bố ngày"
      case "missing_team":
        return "Thiếu đội"
      case "invalid_date":
        return "Ngày không hợp lệ"
      case "overlapping_matches":
        return "Trận đấu chồng chéo"
      case "uneven_distribution":
        return "Phân bố không đều"
      default:
        return "Khác"
    }
  }

  const getSeverityLabel = (severity: IssueSeverity): string => {
    switch (severity) {
      case "critical":
        return "Nghiêm trọng"
      case "high":
        return "Cao"
      case "medium":
        return "Trung bình"
      case "low":
        return "Thấp"
      default:
        return "Không xác định"
    }
  }

  const getSeverityColor = (severity: IssueSeverity) => {
    switch (severity) {
      case "critical":
        return "text-red-700 bg-red-100 hover:bg-red-200 border-red-200"
      case "high":
        return "text-orange-700 bg-orange-100 hover:bg-orange-200 border-orange-200"
      case "medium":
        return "text-amber-700 bg-amber-100 hover:bg-amber-200 border-amber-200"
      case "low":
        return "text-yellow-700 bg-yellow-100 hover:bg-yellow-200 border-yellow-200"
      default:
        return "text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-200"
    }
  }

  const getSeverityBadgeColor = (severity: IssueSeverity) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-amber-100"
    if (score >= 40) return "bg-orange-100"
    return "bg-red-100"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-6 w-6 text-green-600" />
    if (score >= 60) return <AlertCircle className="h-6 w-6 text-amber-600" />
    if (score >= 40) return <AlertCircle className="h-6 w-6 text-orange-600" />
    return <AlertTriangle className="h-6 w-6 text-red-600" />
  }

  const getFilteredIssues = () => {
    if (!analysis) return []

    return analysis.issues.filter((issue) => {
      const matchesSeverity = severityFilter === "all" || issue.severity === severityFilter
      const matchesType = typeFilter === "all" || issue.type === typeFilter
      return matchesSeverity && matchesType
    })
  }

  const handleFixIssue = async (issue: ScheduleIssue) => {
    if (!issue.autoFixable) return

    setFixingIssueId(issue.id)

    try {
      const matchIds = issue.affectedMatches.map((match) => match.id)
      const success = await onFixIssue(issue.id, matchIds, issue.type, {
        severity: issue.severity,
      })

      if (success) {
        // If successful, refresh the analysis
        if (onRefreshAnalysis) {
          onRefreshAnalysis()
        } else {
          analyzeSchedule()
        }
      }
    } catch (error) {
      console.error("Failed to fix issue:", error)
    } finally {
      setFixingIssueId(null)
    }
  }

  const toggleExpandIssue = (issueId: string) => {
    setExpandedIssues((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(issueId)) {
        newSet.delete(issueId)
      } else {
        newSet.add(issueId)
      }
      return newSet
    })
  }

  const expandAllIssues = () => {
    if (!analysis) return

    const allIssueIds = analysis.issues.map((issue) => issue.id)
    setExpandedIssues(new Set(allIssueIds))
  }

  const collapseAllIssues = () => {
    setExpandedIssues(new Set())
  }

  // Loading state
  if (isAnalyzing) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle>Đang phân tích lịch thi đấu</CardTitle>
          <CardDescription>Vui lòng đợi trong khi chúng tôi kiểm tra lịch thi đấu của bạn</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Đang kiểm tra các vấn đề tiềm ẩn...</p>
              <Progress value={45} className="w-64 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // No analysis results
  if (!analysis) {
    return null
  }

  // Perfect schedule - no issues
  if (analysis.issues.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
            <CardTitle>Perfect Schedule</CardTitle>
          </div>
          <CardDescription>No issues found in your tournament schedule</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                <span className="text-2xl font-bold text-green-600">100</span>
              </div>
              <div>
                <h4 className="text-lg font-semibold">Evaluation Score</h4>
                <p className="text-green-600">Your tournament schedule is optimized perfectly</p>
              </div>
            </div>
          </div>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle>Perfect!</AlertTitle>
            <AlertDescription>
              Your tournament schedule is optimized perfectly. All teams have appropriate rest days and matches are evenly
              distributed across days.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between">
          <div className="text-sm text-gray-500">{analysis.analyzedMatches} matches analyzed</div>
          <Button variant="outline" onClick={analyzeSchedule} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze again
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Schedule with issues
  return (
    <Card className="w-full">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {getScoreIcon(analysis.score)}
            <CardTitle className="ml-3">
              {analysis.score < 40
                ? "Your tournament schedule has critical issues"
                : analysis.score < 60
                  ? "Your tournament schedule needs significant improvement"
                  : analysis.score < 80
                    ? "Your tournament schedule needs improvement"
                    : "Your tournament schedule is good"}
            </CardTitle>
          </div>
          <Button variant="outline" onClick={analyzeSchedule} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze again
          </Button>
        </div>
        <CardDescription>Detected {analysis.issues.length} issues in your tournament schedule</CardDescription>
      </CardHeader>

      <div>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-2 border-b">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues ({analysis.issues.length})</TabsTrigger>
              <TabsTrigger value="suggestions">
                Suggestions ({analysis.issues.filter((i) => i.autoFixable).length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6 space-y-6">
            {/* Score card */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 border rounded-lg">
              <div className="flex flex-col items-center">
                <div
                  className={`w-24 h-24 rounded-full flex items-center justify-center ${getScoreBackground(analysis.score)}`}
                >
                  <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>{analysis.score}</span>
                </div>
                <span className="mt-2 font-medium">Evaluation Score</span>
              </div>

              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">Analysis Summary</h4>
                <p className="text-gray-700 mb-4">{analysis.summary}</p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-red-800">Critical</div>
                      <div className="text-xl font-bold text-red-700">{analysis.issuesBySeverity.critical}</div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-orange-800">High</div>
                      <div className="text-xl font-bold text-orange-700">{analysis.issuesBySeverity.high}</div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-amber-800">Medium</div>
                      <div className="text-xl font-bold text-amber-700">{analysis.issuesBySeverity.medium}</div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
                    <Zap className="h-5 w-5 text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-blue-800">Auto Fixable</div>
                      <div className="text-xl font-bold text-blue-700">
                        {analysis.issues.filter((i) => i.autoFixable).length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical issues section */}
            {analysis.issuesBySeverity.critical > 0 && (
              <div className="border border-red-200 rounded-lg overflow-hidden">
                <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                  <h4 className="font-semibold text-red-800 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Critical issues need to be resolved immediately
                  </h4>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {analysis.issues
                      .filter((issue) => issue.severity === "critical")
                      .slice(0, 2)
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              {getIssueIcon(issue.type)}
                              <p className="font-medium text-gray-800 ml-2">{issue.title}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-7">{issue.description}</p>
                          </div>
                          {issue.autoFixable && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleFixIssue(issue)}
                              disabled={fixingIssueId === issue.id}
                              className="ml-4 whitespace-nowrap"
                            >
                              {fixingIssueId === issue.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                  Fixing...
                                </>
                              ) : (
                                <>
                                  <Zap className="h-4 w-4 mr-1" />
                                  Fix now
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      ))}

                    {analysis.issuesBySeverity.critical > 2 && (
                      <Button
                        variant="link"
                        className="text-red-600 p-0 h-auto"
                        onClick={() => {
                          setActiveTab("issues")
                          setSeverityFilter("critical")
                        }}
                      >
                        See all {analysis.issuesBySeverity.critical} critical issues
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Issue types breakdown */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b">
                <h4 className="font-semibold flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Issue types breakdown
                </h4>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(analysis.issuesByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        {getIssueIcon(type as IssueType)}
                        <span className="ml-2 font-medium">{getIssueTypeLabel(type as IssueType)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold">{count}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => {
                            setActiveTab("issues")
                            setTypeFilter(type as IssueType)
                          }}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Auto-fixable issues */}
            {analysis.issues.filter((i) => i.autoFixable).length > 0 && (
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Auto-fixable issues
                  </h4>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {analysis.issues
                      .filter((issue) => issue.autoFixable)
                      .slice(0, 3)
                      .map((issue) => (
                        <div
                          key={issue.id}
                          className="flex items-start border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              {getIssueIcon(issue.type)}
                              <p className="font-medium text-gray-800 ml-2">{issue.title}</p>
                              <Badge variant="outline" className={`ml-2 ${getSeverityBadgeColor(issue.severity)}`}>
                                {getSeverityLabel(issue.severity)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1 ml-7">{issue.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleFixIssue(issue)}
                            disabled={fixingIssueId === issue.id}
                            className={`ml-4 whitespace-nowrap ${getSeverityColor(issue.severity)}`}
                          >
                            {fixingIssueId === issue.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                                Fixing...
                              </>
                            ) : (
                              <>
                                <Zap className="h-4 w-4 mr-1" />
                                Fix now
                              </>
                            )}
                          </Button>
                        </div>
                      ))}

                    {analysis.issues.filter((i) => i.autoFixable).length > 3 && (
                      <Button
                        variant="link"
                        className="text-blue-600 p-0 h-auto"
                        onClick={() => {
                          setActiveTab("suggestions")
                        }}
                      >
                        Xem tất cả {analysis.issues.filter((i) => i.autoFixable).length} vấn đề có thể sửa tự động
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Select value={severityFilter} onValueChange={(value) => setSeverityFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severity</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {Object.keys(analysis.issuesByType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getIssueTypeLabel(type as IssueType)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={expandAllIssues}>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Expand all
                </Button>
                <Button variant="ghost" size="sm" onClick={collapseAllIssues}>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Collapse all
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {getFilteredIssues().length === 0 ? (
                <div className="text-center py-8 text-gray-500">No issues found matching the filter</div>
              ) : (
                <Accordion
                  type="multiple"
                  value={Array.from(expandedIssues)}
                  onValueChange={(values) => setExpandedIssues(new Set(values))}
                >
                  {getFilteredIssues().map((issue) => (
                    <AccordionItem key={issue.id} value={issue.id} className="border rounded-lg mb-3 overflow-hidden">
                      <AccordionTrigger className={`px-4 py-3 ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-center text-left">
                          {getIssueIcon(issue.type)}
                          <span className="ml-2 font-medium">{issue.title}</span>
                          <Badge variant="outline" className={`ml-2 ${getSeverityBadgeColor(issue.severity)}`}>
                            {getSeverityLabel(issue.severity)}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 border-t">
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-1">Description:</h5>
                            <p className="text-gray-700">{issue.description}</p>
                          </div>

                          <div>
                            <h5 className="font-medium mb-1">Affected matches:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {issue.affectedMatches.map((match, idx) => (
                                <li key={idx} className="text-gray-700">
                                  {match.team1.name} vs {match.team2.name} ({match.date.toLocaleDateString("vi-VN")}{" "}
                                  {match.startTime}-{match.endTime})
                                </li>
                              ))}
                            </ul>
                          </div>

                          {issue.affectedTeams && issue.affectedTeams.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-1">Affected teams:</h5>
                              <ul className="list-disc pl-5 space-y-1">
                                {issue.affectedTeams.map((team, idx) => (
                                  <li key={idx} className="text-gray-700">
                                    {team.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h5 className="font-medium text-blue-800 mb-1">Recommendation:</h5>
                            <p className="text-blue-700">{issue.recommendation}</p>
                          </div>

                          <div className="flex justify-end">
                            {issue.autoFixable ? (
                              <Button
                                onClick={() => handleFixIssue(issue)}
                                disabled={fixingIssueId === issue.id}
                                className={getSeverityColor(issue.severity)}
                              >
                                {fixingIssueId === issue.id ? (
                                  <>
                                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                    Fixing...
                                  </>
                                ) : (
                                  <>
                                    <Zap className="h-4 w-4 mr-2" />
                                    {issue.autoFixDescription || "Auto fix"}
                                  </>
                                )}
                              </Button>
                            ) : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" disabled>
                                      <Info className="h-4 w-4 mr-2" />
                                      Need manual fix
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>This issue needs to be fixed manually according to the recommendation</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="p-6">
            <div className="mb-4">
              <h4 className="text-lg font-semibold mb-2">Auto fix suggestions</h4>
              <p className="text-gray-600">
                The following issues can be automatically fixed. Click on the "Auto fix" button to apply the suggestion.
              </p>
            </div>

            <div className="space-y-4">
              {analysis.issues.filter((i) => i.autoFixable).length === 0 ? (
                <div className="text-center py-8 text-gray-500">No issues can be automatically fixed</div>
              ) : (
                analysis.issues
                  .filter((issue) => issue.autoFixable)
                  .map((issue) => (
                    <Card key={issue.id} className="overflow-hidden">
                      <CardHeader className={`pb-3 ${getSeverityColor(issue.severity)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {getIssueIcon(issue.type)}
                            <CardTitle className="text-base ml-2">{issue.title}</CardTitle>
                          </div>
                          <Badge variant="outline" className={getSeverityBadgeColor(issue.severity)}>
                            {getSeverityLabel(issue.severity)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-gray-500">Issue:</h5>
                            <p className="text-gray-700">{issue.description}</p>
                          </div>

                          <div>
                            <h5 className="text-sm font-medium text-gray-500">Affected matches:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {issue.affectedMatches.slice(0, 2).map((match, idx) => (
                                <li key={idx} className="text-gray-700">
                                  {match.team1.name} vs {match.team2.name} ({match.date.toLocaleDateString("vi-VN")}{" "}
                                  {match.startTime}-{match.endTime})
                                </li>
                              ))}
                              {issue.affectedMatches.length > 2 && (
                                <li className="text-gray-500 italic">
                                  ...and {issue.affectedMatches.length - 2} more matches
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-start">
                              <Zap className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                              <div>
                                <h6 className="font-medium text-blue-800 mb-1">Auto fix suggestion:</h6>
                                <p className="text-blue-700">{issue.autoFixDescription}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-3 flex justify-end">
                        <Button
                          onClick={() => handleFixIssue(issue)}
                          disabled={fixingIssueId === issue.id}
                          className={getSeverityColor(issue.severity)}
                        >
                          {fixingIssueId === issue.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Fixing...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4 mr-2" />
                              Auto fix
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CardFooter className="border-t pt-4 flex justify-between">
        <div className="text-sm text-gray-500">Analyzed {analysis.analyzedMatches} matches</div>
        <div className="flex items-center">
          <span className={`text-sm font-medium ${getScoreColor(analysis.score)}`}>
            Score: {analysis.score}/100
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
