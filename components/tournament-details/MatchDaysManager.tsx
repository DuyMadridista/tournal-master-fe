"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Calendar, Plus, Save, X, Check, Info, AlertTriangle } from "lucide-react"
import { useDataFetching } from "../../context/DataFetchingContext"
import axios from "axios"

interface MatchDay {
  id: string
  date: Date
  name: string
  isActive: boolean
  notes?: string
}

interface MatchDaysManagerProps {
  startDate: Date
  endDate: Date
  onMatchDaysChange?: (matchDays: MatchDay[]) => void
  initialMatchDays?: MatchDay[]
  tournamentId?: string
}

export default function MatchDaysManager({
  startDate,
  endDate,
  onMatchDaysChange,
  initialMatchDays = [],
  tournamentId,
}: MatchDaysManagerProps) {
  const [matchDays, setMatchDays] = useState<MatchDay[]>(initialMatchDays)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newMatchDay, setNewMatchDay] = useState<Partial<MatchDay>>({
    date: new Date(),
    name: "",
    isActive: true,
  })
  const [expandedDay, setExpandedDay] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const { simulateFetch, isLoading } = useDataFetching()

  const effectiveTournamentId = tournamentId 

  // Generate suggested match days when start/end dates change
  useEffect(() => {
    if (matchDays.length === 0) {
      generateSuggestedMatchDays()
    }
  }, [startDate, endDate])

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const formatDateShort = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const generateSuggestedMatchDays = async () => {
    try {
      // Generate match days for weekends (Saturday and Sunday)
      const suggestedDays: MatchDay[] = []
      const currentDate = new Date(startDate)

      while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay()

        // If it's Saturday (6) or Sunday (0)
        if (dayOfWeek === 6 || dayOfWeek === 0) {
          const matchDayName = dayOfWeek === 6 ? "Match Day (Saturday)" : "Match Day (Sunday)"

          suggestedDays.push({
            id: `match-day-${suggestedDays.length + 1}`,
            date: new Date(currentDate),
            name: matchDayName,
            isActive: true,
          })
        }

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Simulate API call for UI feedback
      const result = await simulateFetch(suggestedDays, 1000)
      setMatchDays(result)

      // Update event dates on the server
      await updateEventDates(result)

      if (onMatchDaysChange) {
        onMatchDaysChange(result)
      }
    } catch (error) {
      console.error("Failed to generate match days:", error)
    }
  }

  // Function to update event dates on the server
  const updateEventDates = async (updatedMatchDays: MatchDay[]) => {
    if (!effectiveTournamentId) {
      console.error("Tournament ID is not available")
      return
    }

    try {
      setApiError(null)
      // Extract unique dates from match days and format them as YYYY-MM-DD
      const eventDates = [...new Set(
        updatedMatchDays
          .filter(day => day.isActive)
          .map(day => day.date.toISOString().split('T')[0])
      )]

      // Make API call to update event dates
      await axios.put(
        `https://halamadrid.me/api/tournament/${effectiveTournamentId}/detail`,
        { eventDates },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
    } catch (error) {
      console.error("Failed to update event dates:", error)
      setApiError("Failed to update event dates on the server")
    }
  }

  const handleAddMatchDay = async () => {
    if (!newMatchDay.date || !newMatchDay.name) return

    try {
      const matchDay: MatchDay = {
        id: `match-day-${Date.now()}`,
        date: newMatchDay.date as Date,
        name: newMatchDay.name as string,
        isActive: newMatchDay.isActive ?? true,
        notes: newMatchDay.notes,
      }

      // Simulate API call for UI feedback
      await simulateFetch(matchDay, 800)

      const updatedMatchDays = [...matchDays, matchDay].sort((a, b) => a.date.getTime() - b.date.getTime())
      setMatchDays(updatedMatchDays)

      // Update event dates on the server
      await updateEventDates(updatedMatchDays)

      if (onMatchDaysChange) {
        onMatchDaysChange(updatedMatchDays)
      }

      setNewMatchDay({
        date: new Date(),
        name: "",
        isActive: true,
      })
      setIsAddingNew(false)
    } catch (error) {
      console.error("Failed to add match day:", error)
    }
  }

  const handleDeleteMatchDay = async (id: string) => {
    try {
      // Simulate API call for UI feedback
      await simulateFetch(null, 500)

      const updatedMatchDays = matchDays.filter((day) => day.id !== id)
      setMatchDays(updatedMatchDays)

      // Update event dates on the server
      await updateEventDates(updatedMatchDays)

      if (onMatchDaysChange) {
        onMatchDaysChange(updatedMatchDays)
      }
    } catch (error) {
      console.error("Failed to delete match day:", error)
    }
  }

  const handleUpdateMatchDay = async (id: string, updates: Partial<MatchDay>) => {
    try {
      // Simulate API call for UI feedback
      await simulateFetch(null, 500)

      const updatedMatchDays = matchDays
        .map((day) => (day.id === id ? { ...day, ...updates } : day))
        .sort((a, b) => a.date.getTime() - b.date.getTime())

      setMatchDays(updatedMatchDays)

      // Update event dates on the server
      await updateEventDates(updatedMatchDays)

      if (onMatchDaysChange) {
        onMatchDaysChange(updatedMatchDays)
      }

      setExpandedDay(null)
    } catch (error) {
      console.error("Failed to update match day:", error)
    }
  }

  const toggleExpandDay = (id: string) => {
    setExpandedDay(expandedDay === id ? null : id)
  }

  const isDateWithinRange = (date: Date) => {
    return date >= startDate && date <= endDate
  }

  const getDateWarning = (date: Date) => {
    if (!isDateWithinRange(date)) {
      return "This date is outside the tournament period."
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-neutral-800">Match Days</h3>
        <div className="flex space-x-2 p-2">
          <button onClick={() => setIsAddingNew(true)} className="btn btn-sm bg-green-600 text-white hover:bg-green-700 flex items-center space-x-1 p-2">
            <Plus className="h-4 w-4" />
            <span>Add Match Day</span>
          </button>
        </div>
      </div>

      {isAddingNew && (
        <div className="bg-white border border-primary-200 rounded-lg p-4 shadow-sm animate-in">
          <h4 className="font-medium text-neutral-800 mb-3">Add New Match Day</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
              <input
                type="date"
                value={newMatchDay.date ? newMatchDay.date.toISOString().split("T")[0] : ""}
                onChange={(e) => setNewMatchDay({ ...newMatchDay, date: new Date(e.target.value) })}
                className="input"
              />
              {newMatchDay.date && getDateWarning(newMatchDay.date) && (
                <p className="mt-1 text-xs text-amber-600 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {getDateWarning(newMatchDay.date)}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
              <input
                type="text"
                value={newMatchDay.name}
                onChange={(e) => setNewMatchDay({ ...newMatchDay, name: e.target.value })}
                placeholder="e.g., Group Stage - Round 1"
                className="input"
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-neutral-700 mb-1">Notes (optional)</label>
            <textarea
              value={newMatchDay.notes || ""}
              onChange={(e) => setNewMatchDay({ ...newMatchDay, notes: e.target.value })}
              placeholder="Any special instructions or notes for this match day"
              className="input min-h-[80px]"
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="isActive"
              checked={newMatchDay.isActive}
              onChange={(e) => setNewMatchDay({ ...newMatchDay, isActive: e.target.checked })}
              className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-neutral-700">
              Active match day
            </label>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsAddingNew(false)}
              className="btn btn-sm btn-outline flex items-center space-x-1"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleAddMatchDay}
              className="btn btn-sm bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-1"
              disabled={isLoading || !newMatchDay.date || !newMatchDay.name}
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? "Saving..." : "Save"}</span>
            </button>
          </div>
        </div>
      )}

      {matchDays.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 text-center">
          <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-neutral-700 mb-2">No Match Days Defined</h4>
          <p className="text-neutral-500 mb-4">Define match days for your tournament or generate them automatically.</p>
          <button
            onClick={generateSuggestedMatchDays}
            className="btn btn-sm bg-primary-600 text-white hover:bg-primary-700 inline-flex items-center space-x-1"
            disabled={isLoading}
          >
            <Calendar className="h-4 w-4" />
            <span>Generate Suggested Match Days</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {matchDays.map((day) => (
                  <React.Fragment key={day.id}>
                    <tr className={`hover:bg-neutral-50 ${!isDateWithinRange(day.date) ? "bg-amber-50" : ""}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                        {formatDateShort(day.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => toggleExpandDay(day.id)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            {expandedDay === day.id ? "Hide" : "Edit"}
                          </button>
                          <button
                            onClick={() => handleDeleteMatchDay(day.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedDay === day.id && (
                      <tr className="bg-neutral-50">
                        <td colSpan={4} className="px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                              <input
                                type="date"
                                defaultValue={day.date.toISOString().split("T")[0]}
                                onChange={(e) => {
                                  const newDate = new Date(e.target.value)
                                  handleUpdateMatchDay(day.id, { date: newDate })
                                }}
                                className="input"
                              />
                              {!isDateWithinRange(day.date) && (
                                <p className="mt-1 text-xs text-amber-600 flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {getDateWarning(day.date)}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                              <input
                                type="text"
                                defaultValue={day.name}
                                onChange={(e) => handleUpdateMatchDay(day.id, { name: e.target.value })}
                                className="input"
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Notes</label>
                            <textarea
                              defaultValue={day.notes || ""}
                              onChange={(e) => handleUpdateMatchDay(day.id, { notes: e.target.value })}
                              className="input min-h-[80px]"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`isActive-${day.id}`}
                                checked={day.isActive}
                                onChange={(e) => handleUpdateMatchDay(day.id, { isActive: e.target.checked })}
                                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              />
                              <label htmlFor={`isActive-${day.id}`} className="ml-2 text-sm text-neutral-700">
                                Active match day
                              </label>
                            </div>
                            <button
                              onClick={() => setExpandedDay(null)}
                              className="btn btn-sm bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-1"
                            >
                              <Check className="h-4 w-4" />
                              <span>Done</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-3">
          <div className="text-red-500 mt-0.5">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        </div>
      )}

      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 flex items-start space-x-3">
        <div className="text-amber-500 mt-0.5">
          <Info className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-neutral-700">
            Match days define when games will be played during your tournament. You can add, edit, or remove match days
            as needed. The system will automatically schedule matches on these days.
          </p>
        </div>
      </div>
    </div>
  )
}
