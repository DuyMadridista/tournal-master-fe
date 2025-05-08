"use client"

import type { ReactNode } from "react"
import { Search, Filter, ChevronDown } from "lucide-react"
import { useState } from "react"

interface ActionToolbarProps {
  title: string
  totalItems?: number
  children?: ReactNode
  onSearch?: (query: string) => void
  showSearch?: boolean
  showFilter?: boolean
}

export default function ActionToolbar({
  title,
  totalItems,
  children,
  onSearch,
  showSearch = true,
  showFilter = false,
}: ActionToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="mb-6 bg-white rounded-xl p-5 shadow-card border border-neutral-200 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <div className="bg-gradient-to-r from-primary-500 to-primary-500 p-2 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>
          {totalItems !== undefined && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
              Total: {totalItems}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">{children}</div>
      </div>

      {(showSearch || showFilter) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {showSearch && (
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-neutral-400" />
              </div>
              <input
                type="search"
                className="input pl-10 w-full focus:border-primary-300 focus:ring-primary-300 border-neutral-200"
                placeholder="Search Team Name ..."
                onChange={(e) => onSearch && onSearch(e.target.value)}
              />
            </div>
          )}

          {showFilter && (
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="btn btn-outline flex items-center space-x-2"
              >
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-dropdown border border-neutral-200 p-3 z-10 animate-in">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Status</label>
                      <select className="input">
                        <option>All</option>
                        <option>Active</option>
                        <option>Completed</option>
                        <option>Upcoming</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700 block mb-1">Group</label>
                      <select className="input">
                        <option>All Groups</option>
                        <option>Group A</option>
                        <option>Group B</option>
                        <option>Group C</option>
                        <option>Group D</option>
                      </select>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button className="btn btn-sm btn-primary">Apply Filters</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
