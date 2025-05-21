"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, Calendar, Clock, FileText, RefreshCw, Share2, Zap, Check, Info } from "lucide-react"
import PageHeader from "@/components/ui-elements/PageHeader"
import ScheduleAnalysisDashboard from "@/components/tournament-schedule/ScheduleAnalysisDashboard"
import type { Match, Team } from "@/types/tournament"

// Mock data for demonstration
const mockMatches: Match[] = [
  {
    id: "match1",
    date: new Date("2025-05-20"),
    startTime: "09:00",
    endTime: "10:00",
    team1: { id: "team1", name: "FC Barcelona" } as Team,
    team2: { id: "team2", name: "Real Madrid" } as Team,
    venue: "Camp Nou",
    completed: false,
  },
  {
    id: "match2",
    date: new Date("2025-05-20"),
    startTime: "10:30",
    endTime: "11:30",
    team1: { id: "team1", name: "FC Barcelona" } as Team,
    team2: { id: "team3", name: "Atletico Madrid" } as Team,
    venue: "Camp Nou",
    completed: false,
  },
  {
    id: "match3",
    date: new Date("2025-05-20"),
    startTime: "13:00",
    endTime: "14:00",
    team1: { id: "team4", name: "Valencia" } as Team,
    team2: { id: "team5", name: "Sevilla" } as Team,
    venue: "Mestalla",
    completed: false,
  },
  {
    id: "match4",
    date: new Date("2025-05-21"),
    startTime: "09:00",
    endTime: "10:00",
    team1: { id: "team6", name: "Athletic Bilbao" } as Team,
    team2: { id: "team7", name: "Real Sociedad" } as Team,
    venue: "San Mamés",
    completed: false,
  },
  {
    id: "match5",
    date: new Date("2025-05-21"),
    startTime: "11:00",
    endTime: "12:00",
    team1: { id: "team8", name: "Villarreal" } as Team,
    team2: { id: "team9", name: "Real Betis" } as Team,
    venue: "El Madrigal",
    completed: false,
  },
  {
    id: "match6",
    date: new Date("2025-05-22"),
    startTime: "09:00",
    endTime: "10:00",
    team1: { id: "team1", name: "FC Barcelona" } as Team,
    team2: { id: "team10", name: "Espanyol" } as Team,
    venue: "Camp Nou",
    completed: false,
  },
  {
    id: "match7",
    date: new Date("2025-05-22"),
    startTime: "09:00",
    endTime: "10:00", // Invalid time (end before start)
    team1: { id: "team2", name: "Real Madrid" } as Team,
    team2: { id: "team3", name: "Atletico Madrid" } as Team,
    venue: "Santiago Bernabéu",
    completed: false,
  },
]

