"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface PublicationFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onResetFilters: () => void
}

export default function PublicationFilters({
  searchQuery,
  onSearchChange,
  onResetFilters,
}: PublicationFiltersProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full flex-grow">
          <input
            type="text"
            placeholder="Search publications..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-4 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <button onClick={onResetFilters} className="text-sm text-gray-600 hover:text-gray-900">
            Reset Search
          </button>
        )}
      </div>
    </div>
  )
}

