"use client"
import { CheckSquare, Square, Copy, Check, Heart, Star, FileText, ImageIcon } from "lucide-react"

const ScriptCompactCard = ({ script, darkMode, selectedScripts, toggleScriptSelection, copyToClipboard, copiedId }) => {
  const wordCount = script.content.split(/\s+/).filter((word) => word.length > 0).length
  const previewContent = script.content.length > 100 ? script.content.substring(0, 100) + "..." : script.content

  return (
    <div
      className={`rounded-lg p-4 transition-all duration-300 hover:shadow-md ${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-lg"
      } shadow-sm border ${script.pinned ? "ring-1 ring-yellow-400" : ""} ${
        script.favorited ? "ring-1 ring-red-400" : ""
      } ${selectedScripts.has(script.id) ? "ring-2 ring-blue-500" : ""} ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button
            onClick={() => toggleScriptSelection(script.id)}
            className={`mt-0.5 transition-colors ${
              selectedScripts.has(script.id)
                ? "text-blue-600"
                : darkMode
                  ? "text-gray-500 hover:text-gray-400"
                  : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {selectedScripts.has(script.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{script.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                {wordCount}w
              </span>
              <span
                className={`px-1.5 py-0.5 rounded ${
                  darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                }`}
              >
                {script.category}
              </span>
              {script.pinned && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
              {script.favorited && <Heart className="h-3 w-3 text-red-500 fill-current" />}
              {script.imageUrl && <ImageIcon className="h-3 w-3 text-blue-500" />}
            </div>
          </div>
        </div>
      </div>

      {/* Content Preview */}
      <div className={`text-xs p-2 rounded mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-50"} whitespace-pre-wrap`}>
        {previewContent}
      </div>

      {/* Copy Button */}
      <button
        onClick={() => copyToClipboard(script.content, script.id)}
        className={`w-full flex items-center justify-center space-x-2 py-2 px-3 rounded text-sm font-medium transition-all ${
          copiedId === script.id ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {copiedId === script.id ? (
          <>
            <Check className="h-3 w-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  )
}

export default ScriptCompactCard
