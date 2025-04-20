interface SkeletonLoaderProps {
  className?: string
  variant?: "text" | "circular" | "rectangular" | "card" | "table-row"
  count?: number
}

export default function SkeletonLoader({ className = "", variant = "text", count = 1 }: SkeletonLoaderProps) {
  const baseClasses = "animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded"

  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full h-12 w-12",
    rectangular: "h-24 w-full",
    card: "h-32 w-full rounded-xl",
    "table-row": "h-16 w-full",
  }

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={classes} />
      ))}
    </>
  )
}
