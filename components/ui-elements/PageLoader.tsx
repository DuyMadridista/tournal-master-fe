import LoadingSpinner from "./LoadingSpinner"

export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-neutral-600 animate-pulse">Loading data...</p>
    </div>
  )
}
