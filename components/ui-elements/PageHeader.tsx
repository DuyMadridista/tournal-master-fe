import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">{title}</h1>
        {description && <p className="text-neutral-600">{description}</p>}
      </div>
      {children && <div className="mt-4 md:mt-0 flex items-center space-x-3">{children}</div>}
    </div>
  )
}
