import type React from "react"
import type { ReactNode } from "react"

interface InfoCardProps {
  title?: string
  children: ReactNode
  className?: string
  isDanger?: boolean
  icon?: React.ElementType
}

export default function InfoCard({ title, children, className = "", isDanger = false, icon: Icon }: InfoCardProps) {
  return (
    <div
      className={`
        card p-5 mb-6 transition-all duration-300 hover:shadow-card-hover
        ${
          isDanger
            ? "bg-red-50 border-red-200 hover:border-red-300 hover:shadow-red-100/50"
            : "bg-white hover:border-primary-200 hover:shadow-primary-100/50"
        }
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center mb-4">
          {Icon && (
            <div
              className={`p-1.5 rounded-md mr-2 ${isDanger ? "bg-red-100 text-red-600" : "bg-primary-100 text-primary-600"}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h3 className={`text-lg font-semibold ${isDanger ? "text-red-700" : "text-neutral-800"}`}>{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  )
}
