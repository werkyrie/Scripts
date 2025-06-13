"use client"

import { Grid3X3, List, Rows3, LayoutGrid } from "lucide-react"

const ViewControls = ({ viewMode, setViewMode, darkMode }) => {
  const viewOptions = [
    { id: "grid", icon: Grid3X3, label: "Grid View", description: "Cards in grid" },
    { id: "compact", icon: LayoutGrid, label: "Compact View", description: "Smaller cards" },
    { id: "list", icon: List, label: "List View", description: "Detailed list" },
    { id: "dense", icon: Rows3, label: "Dense View", description: "Table-like" },
  ]

  return (
    <div className="flex items-center space-x-1">
      {viewOptions.map((option) => {
        const IconComponent = option.icon
        return (
          <button
            key={option.id}
            onClick={() => setViewMode(option.id)}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === option.id
                ? "bg-blue-600 text-white"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            title={option.label}
          >
            <IconComponent className="h-4 w-4" />
          </button>
        )
      })}
    </div>
  )
}

export default ViewControls
