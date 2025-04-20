"use client"

import { useDataFetching } from "../../context/DataFetchingContext"
import LoadingSpinner from "./LoadingSpinner"
import { AlertCircle } from "lucide-react"

export default function LoadingOverlay() {
  const { isLoading, error } = useDataFetching()

  if (!isLoading && !error) return null

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLoading || error ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {isLoading && (
        <div className="bg-primary-600 text-white py-1 px-4 flex items-center justify-center">
          <LoadingSpinner size="sm" className="mr-2" />
          <span className="text-sm font-medium">Loading data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-600 text-white py-1 px-4 flex items-center justify-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{error.message}</span>
        </div>
      )}
    </div>
  )
}
