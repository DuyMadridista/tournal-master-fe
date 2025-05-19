"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, Clock, Users, MapPin, ArrowRight, Zap, X, CheckCircle } from "lucide-react"
import type { Match } from "@/types/tournament"

interface MatchConflictVisualizerProps {
  matches: Match[]
  date: Date
  onFixConflict: (matchId: string, newStartTime: string, newEndTime: string) => void
}

export default function MatchConflictVisualizer({ matches, date, onFixConflict }: MatchConflictVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [conflicts, setConflicts] = useState<{ match1: Match; match2: Match; type: string }[]>([])
  const [activeView, setActiveView] = useState<"timeline" | "list">("timeline")

  // Filter matches for the selected date
  const dateMatches = matches.filter(
    (match) => match.date.toISOString().split("T")[0] === date.toISOString().split("T")[0],
  )

  // Find conflicts
  useEffect(() => {
    const newConflicts: { match1: Match; match2: Match; type: string }[] = []

    // Check for team conflicts (same team playing in overlapping matches)
    for (let i = 0; i < dateMatches.length; i++) {
      for (let j = i + 1; j < dateMatches.length; j++) {
        const match1 = dateMatches[i]
        const match2 = dateMatches[j]

        // Check if matches have overlapping times
        const match1Start = timeToMinutes(match1.startTime)
        const match1End = timeToMinutes(match1.endTime)
        const match2Start = timeToMinutes(match2.startTime)
        const match2End = timeToMinutes(match2.endTime)

        const timeOverlap =
          (match1Start <= match2Start && match2Start < match1End) ||
          (match2Start <= match1Start && match1Start < match2End)

        // Check for team conflicts
        const team1InBoth = match1.team1.id === match2.team1.id || match1.team1.id === match2.team2.id

        const team2InBoth = match1.team2.id === match2.team1.id || match1.team2.id === match2.team2.id

        if (timeOverlap && (team1InBoth || team2InBoth)) {
          newConflicts.push({
            match1,
            match2,
            type: "team_conflict",
          })
        }

        // Check for venue conflicts
        if (timeOverlap && match1.venue && match2.venue && match1.venue === match2.venue) {
          newConflicts.push({
            match1,
            match2,
            type: "venue_conflict",
          })
        }
      }
    }

    setConflicts(newConflicts)
  }, [dateMatches])

  // Draw timeline visualization
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Define timeline parameters
    const timelineY = 50
    const timelineHeight = canvasHeight - 100
    const timelineStart = 6 * 60 // 6:00 AM in minutes
    const timelineEnd = 22 * 60 // 10:00 PM in minutes
    const timelineRange = timelineEnd - timelineStart

    // Draw timeline
    ctx.beginPath()
    ctx.moveTo(50, timelineY)
    ctx.lineTo(50, timelineY + timelineHeight)
    ctx.strokeStyle = "#CBD5E1" // slate-300
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw hour markers
    ctx.textAlign = "right"
    ctx.font = "12px sans-serif"
    ctx.fillStyle = "#64748B" // slate-500

    for (let hour = Math.floor(timelineStart / 60); hour <= Math.ceil(timelineEnd / 60); hour++) {
      const y = timelineY + ((hour * 60 - timelineStart) / timelineRange) * timelineHeight

      ctx.beginPath()
      ctx.moveTo(45, y)
      ctx.lineTo(50, y)
      ctx.stroke()

      ctx.fillText(`${hour}:00`, 40, y + 4)
    }

    // Group matches by team
    const matchesByTeam: Record<string, Match[]> = {}

    dateMatches.forEach((match) => {
      if (!matchesByTeam[match.team1.id]) matchesByTeam[match.team1.id] = []
      if (!matchesByTeam[match.team2.id]) matchesByTeam[match.team2.id] = []

      matchesByTeam[match.team1.id].push(match)
      matchesByTeam[match.team2.id].push(match)
    })

    // Group matches by venue
    const matchesByVenue: Record<string, Match[]> = {}

    dateMatches.forEach((match) => {
      if (match.venue) {
        if (!matchesByVenue[match.venue]) matchesByVenue[match.venue] = []
        matchesByVenue[match.venue].push(match)
      }
    })

    // Draw matches
    const matchWidth = 200
    const matchHeight = 40
    const matchGap = 10
    let xOffset = 70

    // Draw team matches
    Object.entries(matchesByTeam).forEach(([teamId, teamMatches], teamIndex) => {
      if (teamMatches.length <= 1) return // Skip teams with only one match

      const team = teamMatches[0].team1.id === teamId ? teamMatches[0].team1 : teamMatches[0].team2

      // Draw team label
      ctx.fillStyle = "#1E293B" // slate-800
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(team.name, xOffset, 30)

      // Draw matches for this team
      teamMatches.forEach((match, matchIndex) => {
        const startMinutes = timeToMinutes(match.startTime)
        const endMinutes = timeToMinutes(match.endTime)

        // Skip invalid times
        if (startMinutes < timelineStart || endMinutes > timelineEnd || startMinutes >= endMinutes) return

        const startY = timelineY + ((startMinutes - timelineStart) / timelineRange) * timelineHeight
        const endY = timelineY + ((endMinutes - timelineStart) / timelineRange) * timelineHeight
        const matchBoxHeight = endY - startY

        // Determine if this match has conflicts
        const hasConflict = conflicts.some(
          (conflict) => conflict.match1.id === match.id || conflict.match2.id === match.id,
        )

        // Draw match box
        ctx.fillStyle = hasConflict ? "rgba(239, 68, 68, 0.2)" : "rgba(59, 130, 246, 0.2)" // red-500 or blue-500 with opacity
        ctx.fillRect(xOffset, startY, matchWidth, matchBoxHeight)

        // Draw match border
        ctx.strokeStyle = hasConflict ? "#EF4444" : "#3B82F6" // red-500 or blue-500
        ctx.lineWidth = hasConflict ? 2 : 1
        ctx.strokeRect(xOffset, startY, matchWidth, matchBoxHeight)

        // Draw match text
        ctx.fillStyle = "#1E293B" // slate-800
        ctx.font = "12px sans-serif"
        ctx.textAlign = "left"

        const opponent = match.team1.id === teamId ? match.team2 : match.team1
        ctx.fillText(`vs ${opponent.name}`, xOffset + 10, startY + 20)
        ctx.fillText(`${match.startTime} - ${match.endTime}`, xOffset + 10, startY + 36)

        // Draw conflict indicator
        if (hasConflict) {
          ctx.fillStyle = "#EF4444" // red-500
          ctx.beginPath()
          ctx.arc(xOffset + matchWidth - 15, startY + 15, 8, 0, 2 * Math.PI)
          ctx.fill()

          ctx.fillStyle = "#FFFFFF"
          ctx.font = "bold 12px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("!", xOffset + matchWidth - 15, startY + 19)
        }

        // Add click handler area
        canvas.onclick = (e) => {
          const rect = canvas.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          // Check if click is within this match box
          if (x >= xOffset && x <= xOffset + matchWidth && y >= startY && y <= startY + matchBoxHeight) {
            setSelectedMatch(match)
          } else {
            setSelectedMatch(null)
          }
        }
      })

      // Move to next team column
      xOffset += matchWidth + matchGap
    })
  }, [dateMatches, conflicts, selectedMatch])

  // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Helper function to get conflict type label
  const getConflictTypeLabel = (type: string): string => {
    switch (type) {
      case "team_conflict":
        return "Xung đột đội"
      case "venue_conflict":
        return "Xung đột địa điểm"
      default:
        return "Xung đột"
    }
  }

  // Helper function to get conflict type icon
  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case "team_conflict":
        return <Users className="h-4 w-4" />
      case "venue_conflict":
        return <MapPin className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  // Helper function to suggest a new time for a match
  const suggestNewTime = (match: Match, conflictingMatch: Match): { startTime: string; endTime: string } => {
    // Get end time of conflicting match
    const [hours, minutes] = conflictingMatch.endTime.split(":").map(Number)

    // Add 30 minutes buffer
    let newHours = hours
    let newMinutes = minutes + 30

    if (newMinutes >= 60) {
      newHours += 1
      newMinutes -= 60
    }

    const suggestedStartTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`

    // Calculate end time (1 hour after start)
    const endHours = newHours + 1
    const suggestedEndTime = `${String(endHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`

    return {
      startTime: suggestedStartTime,
      endTime: suggestedEndTime,
    }
  }

  // Handle fix conflict
  const handleFixConflict = (match: Match, conflictingMatch: Match) => {
    const { startTime, endTime } = suggestNewTime(match, conflictingMatch)
    onFixConflict(match.id, startTime, endTime)
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Trực quan hóa xung đột lịch thi đấu</CardTitle>
            <CardDescription>
              Ngày: {date.toLocaleDateString("vi-VN")} - {dateMatches.length} trận đấu
            </CardDescription>
          </div>
          <div>
            <Tabs value={activeView} onValueChange={(value) => setActiveView(value as "timeline" | "list")}>
              <TabsList>
                <TabsTrigger value="timeline">Dòng thời gian</TabsTrigger>
                <TabsTrigger value="list">Danh sách</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {conflicts.length > 0 && (
          <div className="mb-4">
            <div className="bg-red-50 border-red-200 rounded-lg p-4">
              <AlertTriangle className="h-4 w-4 text-red-600 inline-block mr-2" />
              <span className="font-medium text-red-800">Phát hiện xung đột!</span>
              <p className="text-red-700 mt-2">
                Có {conflicts.length} xung đột lịch thi đấu cần được giải quyết cho ngày{" "}
                {date.toLocaleDateString("vi-VN")}.
              </p>
            </div>
          </div>
        )}

        {activeView === "timeline" ? (
          <div className="relative">
            <canvas ref={canvasRef} width={1000} height={600} className="w-full h-[500px] border rounded-lg" />

            {selectedMatch && (
              <div className="absolute top-4 right-4 w-72 bg-white border rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">Chi tiết trận đấu</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedMatch(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Đội:</span>
                    <div className="font-medium">
                      {selectedMatch.team1.name} vs {selectedMatch.team2.name}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Thời gian:</span>
                    <div className="font-medium">
                      {selectedMatch.startTime} - {selectedMatch.endTime}
                    </div>
                  </div>
                  {selectedMatch.venue && (
                    <div>
                      <span className="text-sm text-gray-500">Địa điểm:</span>
                      <div className="font-medium">{selectedMatch.venue}</div>
                    </div>
                  )}

                  {conflicts.some((c) => c.match1.id === selectedMatch.id || c.match2.id === selectedMatch.id) && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-red-600 mb-1">Xung đột:</div>
                      {conflicts
                        .filter((c) => c.match1.id === selectedMatch.id || c.match2.id === selectedMatch.id)
                        .map((conflict, index) => {
                          const conflictingMatch =
                            conflict.match1.id === selectedMatch.id ? conflict.match2 : conflict.match1

                          return (
                            <div key={index} className="bg-red-50 border border-red-200 rounded-md p-2 mb-2">
                              <div className="flex items-center">
                                {getConflictTypeIcon(conflict.type)}
                                <span className="ml-1 text-sm font-medium text-red-700">
                                  {getConflictTypeLabel(conflict.type)}
                                </span>
                              </div>
                              <p className="text-sm text-red-600 mt-1">
                                Xung đột với: {conflictingMatch.team1.name} vs {conflictingMatch.team2.name}(
                                {conflictingMatch.startTime} - {conflictingMatch.endTime})
                              </p>
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-full"
                                  onClick={() => handleFixConflict(selectedMatch, conflictingMatch)}
                                >
                                  <Zap className="h-3 w-3 mr-1" />
                                  Sửa xung đột
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {dateMatches.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Không có trận đấu nào vào ngày này</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {conflicts.length > 0 ? (
              <>
                <h4 className="font-medium text-lg">Danh sách xung đột</h4>
                <div className="space-y-3">
                  {conflicts.map((conflict, index) => (
                    <div key={index} className="border rounded-md p-4 bg-red-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {getConflictTypeIcon(conflict.type)}
                          <span className="ml-2 text-sm font-medium text-red-800">
                            {getConflictTypeLabel(conflict.type)}
                          </span>
                        </div>
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Cần giải quyết
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-1">Trận đấu 1:</h5>
                          <p>
                            {conflict.match1.team1.name} vs {conflict.match1.team2.name}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {conflict.match1.startTime} - {conflict.match1.endTime}
                            </span>
                          </div>
                          {conflict.match1.venue && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{conflict.match1.venue}</span>
                            </div>
                          )}
                        </div>

                        <div className="border rounded-md p-3">
                          <h5 className="font-medium mb-1">Trận đấu 2:</h5>
                          <p>
                            {conflict.match2.team1.name} vs {conflict.match2.team2.name}
                          </p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              {conflict.match2.startTime} - {conflict.match2.endTime}
                            </span>
                          </div>
                          {conflict.match2.venue && (
                            <div className="flex items-center mt-1 text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{conflict.match2.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                        <h5 className="font-medium text-blue-800 mb-1 flex items-center">
                          <Zap className="h-4 w-4 mr-1" />
                          Đề xuất giải pháp:
                        </h5>
                        <p className="text-blue-700">
                          Di chuyển trận đấu {conflict.match2.team1.name} vs {conflict.match2.team2.name} đến thời gian{" "}
                          {suggestNewTime(conflict.match2, conflict.match1).startTime} -{" "}
                          {suggestNewTime(conflict.match2, conflict.match1).endTime}
                        </p>

                        <div className="mt-3 flex justify-end">
                          <Button
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
                            onClick={() => handleFixConflict(conflict.match2, conflict.match1)}
                          >
                            <ArrowRight className="h-4 w-4 mr-1" />
                            Áp dụng đề xuất
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-green-700">Không phát hiện xung đột</h4>
                <p className="text-gray-600 mt-2">
                  Lịch thi đấu cho ngày {date.toLocaleDateString("vi-VN")} không có xung đột nào.
                </p>
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-medium text-lg mb-3">Tất cả trận đấu trong ngày</h4>
              <div className="space-y-2">
                {dateMatches.map((match, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-md ${
                      conflicts.some((c) => c.match1.id === match.id || c.match2.id === match.id)
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {match.team1.name} vs {match.team2.name}
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {match.startTime} - {match.endTime}
                          </span>
                          {match.venue && (
                            <>
                              <span className="mx-2">•</span>
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{match.venue}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {conflicts.some((c) => c.match1.id === match.id || c.match2.id === match.id) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Trận đấu có xung đột</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
