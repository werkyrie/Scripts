"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Tag, Eye, EyeOff } from "lucide-react"

interface Template {
  id: string
  name: string
  description?: string
  content: string
  placeholders: string[]
  createdAt: string
}

interface TemplateModalProps {
  template: Template | null
  onSave: (formData: Omit<Template, "id" | "createdAt">) => Promise<void>
  onClose: () => void
  darkMode: boolean
  isSubmitting?: boolean
}

const TemplateModal = ({ template, onSave, onClose, darkMode, isSubmitting = false }: TemplateModalProps) => {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    content: template?.content || "",
    placeholders: template?.placeholders || [],
  })
  const [newPlaceholder, setNewPlaceholder] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || "",
        content: template.content,
        placeholders: template.placeholders,
      })
    }
  }, [template])

  const addPlaceholder = () => {
    if (newPlaceholder.trim() && !formData.placeholders.includes(newPlaceholder.trim())) {
      setFormData({
        ...formData,
        placeholders: [...formData.placeholders, newPlaceholder.trim()],
      })
      setNewPlaceholder("")
    }
  }

  const removePlaceholder = (placeholderToRemove: string) => {
    setFormData({
      ...formData,
      placeholders: formData.placeholders.filter((placeholder) => placeholder !== placeholderToRemove),
    })
  }

  const detectPlaceholders = () => {
    const regex = /\{\{([^}]+)\}\}/g
    const matches = formData.content.match(regex)
    if (matches) {
      const detectedPlaceholders = matches.map((match) => match.replace(/[{}]/g, ""))
      const uniquePlaceholders = [...new Set([...formData.placeholders, ...detectedPlaceholders])]
      setFormData({
        ...formData,
        placeholders: uniquePlaceholders,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim() && formData.content.trim()) {
      onSave(formData)
    }
  }

  // Highlight placeholders in the preview
  const highlightPlaceholders = (content: string) => {
    let highlighted = content
    formData.placeholders.forEach((placeholder) => {
      const regex = new RegExp(`\\{\\{${placeholder}\\}\\}`, "g")
      highlighted = highlighted.replace(
        regex,
        `<span class="${darkMode ? "text-blue-400" : "text-blue-600"} font-medium whitespace-pre-wrap">{{${placeholder}}}</span>`,
      )
    })
    return highlighted
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg transition-colors ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{template ? "Edit Template" : "Create Template"}</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    placeholder="e.g., Customer Greeting, Order Confirmation, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                    placeholder="Brief description of when to use this template"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Template Content *</label>
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                        showPreview
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : darkMode
                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                            : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {showPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
                    </button>
                  </div>

                  {showPreview ? (
                    <div
                      className={`w-full p-3 rounded-lg border min-h-[150px] whitespace-pre-wrap ${
                        darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"
                      }`}
                    >
                      <div
                        className="text-sm whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: highlightPlaceholders(formData.content) }}
                      />
                    </div>
                  ) : (
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      onBlur={detectPlaceholders}
                      rows={6}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                          : "bg-white border-gray-300 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="Enter your template content. Use {{placeholder}} for personalization (e.g., Hello {{name}}!)"
                      required
                    />
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Use double curly braces for placeholders: {"{"}
                    {"{"} name {"}"}
                    {"}"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Placeholders</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newPlaceholder}
                      onChange={(e) => setNewPlaceholder(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPlaceholder())}
                      className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                          : "bg-white border-gray-300 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="Add a placeholder (e.g., name)"
                    />
                    <button
                      type="button"
                      onClick={addPlaceholder}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <Tag className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.placeholders.map((placeholder) => (
                      <span
                        key={placeholder}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded ${
                          darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {placeholder}
                        <button
                          type="button"
                          onClick={() => removePlaceholder(placeholder)}
                          className="hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={detectPlaceholders}
                    className="mt-2 text-sm text-blue-500 hover:text-blue-600"
                  >
                    Auto-detect placeholders from content
                  </button>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </span>
                    ) : template ? (
                      "Update Template"
                    ) : (
                      "Create Template"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">Template Preview</h3>
                <span className="text-sm text-gray-500">How your template will appear</span>
              </div>

              {/* Card Preview */}
              <div
                className={`rounded-lg p-6 transition-all duration-300 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } shadow-sm border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{formData.name || "Template Name"}</h3>
                      {formData.description && (
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {formData.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          {formData.placeholders.length} placeholder{formData.placeholders.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm mb-4 p-3 rounded whitespace-pre-wrap ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: highlightPlaceholders(formData.content) }} />
                </div>

                {formData.placeholders.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {formData.placeholders.map((placeholder) => (
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
                )}

                <button
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all"
                  disabled
                >
                  <span>Personalize & Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateModal
