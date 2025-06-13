"use client"

import { useState } from "react"
import { X, Check, User, AtSign, Package, Calendar, MessageSquare, Tag } from "lucide-react"

interface Template {
  id: string
  name: string
  description?: string
  content: string
  placeholders: string[]
  createdAt: string
}

interface PersonalizeModalProps {
  template: Template
  onClose: () => void
  onCopy: (content: string) => void
  darkMode: boolean
}

const PersonalizeModal = ({ template, onClose, onCopy, darkMode }: PersonalizeModalProps) => {
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({})

  const getPlaceholderIcon = (placeholder: string) => {
    switch (placeholder.toLowerCase()) {
      case "name":
      case "customer":
      case "customername":
      case "firstname":
      case "lastname":
        return <User className="h-5 w-5" />
      case "email":
      case "company":
      case "companyname":
        return <AtSign className="h-5 w-5" />
      case "order":
      case "ordernumber":
      case "product":
        return <Package className="h-5 w-5" />
      case "date":
      case "time":
        return <Calendar className="h-5 w-5" />
      case "message":
      case "note":
      case "comment":
      case "custommessage":
        return <MessageSquare className="h-5 w-5" />
      default:
        return <Tag className="h-5 w-5" />
    }
  }

  const getPlaceholderLabel = (placeholder: string) => {
    // Convert camelCase or snake_case to Title Case with spaces
    return placeholder
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
      .trim()
  }

  const getPlaceholderType = (placeholder: string) => {
    const lower = placeholder.toLowerCase()
    if (lower.includes("date")) return "date"
    if (lower.includes("message") || lower.includes("note") || lower.includes("comment")) return "textarea"
    return "text"
  }

  // Update the personalize function to preserve line breaks
  const personalize = () => {
    let personalizedContent = template.content

    // Replace all placeholders with their values
    template.placeholders.forEach((placeholder) => {
      const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g")
      const value = placeholderValues[placeholder] || `[${getPlaceholderLabel(placeholder)}]`
      personalizedContent = personalizedContent.replace(regex, value)
    })

    onCopy(personalizedContent)
  }

  // Update the highlightPlaceholders function to preserve line breaks
  const highlightPlaceholders = (content: string) => {
    let highlighted = content

    template.placeholders.forEach((placeholder) => {
      const value = placeholderValues[placeholder] || `[${getPlaceholderLabel(placeholder)}]`
      // Convert line breaks to <br> tags for HTML display
      const formattedValue = value.replace(/\n/g, "<br>")
      const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g")
      highlighted = highlighted.replace(
        regex,
        `<span class="${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"} px-1 rounded whitespace-pre-line">${formattedValue}</span>`,
      )
    })

    return highlighted
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-2xl w-full rounded-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"} max-h-[90vh] overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Personalize: {template.name}</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Template</h3>
            <div
              className={`p-4 rounded text-sm whitespace-pre-wrap ${darkMode ? "bg-gray-700" : "bg-gray-100"} mb-2`}
              dangerouslySetInnerHTML={{ __html: highlightPlaceholders(template.content) }}
            />
            {template.description && (
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{template.description}</p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Fill in the placeholders</h3>
            {template.placeholders.map((placeholder) => (
              <div key={placeholder}>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  {getPlaceholderIcon(placeholder)}
                  {getPlaceholderLabel(placeholder)}
                </label>
                {getPlaceholderType(placeholder) === "textarea" ? (
                  <textarea
                    value={placeholderValues[placeholder] || ""}
                    onChange={(e) => setPlaceholderValues({ ...placeholderValues, [placeholder]: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    placeholder={`Enter ${getPlaceholderLabel(placeholder).toLowerCase()}`}
                  />
                ) : getPlaceholderType(placeholder) === "date" ? (
                  <input
                    type="date"
                    value={placeholderValues[placeholder] || ""}
                    onChange={(e) => setPlaceholderValues({ ...placeholderValues, [placeholder]: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  />
                ) : (
                  <textarea
                    value={placeholderValues[placeholder] || ""}
                    onChange={(e) => setPlaceholderValues({ ...placeholderValues, [placeholder]: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    placeholder={`Enter ${getPlaceholderLabel(placeholder).toLowerCase()}`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <div
              className={`p-4 rounded text-sm whitespace-pre-wrap ${darkMode ? "bg-gray-700" : "bg-gray-100"} mb-4`}
              dangerouslySetInnerHTML={{ __html: highlightPlaceholders(template.content) }}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={personalize}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Copy Personalized</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalizeModal
