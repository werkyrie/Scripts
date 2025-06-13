"use client"

import { useState, useMemo } from "react"
import { Search, Plus, CheckSquare, Square } from "lucide-react"
import TemplateCard from "./template-card"
import TemplateModal from "./template-modal"
import PersonalizeModal from "./personalize-modal"

interface Template {
  id: string
  name: string
  description?: string
  content: string
  placeholders: string[]
  createdAt: string
}

interface TemplatesTabProps {
  darkMode: boolean
  templates: Template[]
  addTemplate: (template: Omit<Template, "id" | "createdAt">) => Promise<void>
  updateTemplate: (id: string, template: Partial<Template>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  copyToClipboard: (content: string, id: string) => Promise<void>
  copiedId: string | null
}

const TemplatesTab = ({
  darkMode,
  templates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  copyToClipboard,
  copiedId,
}: TemplatesTabProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set())
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false)
  const [templateToPersonalize, setTemplateToPersonalize] = useState<Template | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredTemplates = useMemo(() => {
    return templates
      .filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortBy === "alphabetical") {
          return a.name.localeCompare(b.name)
        }
        return 0
      })
  }, [templates, searchTerm, sortBy])

  const toggleTemplateSelection = (id: string) => {
    setSelectedTemplates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const selectAllTemplates = () => {
    setSelectedTemplates(new Set(filteredTemplates.map((t) => t.id)))
  }

  const deselectAllTemplates = () => {
    setSelectedTemplates(new Set())
  }

  const handlePersonalize = (template: Template) => {
    setTemplateToPersonalize(template)
    setShowPersonalizeModal(true)
  }

  // Update the handleSaveTemplate function to preserve line breaks
  const handleSaveTemplate = async (formData: Omit<Template, "id" | "createdAt">) => {
    setIsSubmitting(true)
    try {
      // Ensure line breaks are preserved in the content
      const formDataWithPreservedLineBreaks = {
        ...formData,
        content: formData.content,
      }

      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formDataWithPreservedLineBreaks)
      } else {
        await addTemplate(formDataWithPreservedLineBreaks)
      }
    } catch (error) {
      console.error("Error saving template:", error)
      // We don't need to show an error message since we're using local state as fallback
    } finally {
      setIsSubmitting(false)
      setShowModal(false)
      setEditingTemplate(null)
    }
  }

  return (
    <div className="w-full">
      {/* Search and Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-500"
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-3 py-3 rounded-lg border transition-colors ${
              darkMode
                ? "bg-gray-800 border-gray-700 focus:border-blue-500"
                : "bg-white border-gray-300 focus:border-blue-500"
            } focus:outline-none`}
          >
            <option value="recent">Recently Created</option>
            <option value="alphabetical">Alphabetical</option>
          </select>

          {filteredTemplates.length > 0 && (
            <button
              onClick={selectedTemplates.size === filteredTemplates.length ? deselectAllTemplates : selectAllTemplates}
              className={`p-3 rounded-lg transition-colors ${
                darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
              } border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
              title={selectedTemplates.size === filteredTemplates.length ? "Deselect all" : "Select all"}
            >
              {selectedTemplates.size === filteredTemplates.length ? (
                <CheckSquare className="h-5 w-5" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </button>
          )}

          <button
            onClick={() => {
              setEditingTemplate(null)
              setShowModal(true)
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
            title="Add new template"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            darkMode={darkMode}
            selected={selectedTemplates.has(template.id)}
            toggleSelection={() => toggleTemplateSelection(template.id)}
            onEdit={() => {
              setEditingTemplate(template)
              setShowModal(true)
            }}
            onDelete={() => deleteTemplate(template.id)}
            onPersonalize={() => handlePersonalize(template)}
            copiedId={copiedId}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className={`text-center py-16 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          <div className="max-w-md mx-auto">
            <div
              className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                darkMode ? "bg-gray-800" : "bg-gray-100"
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">No templates found</h3>
            <p className="text-sm">
              {searchTerm
                ? "Try adjusting your search criteria."
                : templates.length === 0
                  ? "Create your first template to get started with personalized messages."
                  : "No templates match your current filters."}
            </p>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showModal && (
        <TemplateModal
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onClose={() => {
            setShowModal(false)
            setEditingTemplate(null)
          }}
          darkMode={darkMode}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Personalize Modal */}
      {showPersonalizeModal && templateToPersonalize && (
        <PersonalizeModal
          template={templateToPersonalize}
          onClose={() => {
            setShowPersonalizeModal(false)
            setTemplateToPersonalize(null)
          }}
          onCopy={(content) => {
            copyToClipboard(content, `personalized-${templateToPersonalize.id}`)
            setShowPersonalizeModal(false)
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default TemplatesTab
