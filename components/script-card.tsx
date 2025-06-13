"use client"

import { useState } from "react"
import {
  CheckSquare,
  Square,
  History,
  Copy,
  Check,
  ImageIcon,
  Maximize2,
  ChevronDown,
  ChevronUp,
  FileText,
  Edit2,
  Trash2,
  Heart,
  HeartOff,
  Star,
  StarOff,
} from "lucide-react"
import ImagePreviewModal from "./image-preview-modal"
import DeleteConfirmationModal from "./delete-confirmation-modal"

const ScriptCard = ({
  script,
  darkMode,
  selectedScripts,
  toggleScriptSelection,
  copyToClipboard,
  copiedId,
  toggleFavorite,
  togglePin,
  deleteScript,
  setEditingScript,
  setShowModal,
}) => {
  const [showImagePreview, setShowImagePreview] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Calculate content metrics
  const contentLength = script.content.length
  const wordCount = script.content.split(/\s+/).filter((word) => word.length > 0).length
  const lineCount = script.content.split("\n").length

  // Determine if content needs truncation (more than 200 characters or 3 lines)
  const needsTruncation = contentLength > 200 || lineCount > 3
  const previewContent =
    needsTruncation && !isExpanded
      ? script.content.substring(0, 200) + (contentLength > 200 ? "..." : "")
      : script.content

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = () => {
    deleteScript(script.id)
    setShowDeleteModal(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  return (
    <>
      <div
        className={`rounded-lg transition-all duration-300 hover:shadow-lg ${
          darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-xl"
        } shadow-sm border ${script.pinned ? "ring-2 ring-yellow-400" : ""} ${
          script.favorited ? "ring-2 ring-red-400" : ""
        } ${selectedScripts.has(script.id) ? "ring-2 ring-blue-500" : ""} ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } flex flex-col h-full group`}
      >
        {/* Header Section - Fixed Height */}
        <div className="p-6 pb-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <button
                onClick={() => toggleScriptSelection(script.id)}
                className={`mt-1 transition-colors ${
                  selectedScripts.has(script.id)
                    ? "text-blue-500"
                    : darkMode
                      ? "text-gray-500 hover:text-gray-400"
                      : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {selectedScripts.has(script.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2 leading-tight">{script.title}</h3>
                {script.description && (
                  <p className={`text-sm line-clamp-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {script.description}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons - show on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 ml-2">
              <button
                onClick={() => toggleFavorite(script.id)}
                className={`p-1.5 rounded transition-colors ${
                  script.favorited
                    ? "text-red-500 hover:text-red-600"
                    : darkMode
                      ? "text-gray-500 hover:text-gray-400"
                      : "text-gray-400 hover:text-gray-600"
                }`}
                title={script.favorited ? "Remove from favorites" : "Add to favorites"}
              >
                {script.favorited ? <Heart className="h-4 w-4 fill-current" /> : <HeartOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => togglePin(script.id)}
                className={`p-1.5 rounded transition-colors ${
                  script.pinned
                    ? "text-yellow-500 hover:text-yellow-600"
                    : darkMode
                      ? "text-gray-500 hover:text-gray-400"
                      : "text-gray-400 hover:text-gray-600"
                }`}
                title={script.pinned ? "Unpin script" : "Pin script"}
              >
                {script.pinned ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => {
                  setEditingScript(script)
                  setShowModal(true)
                }}
                className={`p-1.5 rounded transition-colors ${
                  darkMode ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"
                }`}
                title="Edit script"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-1.5 rounded text-red-500 hover:text-red-600 transition-colors"
                title="Delete script"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Image Section */}
          {script.imageUrl && (
            <div className="relative mt-3 mb-3 group cursor-pointer" onClick={() => setShowImagePreview(true)}>
              <img
                src={script.imageUrl || "/placeholder.svg"}
                alt={script.title}
                className="w-full h-32 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-md">
                <Maximize2 className="h-6 w-6 text-white" />
              </div>
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                <ImageIcon className="h-3 w-3 text-white" />
              </div>
              {script.imageUrl.startsWith("data:image/") && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded">
                  Embedded
                </div>
              )}
            </div>
          )}

          {/* Metadata Row */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <History className="h-3 w-3 mr-1" />v{script.version}
              </span>
              <span className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {wordCount} words
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {script.pinned && (
                <span className="flex items-center text-yellow-500">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                </span>
              )}
              {script.favorited && (
                <span className="flex items-center text-red-500">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section - Flexible Height */}
        <div className="px-6 pb-4 flex-1">
          <div
            className={`text-sm p-4 rounded-lg transition-all duration-300 ${
              darkMode ? "bg-gray-700" : "bg-gray-50"
            } ${isExpanded ? "max-h-none" : "max-h-32 overflow-hidden"} relative`}
          >
            <div className="whitespace-pre-wrap break-words leading-relaxed">{previewContent}</div>

            {/* Fade overlay for truncated content */}
            {needsTruncation && !isExpanded && (
              <div
                className={`absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t ${
                  darkMode ? "from-gray-700 to-transparent" : "from-gray-50 to-transparent"
                } pointer-events-none`}
              />
            )}
          </div>

          {/* Expand/Collapse Button */}
          {needsTruncation && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`mt-2 flex items-center space-x-1 text-xs font-medium transition-colors ${
                darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <span>Show less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  <span>Show more ({contentLength - 200} more characters)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer Section - Fixed Height */}
        <div className="px-6 pb-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            <span
              className={`px-2 py-1 text-xs rounded font-medium ${
                darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
              }`}
            >
              {script.category}
            </span>
            <div className="hidden md:flex flex-wrap gap-1">
              {script.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  #{tag}
                </span>
              ))}
              {script.tags.length > 3 && (
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  +{script.tags.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => copyToClipboard(script.content, script.id)}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
              copiedId === script.id
                ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {copiedId === script.id ? (
              <>
                <Check className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showImagePreview && script.imageUrl && (
        <ImagePreviewModal
          imageUrl={script.imageUrl}
          alt={script.title}
          onClose={() => setShowImagePreview(false)}
          darkMode={darkMode}
        />
      )}

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        darkMode={darkMode}
        scriptTitle={script.title}
        isMultiple={false}
        count={1}
      />
    </>
  )
}

export default ScriptCard
