"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, GripVertical } from "lucide-react"

const QuickActions = ({
  darkMode,
  quickActionTemplates,
  addQuickAction,
  setEditingQuickAction,
  setShowQuickActionModal,
  deleteQuickAction,
  copiedId,
  updateQuickActionsOrder,
}) => {
  const [draggedItem, setDraggedItem] = useState(null)
  const [templates, setTemplates] = useState([])

  // Initialize templates from props
  useEffect(() => {
    setTemplates(quickActionTemplates)
  }, [quickActionTemplates])

  // Handle drag start
  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = "move"
    // Required for Firefox
    e.dataTransfer.setData("text/html", e.target.outerHTML)
    // Add a class to the dragged item
    e.target.classList.add("dragging")
  }

  // Handle drag over
  const handleDragOver = (e, index) => {
    e.preventDefault()
    const draggedOverItem = templates[index]

    // If the item is dragged over itself, ignore
    if (draggedItem === index) {
      return
    }

    // Filter out the currently dragged item
    const newItems = templates.filter((_, idx) => idx !== draggedItem)

    // Add the dragged item after the dragged over item
    newItems.splice(index, 0, templates[draggedItem])

    setTemplates(newItems)
    setDraggedItem(index)
  }

  // Handle drag end
  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging")
    // Update the order in the parent component
    updateQuickActionsOrder(templates)
  }

  return (
    <div
      className={`border-b transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <button
            onClick={() => {
              setEditingQuickAction(null)
              setShowQuickActionModal(true)
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
            title="Add quick action"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template, index) => (
            <div
              key={template.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group p-4 rounded-lg text-left transition-colors cursor-move ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-start mb-2">
                <div className="mr-2 cursor-grab text-gray-500">
                  <GripVertical className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium flex items-center gap-2 mb-2">
                    {template.name}
                    {copiedId === `quick-${template.id}` && (
                      <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">Copied!</span>
                    )}
                  </div>
                  <div
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} whitespace-pre-wrap mb-3 max-h-32 overflow-y-auto`}
                    style={{ minHeight: "80px" }}
                  >
                    {template.content}
                  </div>
                  <button
                    onClick={() => addQuickAction(template)}
                    className={`w-full py-2 px-3 rounded text-sm font-medium transition-all ${
                      copiedId === `quick-${template.id}`
                        ? "bg-green-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {copiedId === `quick-${template.id}` ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingQuickAction(template)
                    setShowQuickActionModal(true)
                  }}
                  className={`p-1 rounded transition-colors ${darkMode ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-200 hover:bg-gray-300"}`}
                  title="Edit template"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteQuickAction(template.id)
                  }}
                  className="p-1 rounded bg-red-500 hover:bg-red-600 text-white transition-colors"
                  title="Delete template"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .dragging {
          opacity: 0.5;
        }
      `}</style>
    </div>
  )
}

export default QuickActions
