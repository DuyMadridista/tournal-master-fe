"use client"

import { useDataFetching } from "../../context/DataFetchingContext"
import { Loader2 } from "lucide-react"

interface DataFetchingIndicatorProps {
  showText?: boolean
  className?: string
}

export default function DataFetchingIndicator({ showText = true, className = "" }: DataFetchingIndicatorProps) {
  const { isLoading } = useDataFetching()

  if (!isLoading) return null

  return (
    <div className={`inline-flex items-center space-x-2 text-primary-600 ${className}`}>
      <Loader2 className="h-4 w-4 animate-spin" />
      {showText && <span className="text-sm font-medium">Loading data...</span>}
    </div>
  )
}
