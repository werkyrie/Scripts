"use client"

import { useMemo, useState } from "react"
import { Plus, Heart, HeartOff, Star, StarOff, Edit2, Trash2 } from "lucide-react"
import DeleteConfirmationModal from "./delete-confirmation-modal"

const Sidebar = ({
  darkMode,
  categories,
  activeCategory,
  setActiveCategory,
  scripts,
  selectedTag,
  setSelectedTag,
  setEditingScript,
  setShowModal,
  selectedScripts,
  toggleFavorite,
  togglePin,
  deleteScript,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [scriptToDelete, setScriptToDelete] = useState(null)

  const allTags = useMemo(() => {
    const tags = new Set()
    scripts.forEach((script) => {
      script.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [scripts])

  // Get the selected script for actions (if only one is selected)
  const selectedScript = selectedScripts.size === 1 ? scripts.find((s) => selectedScripts.has(s.id)) : null

  const handleDeleteClick = (script) => {
    setScriptToDelete(script)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    if (scriptToDelete) {
      deleteScript(scriptToDelete.id)
      setShowDeleteModal(false)
      setScriptToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setScriptToDelete(null)
  }

  return (
    <>
      <div className="hidden lg:block lg:w-64 flex-shrink-0">
        <div
          className={`rounded-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm mb-6`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button
              onClick={() => {
                setEditingScript(null)
                setShowModal(true)
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
              title="Add new script"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-2">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.name}
                  onClick={() => setActiveCategory(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeCategory === category.name
                      ? "bg-blue-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </nav>

          {allTags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-2">Filter by Tags</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedTag("")}
                  className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                    !selectedTag ? "bg-blue-500 text-white" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  All Tags
                </button>
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                      selectedTag === tag
                        ? "bg-blue-500 text-white"
                        : darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Script Actions Section */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <h3 className="text-sm font-medium mb-3">Script Actions</h3>

            {selectedScripts.size === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Select a script to see actions</p>
            ) : selectedScripts.size === 1 && selectedScript ? (
              <div className="space-y-2">
                <div className="text-xs text-gray-400 mb-2 truncate" title={selectedScript.title}>
                  {selectedScript.title}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedScript.id)}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      selectedScript.favorited
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    title={selectedScript.favorited ? "Remove from favorites" : "Add to favorites"}
                  >
                    {selectedScript.favorited ? (
                      <Heart className="h-4 w-4 fill-current" />
                    ) : (
                      <HeartOff className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => togglePin(selectedScript.id)}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      selectedScript.pinned
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    title={selectedScript.pinned ? "Unpin script" : "Pin script"}
                  >
                    {selectedScript.pinned ? (
                      <Star className="h-4 w-4 fill-current" />
                    ) : (
                      <StarOff className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setEditingScript(selectedScript)
                      setShowModal(true)
                    }}
                    className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                    title="Edit script"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteClick(selectedScript)}
                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center"
                    title="Delete script"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">{selectedScripts.size} scripts selected</p>
                <p className="text-xs text-gray-400">Select one script for individual actions</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        darkMode={darkMode}
        scriptTitle={scriptToDelete?.title}
        isMultiple={false}
        count={1}
      />
    </>
  )
}

export default Sidebar
