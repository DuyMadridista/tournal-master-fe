"use client"

import { useState } from "react"
import { Pencil, Check, X } from "lucide-react"

interface EditableFieldProps {
  label: string
  value: string | number
  onSave?: (newValue: string | number) => void
  type?: "text" | "number" | "textarea"
  className?: string
}

export default function EditableField({ label, value, onSave, type = "text", className = "" }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)

  const handleSave = () => {
    if (onSave) {
      onSave(currentValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setCurrentValue(value)
    setIsEditing(false)
  }

  return (
    <div
      className={`mb-4 ${className} rounded-lg transition-all duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-sm font-medium text-neutral-500 mb-1">{label}</div>

      {!isEditing ? (
        <div className={`flex items-center justify-between p-2 rounded-md ${isHovered ? "bg-primary-50/50" : ""}`}>
          <div className="text-center font-medium text-neutral-800">
            {type === "textarea" ? <div className="whitespace-pre-wrap">{value}</div> : value}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className={`text-neutral-400 hover:text-primary-600 transition-colors rounded-full p-1
              ${isHovered ? "opacity-100" : "opacity-0"} hover:bg-primary-100`}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col space-y-2 p-2 bg-white rounded-md border border-primary-200 shadow-sm animate-in">
          {type === "textarea" ? (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              className="w-full p-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type={type}
              value={currentValue}
              onChange={(e) => setCurrentValue(type === "number" ? Number(e.target.value) : e.target.value)}
              className="w-full p-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
          )}

          <div className="flex space-x-2">
            <button onClick={handleSave} className="btn btn-sm btn-primary flex items-center space-x-1">
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
