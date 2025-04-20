"use client"

import { AlertTriangle, XCircle, RefreshCw } from "lucide-react"

interface ErrorDisplayProps {
  error: Error | null
  onRetry?: () => void
  variant?: "inline" | "card" | "full"
}

export default function ErrorDisplay({ error, onRetry, variant = "card" }: ErrorDisplayProps) {
  if (!error) return null

  if (variant === "inline") {
    return (
      <div className="flex items-center space-x-2 text-red-600 my-2">
        <XCircle className="h-4 w-4" />
        <span className="text-sm">{error.message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Retry</span>
          </button>
        )}
      </div>
    )
  }

  if (variant === "full") {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-neutral-800 mb-2">Error Loading Data</h3>
        <p className="text-neutral-600 mb-4 text-center max-w-md">{error.message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    )
  }

  // Default card variant
  return (
    <div className="bg-white border border-red-200 rounded-lg p-4 my-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
        <div>
          <h4 className="font-medium text-red-700 mb-1">Error Loading Data</h4>
          <p className="text-neutral-600 text-sm mb-3">{error.message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
