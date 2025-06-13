"use client"

import { useMemo, useState } from "react"
import SearchBar from "./search-bar"
import ScriptCard from "./script-card"
import ScriptCompactCard from "./script-compact-card"
import ScriptListItem from "./script-list-item"
import ScriptDenseRow from "./script-dense-row"

const MainContent = ({
  darkMode,
  scripts,
  activeCategory,
  searchTerm,
  setSearchTerm,
  showPinnedOnly,
  showFavoritesOnly,
  selectedTag,
  sortBy,
  setSortBy,
  selectedScripts,
  selectAllScripts,
  deselectAllScripts,
  setEditingScript,
  setShowModal,
  toggleScriptSelection,
  copyToClipboard,
  copiedId,
  toggleFavorite,
  togglePin,
  deleteScript,
}) => {
  const [viewMode, setViewMode] = useState("grid") // grid, compact, list, dense
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

  const sortedAndFilteredScripts = useMemo(() => {
    const filtered = scripts.filter((script) => {
      const matchesCategory = activeCategory === "All" || script.category === activeCategory
      const matchesSearch =
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPinned = !showPinnedOnly || script.pinned
      const matchesFavorites = !showFavoritesOnly || script.favorited
      const matchesTag = !selectedTag || script.tags.includes(selectedTag)
      return matchesCategory && matchesSearch && matchesPinned && matchesFavorites && matchesTag
    })

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "wordCount":
          const aWords = a.content.split(/\s+/).length
          const bWords = b.content.split(/\s+/).length
          return bWords - aWords
        case "category":
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })
  }, [scripts, activeCategory, searchTerm, showPinnedOnly, showFavoritesOnly, selectedTag, sortBy])

  // Pagination for list/dense views
  const paginatedScripts = useMemo(() => {
    if (viewMode === "grid" || viewMode === "compact") {
      return sortedAndFilteredScripts
    }
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedAndFilteredScripts.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedAndFilteredScripts, currentPage, itemsPerPage, viewMode])

  const totalPages = Math.ceil(sortedAndFilteredScripts.length / itemsPerPage)

  const renderScripts = () => {
    switch (viewMode) {
      case "compact":
        return (
          <div className="grid gap-4 auto-fit-compact-cards">
            {sortedAndFilteredScripts.map((script) => (
              <ScriptCompactCard
                key={script.id}
                script={script}
                darkMode={darkMode}
                selectedScripts={selectedScripts}
                toggleScriptSelection={toggleScriptSelection}
                copyToClipboard={copyToClipboard}
                copiedId={copiedId}
              />
            ))}
          </div>
        )

      case "list":
        return (
          <div className={`rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
            {paginatedScripts.map((script, index) => (
              <ScriptListItem
                key={script.id}
                script={script}
                darkMode={darkMode}
                selectedScripts={selectedScripts}
                toggleScriptSelection={toggleScriptSelection}
                copyToClipboard={copyToClipboard}
                copiedId={copiedId}
              />
            ))}
          </div>
        )

      case "dense":
        return (
          <div className={`rounded-lg border ${darkMode ? "border-gray-700" : "border-gray-200"} overflow-hidden`}>
            <table className="w-full">
              <thead className={`${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Words
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${darkMode ? "bg-gray-900" : "bg-white"} divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}
              >
                {paginatedScripts.map((script) => (
                  <ScriptDenseRow
                    key={script.id}
                    script={script}
                    darkMode={darkMode}
                    selectedScripts={selectedScripts}
                    toggleScriptSelection={toggleScriptSelection}
                    copyToClipboard={copyToClipboard}
                    copiedId={copiedId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )

      default: // grid
        return (
          <div className="grid gap-6 auto-fit-cards">
            {sortedAndFilteredScripts.map((script) => (
              <ScriptCard
                key={script.id}
                script={script}
                darkMode={darkMode}
                selectedScripts={selectedScripts}
                toggleScriptSelection={toggleScriptSelection}
                copyToClipboard={copyToClipboard}
                copiedId={copiedId}
                toggleFavorite={toggleFavorite}
                togglePin={togglePin}
                deleteScript={deleteScript}
                setEditingScript={setEditingScript}
                setShowModal={setShowModal}
              />
            ))}
          </div>
        )
    }
  }

  const renderPagination = () => {
    if (viewMode === "grid" || viewMode === "compact" || totalPages <= 1) return null

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-500">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, sortedAndFilteredScripts.length)} of {sortedAndFilteredScripts.length}{" "}
          scripts
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : darkMode
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <SearchBar
        darkMode={darkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortedAndFilteredScripts={sortedAndFilteredScripts}
        selectedScripts={selectedScripts}
        selectAllScripts={() => selectAllScripts(sortedAndFilteredScripts)}
        deselectAllScripts={deselectAllScripts}
        setEditingScript={setEditingScript}
        setShowModal={setShowModal}
        viewMode={viewMode}
        setViewMode={setViewMode}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />

      {renderScripts()}
      {renderPagination()}

      {sortedAndFilteredScripts.length === 0 && (
        <div className={`text-center py-16 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <div className="max-w-md mx-auto">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No scripts found</h3>
            <p className="text-sm">Try adjusting your search criteria or create a new script to get started.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .auto-fit-cards {
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        }
        
        .auto-fit-compact-cards {
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        
        @media (max-width: 768px) {
          .auto-fit-cards,
          .auto-fit-compact-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default MainContent
