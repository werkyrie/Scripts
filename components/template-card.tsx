"use client"

import { useState } from "react"
import { CheckSquare, Square, Check, Edit2, Trash2, MessageSquare, Tag } from "lucide-react"

interface Template {
  id: string
  name: string
  description?: string
  content: string
  placeholders: string[]
  createdAt: string
}

interface TemplateCardProps {
  template: Template
  darkMode: boolean
  selected: boolean
  toggleSelection: () => void
  onEdit: () => void
  onDelete: () => void
  onPersonalize: () => void
  copiedId: string | null
}

const TemplateCard = ({
  template,
  darkMode,
  selected,
  toggleSelection,
  onEdit,
  onDelete,
  onPersonalize,
  copiedId,
}: TemplateCardProps) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  // Format the date to be more readable
  const formattedDate = new Date(template.createdAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // Highlight placeholders in the content preview
  const highlightPlaceholders = (content: string) => {
    let highlighted = content
    template.placeholders.forEach((placeholder) => {
      const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g")
      highlighted = highlighted.replace(
        regex,
        `<span class="${darkMode ? "text-blue-400" : "text-blue-600"} font-medium whitespace-pre-wrap">{{${placeholder}}}</span>`,
      )
    })
    return highlighted
  }

  return (
    <div
      className={`rounded-lg transition-all duration-300 hover:shadow-lg ${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-xl"
      } shadow-sm border ${selected ? "ring-2 ring-blue-500" : ""} ${
        darkMode ? "border-gray-700" : "border-gray-200"
      } flex flex-col h-full group`}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <button
              onClick={toggleSelection}
              className={`mt-1 transition-colors ${
                selected
                  ? "text-blue-500"
                  : darkMode
                    ? "text-gray-500 hover:text-gray-400"
                    : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {selected ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2 leading-tight">{template.name}</h3>
              {template.description && (
                <p className={`text-sm line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {template.description}
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
            <button
              onClick={onEdit}
              className={`p-1.5 rounded transition-colors ${
                darkMode ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"
              }`}
              title="Edit template"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 rounded text-red-500 hover:text-red-600 transition-colors"
              title="Delete template"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {template.placeholders.length} placeholder{template.placeholders.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4 flex-1">
        <div
          className={`text-sm p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} max-h-32 overflow-hidden relative`}
        >
          <div
            className="whitespace-pre-wrap break-words leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlightPlaceholders(template.content) }}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${
              darkMode ? "from-gray-700 to-transparent" : "from-gray-50 to-transparent"
            } pointer-events-none`}
          />
        </div>

        {/* Placeholders */}
        {template.placeholders.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {template.placeholders.map((placeholder) => (
                <span
                  key={placeholder}
                  className={`px-2 py-1 text-xs rounded flex items-center ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {placeholder}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <button
          onClick={onPersonalize}
          className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
            copiedId === `personalized-${template.id}`
              ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
              : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {copiedId === `personalized-${template.id}` ? (
            <>
              <Check className="h-4 w-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4" />
              <span>Personalize & Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Delete Confirmation */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`max-w-md w-full rounded-lg shadow-xl transition-colors ${
              darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
            }`}
          >
            <div className="p-6">
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                Delete Template
              </h3>
              <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                Are you sure you want to delete the template{" "}
                <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>"{template.name}"</span>?
              </p>
              <div
                className={`p-4 rounded-lg mb-6 ${
                  darkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  This action cannot be undone. The template will be permanently removed.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete()
                    setShowConfirmDelete(false)
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TemplateCard