export default function ScheduleAnalysisPage() {
  const params = useParams()
  const tournamentId = params?.id as string

  const [matches, setMatches] = useState<Match[]>(mockMatches)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("analysis")

  // In a real app, you would fetch the matches from an API
  useEffect(() => {
    // Simulating API call
    setIsLoading(true)
    setTimeout(() => {
      setMatches(mockMatches)
      setIsLoading(false)
    }, 1000)
  }, [tournamentId])

  const handleFixIssue = async (issueId: string, matchIds: string[], action: string, params?: any) => {
    // Simulate API call to fix the issue
    setIsLoading(true)

    try {
      // Wait for 1 second to simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update matches based on the issue type
      const updatedMatches = [...matches]

      if (action === "team_overload") {
        // Find a match to move to another day
        const matchToMove = updatedMatches.find((m) => m.id === matchIds[0])
        if (matchToMove) {
          // Move to the next day
          const newDate = new Date(matchToMove.date)
          newDate.setDate(newDate.getDate() + 1)
          matchToMove.date = newDate
        }
      } else if (action === "rest_time") {
        // Adjust the start time of the second match
        const matchToAdjust = updatedMatches.find((m) => m.id === matchIds[1])
        if (matchToAdjust) {
          // Add 3 hours to the start time
          const [hours, minutes] = matchToAdjust.startTime.split(":").map(Number)
          const newHours = hours + 3
          matchToAdjust.startTime = `${String(newHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`

          // Adjust end time accordingly
          const [endHours, endMinutes] = matchToAdjust.endTime.split(":").map(Number)
          const newEndHours = endHours + 3
          matchToAdjust.endTime = `${String(newEndHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`
        }
      } else if (action === "venue_conflict") {
        // Adjust the start time of the second match
        const matchToAdjust = updatedMatches.find((m) => m.id === matchIds[1])
        if (matchToAdjust) {
          // Find the first match
          const firstMatch = updatedMatches.find((m) => m.id === matchIds[0])
          if (firstMatch) {
            // Set start time to 30 minutes after the first match ends
            const [hours, minutes] = firstMatch.endTime.split(":").map(Number)
            let newHours = hours
            let newMinutes = minutes + 30

            if (newMinutes >= 60) {
              newHours += 1
              newMinutes -= 60
            }

            matchToAdjust.startTime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`

            // Adjust end time to be 1 hour after new start time
            const endHours = newHours + 1
            matchToAdjust.endTime = `${String(endHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`
          }
        }
      } else if (action === "invalid_date") {
        // Fix invalid time format or range
        const matchToFix = updatedMatches.find((m) => m.id === matchIds[0])
        if (matchToFix) {
          // If end time is before start time, set end time to 1 hour after start time
          const [startHours, startMinutes] = matchToFix.startTime.split(":").map(Number)
          const [endHours, endMinutes] = matchToFix.endTime.split(":").map(Number)

          if (endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)) {
            const newEndHours = startHours + 1
            matchToFix.endTime = `${String(newEndHours).padStart(2, "0")}:${String(startMinutes).padStart(2, "0")}`
          }
        }
      }

      setMatches(updatedMatches)
      return true
    } catch (error) {
      console.error("Error fixing issue:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefreshAnalysis = () => {
    // In a real app, you would fetch the latest data
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader title="Phân tích lịch thi đấu" description="Đang tải dữ liệu..." />
        <div className="mt-6 flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Phân tích lịch thi đấu"
        description="Kiểm tra và tối ưu hóa lịch thi đấu của giải đấu"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
            <Button variant="outline" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Chia sẻ
            </Button>
            <Button className="flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Tối ưu hóa tự động
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        <Tabs defaultValue="analysis" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="analysis">Phân tích</TabsTrigger>
            <TabsTrigger value="history">Lịch sử thay đổi</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 gap-6">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Lưu ý quan trọng</AlertTitle>
                <AlertDescription>
                  The schedule analysis tool helps identify and fix potential issues. Please carefully consider the
                  recommendations before applying them.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tổng số trận đấu:</span>
                        <span className="font-medium">{matches.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số ngày thi đấu:</span>
                        <span className="font-medium">
                          {new Set(matches.map((m) => m.date.toISOString().split("T")[0])).size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số đội tham gia:</span>
                        <span className="font-medium">
                          {new Set([...matches.map((m) => m.team1.id), ...matches.map((m) => m.team2.id)]).size}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Số địa điểm thi đấu:</span>
                        <span className="font-medium">{new Set(matches.map((m) => m.venue).filter(Boolean)).size}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Thời gian thi đấu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày bắt đầu:</span>
                        <span className="font-medium">
                          {new Date(Math.min(...matches.map((m) => m.date.getTime()))).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày kết thúc:</span>
                        <span className="font-medium">
                          {new Date(Math.max(...matches.map((m) => m.date.getTime()))).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Thời gian bắt đầu sớm nhất:</span>
                        <span className="font-medium">
                          {matches.reduce(
                            (earliest, match) => (match.startTime < earliest ? match.startTime : earliest),
                            "23:59",
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Thời gian kết thúc muộn nhất:</span>
                        <span className="font-medium">
                          {matches.reduce(
                            (latest, match) => (match.endTime > latest ? match.endTime : latest),
                            "00:00",
                          )}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Trạng thái phân tích
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lần phân tích gần nhất:</span>
                        <span className="font-medium">{new Date().toLocaleString("vi-VN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className="font-medium text-amber-600">Cần cải thiện</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vấn đề phát hiện:</span>
                        <span className="font-medium">5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vấn đề đã sửa:</span>
                        <span className="font-medium">0</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <ScheduleAnalysisDashboard
                matches={matches}
                onFixIssue={handleFixIssue}
                onRefreshAnalysis={handleRefreshAnalysis}
              />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Lịch sử thay đổi</CardTitle>
                <CardDescription>Xem lại các thay đổi đã được thực hiện đối với lịch thi đấu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 pb-4 border-b">
                    <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Thay đổi thời gian trận đấu</h4>
                        <span className="text-sm text-gray-500">19/05/2025, 10:30</span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        Điều chỉnh thời gian bắt đầu trận đấu Real Madrid vs Atletico Madrid từ 11:00 sang 12:30
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="bg-green-50 text-green-700 p-2 rounded-full border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Đã sửa tự động
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 pb-4 border-b">
                    <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Thay đổi ngày thi đấu</h4>
                        <span className="text-sm text-gray-500">18/05/2025, 15:45</span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        Di chuyển trận đấu FC Barcelona vs Espanyol sang ngày 23/05/2025
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="bg-blue-50 text-blue-700 p-2 rounded-full border-blue-200">
                          <Info className="h-3 w-3 mr-1" />
                          Thay đổi thủ công
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 text-red-700 p-2 rounded-full">
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">Sửa lỗi thời gian kết thúc</h4>
                        <span className="text-sm text-gray-500">17/05/2025, 09:15</span>
                      </div>
                      <p className="text-gray-600 mt-1">
                        Sửa lỗi thời gian kết thúc trước thời gian bắt đầu cho trận đấu Real Madrid vs Atletico Madrid
                      </p>
                      <div className="mt-2 flex items-center">
                        <div className="bg-green-50 text-green-700 p-2 rounded-full border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Đã sửa tự động
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt phân tích</CardTitle>
                <CardDescription>Tùy chỉnh các thông số phân tích lịch thi đấu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Thời gian nghỉ tối thiểu</h4>
                    <p className="text-gray-600 mb-2">
                      Đặt thời gian nghỉ tối thiểu giữa các trận đấu cho cùng một đội
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 w-20"
                        defaultValue={3}
                        min={1}
                        max={24}
                      />
                      <span>giờ</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Số trận đấu tối đa trong một ngày</h4>
                    <p className="text-gray-600 mb-2">
                      Đặt số trận đấu tối đa mà một đội có thể tham gia trong một ngày
                    </p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 w-20"
                        defaultValue={1}
                        min={1}
                        max={5}
                      />
                      <span>trận</span>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Phân bổ trận đấu</h4>
                    <p className="text-gray-600 mb-2">
                      Cài đặt mức độ chênh lệch cho phép giữa số trận đấu trong các ngày
                    </p>
                    <div className="flex items-center space-x-2">
                      <select className="border rounded-md px-3 py-2">
                        <option value="strict">Nghiêm ngặt (±1 trận)</option>
                        <option value="moderate" defaultChecked>
                          Vừa phải (±2 trận)
                        </option>
                        <option value="flexible">Linh hoạt (±3 trận)</option>
                      </select>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Tự động sửa lỗi</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="autofix-critical" defaultChecked />
                        <label htmlFor="autofix-critical">Tự động sửa lỗi nghiêm trọng</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="autofix-high" defaultChecked />
                        <label htmlFor="autofix-high">Tự động sửa lỗi mức độ cao</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="autofix-medium" />
                        <label htmlFor="autofix-medium">Tự động sửa lỗi mức độ trung bình</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="autofix-low" />
                        <label htmlFor="autofix-low">Tự động sửa lỗi mức độ thấp</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
