"use client"

import { CheckSquare, Square, Copy, Check, Heart, Star, ImageIcon } from "lucide-react"

const ScriptDenseRow = ({ script, darkMode, selectedScripts, toggleScriptSelection, copyToClipboard, copiedId }) => {
  const wordCount = script.content.split(/\s+/).filter((word) => word.length > 0).length
  const previewContent = script.content.length > 80 ? script.content.substring(0, 80) + "..." : script.content

  return (
    <tr
      className={`transition-colors ${
        darkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
      } ${selectedScripts.has(script.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
    >
      {/* Checkbox */}
      <td className="px-4 py-3">
        <button
          onClick={() => toggleScriptSelection(script.id)}
          className={`transition-colors ${
            selectedScripts.has(script.id)
              ? "text-blue-600"
              : darkMode
                ? "text-gray-500 hover:text-gray-400"
                : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {selectedScripts.has(script.id) ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
        </button>
      </td>

      {/* Title & Indicators */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm truncate max-w-[200px]">{script.title}</span>
          <div className="flex items-center space-x-1">
            {script.pinned && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            {script.favorited && <Heart className="h-3 w-3 text-red-500 fill-current" />}
            {script.imageUrl && <ImageIcon className="h-3 w-3 text-blue-500" />}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded ${
            darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"
          }`}
        >
          {script.category}
        </span>
      </td>

      {/* Content Preview */}
      <td className="px-4 py-3 max-w-[300px]">
        <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{previewContent}</div>
      </td>

      {/* Word Count */}
      <td className="px-4 py-3 text-sm text-gray-500">{wordCount}</td>

      {/* Version */}
      <td className="px-4 py-3 text-sm text-gray-500">v{script.version}</td>

      {/* Copy Button */}
      <td className="px-4 py-3">
        <button
          onClick={() => copyToClipboard(script.content, script.id)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
            copiedId === script.id ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {copiedId === script.id ? (
            <>
              <Check className="h-3 w-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </td>
    </tr>
  )
}

export default ScriptDenseRow
