"use client"

import { useState } from "react"
import type { TournamentFormat } from "../../types/tournament"
import { Check, ChevronDown, Trophy } from "lucide-react"

interface FormatSelectorProps {
  selectedFormat: TournamentFormat
  onFormatChange?: (format: TournamentFormat) => void
}

export default function FormatSelector({ selectedFormat, onFormatChange }: FormatSelectorProps) {
  const formats: TournamentFormat[] = ["GROUP_STAGE", "ROUND_ROBIN", "SINGLE_ELIMINATION"]

  const [isOpen, setIsOpen] = useState(false)

  // Function to convert format from snake case to readable format
  const formatToReadable = (format: TournamentFormat): string => {
    switch (format) {
      case "GROUP_STAGE":
        return "Group Stage";
      case "ROUND_ROBIN":
        return "Round Robin";
      case "SINGLE_ELIMINATION":
        return "Single Elimination";
      default:
        return format;
    }
  }

  const handleSelect = (format: TournamentFormat) => {
    if (onFormatChange) {
      onFormatChange(format)
    }
    setIsOpen(false)
  }

  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 text-primary-500">
        <Trophy className="h-5 w-5" />
      </div>
      <div className="relative flex-1">
        <div className="text-sm font-medium text-neutral-500 mb-1">Format</div>
        <button
          type="button"
          className="flex items-center justify-between w-full p-2 border border-neutral-200 rounded-md bg-white hover:border-primary-300 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{formatToReadable(selectedFormat)}</span>
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg animate-in">
            <ul className="py-1">
              {formats.map((format) => (
                <li key={format}>
                  <button
                    type="button"
                    className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-primary-50 transition-colors"
                    onClick={() => handleSelect(format)}
                  >
                    <span>{formatToReadable(format)}</span>
                    {selectedFormat === format && <Check className="w-4 h-4 text-primary-500" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
