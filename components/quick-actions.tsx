"use client"

import { Plus, Edit2, Trash2 } from "lucide-react"

const QuickActions = ({
  darkMode,
  quickActionTemplates,
  addQuickAction,
  setEditingQuickAction,
  setShowQuickActionModal,
  deleteQuickAction,
  copiedId,
}) => {
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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActionTemplates.map((template) => (
            <div
              key={template.id}
              className={`relative group p-3 rounded-lg text-left transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <button onClick={() => addQuickAction(template)} className="w-full text-left">
                <div className="font-medium flex items-center gap-2">
                  {template.name}
                  {copiedId === `quick-${template.id}` && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">Copied!</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 truncate">{template.content}</div>
              </button>

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
    </div>
  )
}

export default QuickActions
