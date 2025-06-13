"use client"

import { useState } from "react"
import {
  CheckSquare,
  Square,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  History,
  FileText,
  Heart,
  Star,
  ImageIcon,
} from "lucide-react"

const ScriptListItem = ({ script, darkMode, selectedScripts, toggleScriptSelection, copyToClipboard, copiedId }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const wordCount = script.content.split(/\s+/).filter((word) => word.length > 0).length
  const previewContent = script.content.length > 150 ? script.content.substring(0, 150) + "..." : script.content

  return (
    <div
      className={`border-b transition-colors ${
        darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
      } ${selectedScripts.has(script.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* Checkbox */}
          <button
            onClick={() => toggleScriptSelection(script.id)}
            className={`mt-1 transition-colors ${
              selectedScripts.has(script.id)
                ? "text-blue-600"
                : darkMode
                  ? "text-gray-500 hover:text-gray-400"
                  : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {selectedScripts.has(script.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-base truncate">{script.title}</h3>
                  <div className="flex items-center space-x-1">
                    {script.pinned && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                    {script.favorited && <Heart className="h-3 w-3 text-red-500 fill-current" />}
                    {script.imageUrl && <ImageIcon className="h-3 w-3 text-blue-500" />}
                  </div>
                </div>

                {script.description && (
                  <p className={`text-sm mb-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{script.description}</p>
                )}

                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                  <span className="flex items-center">
                    <History className="h-3 w-3 mr-1" />v{script.version}
                  </span>
                  <span className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {wordCount} words
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded ${
                      darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {script.category}
                  </span>
                  {script.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={`px-1.5 py-0.5 text-xs rounded ${
                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                  {script.tags.length > 2 && <span className="text-xs text-gray-400">+{script.tags.length - 2}</span>}
                </div>

                {/* Content Preview */}
                <div
                  className={`text-sm p-3 rounded ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  } whitespace-pre-wrap transition-all duration-200`}
                >
                  {isExpanded ? script.content : previewContent}
                </div>

                {script.content.length > 150 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`mt-2 flex items-center space-x-1 text-xs font-medium transition-colors ${
                      darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                    }`}
                  >
                    {isExpanded ? (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        <span>Show less</span>
                      </>
                    ) : (
                      <>
                        <ChevronRight className="h-3 w-3" />
                        <span>Show full content</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Copy Button */}
              <button
                onClick={() => copyToClipboard(script.content, script.id)}
                className={`ml-4 flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  copiedId === script.id ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
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
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScriptListItem
