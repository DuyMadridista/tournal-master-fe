"use client"

import { useState } from "react"
import { Calendar, Pencil, Check, X } from "lucide-react"

interface EventDatesDisplayProps {
  startDate: Date
  endDate: Date
  onDatesChange?: (startDate: Date, endDate: Date) => void
}

export default function EventDatesDisplay({ startDate, endDate, onDatesChange }: EventDatesDisplayProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentStartDate, setCurrentStartDate] = useState(startDate.toISOString().split("T")[0])
  const [currentEndDate, setCurrentEndDate] = useState(endDate.toISOString().split("T")[0])

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleSave = () => {
    if (onDatesChange) {
      onDatesChange(new Date(currentStartDate), new Date(currentEndDate))
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setCurrentStartDate(startDate.toISOString().split("T")[0])
    setCurrentEndDate(endDate.toISOString().split("T")[0])
    setIsEditing(false)
  }

  const calculateDuration = (): number => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-neutral-800">Tournament Dates</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-neutral-500 hover:text-primary-600 transition-colors p-1 rounded-full hover:bg-primary-50"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {!isEditing ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <Calendar className="h-5 w-5 text-primary-500" />
            <div>
              <div className="text-sm font-medium text-neutral-500">Start Date</div>
              <div className="text-base font-medium">{formatDate(startDate)}</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
            <Calendar className="h-5 w-5 text-primary-500" />
            <div>
              <div className="text-sm font-medium text-neutral-500">End Date</div>
              <div className="text-base font-medium">{formatDate(endDate)}</div>
            </div>
          </div>

          <div className="text-center p-2 bg-neutral-100 rounded-lg">
            <span className="text-sm font-medium text-neutral-600">Duration: {calculateDuration()} days</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-4 bg-white rounded-lg border border-primary-200 shadow-sm animate-in">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
            <input
              type="date"
              value={currentStartDate}
              onChange={(e) => setCurrentStartDate(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
            <input
              type="date"
              value={currentEndDate}
              onChange={(e) => setCurrentEndDate(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="btn btn-sm bg-primary-600 text-white hover:bg-primary-700 flex items-center space-x-1"
            >
              <Check className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button onClick={handleCancel} className="btn btn-sm btn-outline flex items-center space-x-1">
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
