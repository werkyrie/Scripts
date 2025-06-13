"use client"

import { Search, CheckSquare, Square, Plus } from "lucide-react"
import ViewControls from "./view-controls"

const SearchBar = ({
  darkMode,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  sortedAndFilteredScripts,
  selectedScripts,
  selectAllScripts,
  deselectAllScripts,
  setEditingScript,
  setShowModal,
  viewMode,
  setViewMode,
  itemsPerPage,
  setItemsPerPage,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Main Search Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search scripts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-3 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-500"
            } focus:outline-none`}
          >
            <option value="recent">Recently Created</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="wordCount">Word Count</option>
            <option value="category">Category</option>
          </select>

          {sortedAndFilteredScripts.length > 0 && (
            <button
              onClick={selectedScripts.size === sortedAndFilteredScripts.length ? deselectAllScripts : selectAllScripts}
              className={`p-3 rounded-lg transition-colors ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              title={selectedScripts.size === sortedAndFilteredScripts.length ? "Deselect all" : "Select all"}
            >
              {selectedScripts.size === sortedAndFilteredScripts.length ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              setEditingScript(null)
              setShowModal(true)
            }}
            className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
            title="Add new script"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {sortedAndFilteredScripts.length} script{sortedAndFilteredScripts.length !== 1 ? "s" : ""}
            {selectedScripts.size > 0 && ` (${selectedScripts.size} selected)`}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Items per page for list views */}
          {(viewMode === "list" || viewMode === "dense") && (
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className={`px-2 py-1 text-sm rounded border ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
              }`}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
          )}

          <ViewControls viewMode={viewMode} setViewMode={setViewMode} darkMode={darkMode} />
        </div>
      </div>
    </div>
  )
}

export default SearchBar
