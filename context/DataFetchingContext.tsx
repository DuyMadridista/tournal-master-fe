"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DataFetchingContextType {
  isLoading: boolean
  error: Error | null
  startLoading: () => void
  stopLoading: (error?: Error) => void
  simulateFetch: <T>(data: T, delay?: number) => Promise<T>
}

const DataFetchingContext = createContext<DataFetchingContextType | undefined>(undefined)

export function DataFetchingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const startLoading = () => {
    setIsLoading(true)
    setError(null)
  }

  const stopLoading = (error?: Error) => {
    setIsLoading(false)
    if (error) setError(error)
  }

  // Helper function to simulate data fetching with a delay
  const simulateFetch = async <T,>(data: T, delay = 1000): Promise<T> => {
    startLoading()

    try {
      await new Promise((resolve) => setTimeout(resolve, delay))
      stopLoading()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unknown error occurred")
      stopLoading(error)
      throw error
    }
  }

  return (
    <DataFetchingContext.Provider value={{ isLoading, error, startLoading, stopLoading, simulateFetch }}>
      {children}
    </DataFetchingContext.Provider>
  )
}

export function useDataFetching() {
  const context = useContext(DataFetchingContext)
  if (context === undefined) {
    throw new Error("useDataFetching must be used within a DataFetchingProvider")
  }
  return context
}
