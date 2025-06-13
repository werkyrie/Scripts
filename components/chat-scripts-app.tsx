"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-wrapper"
import Header from "./header"
import QuickActions from "./quick-actions"
import BulkActions from "./bulk-actions"
import Sidebar from "./sidebar"
import MainContent from "./main-content"
import TabNavigation from "./tab-navigation"
import TemplatesTab from "./templates-tab"
import MobileNavigation from "./mobile-navigation"
import ScriptModal from "./script-modal"
import QuickActionModal from "./quick-action-modal"
import Login from "./login"
import { categories } from "../data/initial-data"
import {
  subscribeToScripts,
  subscribeToQuickActions,
  subscribeToTemplates,
  updateScript,
  deleteScript,
  addScript,
  addQuickAction,
  updateQuickAction,
  deleteQuickAction,
  addTemplate as fbAddTemplate,
  updateTemplate as fbUpdateTemplate,
  deleteTemplate as fbDeleteTemplate,
} from "../lib/firebase-service"

// Define Template interface
interface Template {
  id: string
  name: string
  description?: string
  content: string
  placeholders: string[]
  createdAt: string
}

const ChatScriptsApp = () => {
  const { user, signOut } = useAuth()
  const [scripts, setScripts] = useState([])
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [darkMode, setDarkMode] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingScript, setEditingScript] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)
  const [selectedTag, setSelectedTag] = useState("")
  const [selectedScripts, setSelectedScripts] = useState(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [showQuickActions, setShowQuickActions] = useState(true)
  const [showQuickActionModal, setShowQuickActionModal] = useState(false)
  const [editingQuickAction, setEditingQuickAction] = useState(null)
  const [quickActionTemplates, setQuickActionTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("scripts")

  // Templates state
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "default-1",
      name: "Customer Greeting",
      description: "A personalized greeting for customers",
      content:
        "Hello {{name}},\n\nThank you for contacting {{company}}. My name is {{agent}} and I'll be assisting you today.\n\nHow may I help you?",
      placeholders: ["name", "company", "agent"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "default-2",
      name: "Order Confirmation",
      description: "Confirm order details with customer",
      content:
        "Thank you for your order #{{orderNumber}} placed on {{date}}.\n\nYour order is being processed and will be shipped within 2 business days.\n\n{{customMessage}}\n\nPlease let me know if you have any questions.",
      placeholders: ["orderNumber", "date", "customMessage"],
      createdAt: new Date().toISOString(),
    },
  ])

  // Update the templates subscription in the useEffect to handle errors better
  useEffect(() => {
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")

    // Wait a bit for auth to fully initialize
    const timer = setTimeout(() => {
      try {
        const unsubscribeScripts = subscribeToScripts((updatedScripts) => {
          setScripts(updatedScripts)
          setIsLoading(false)
        })

        const unsubscribeQuickActions = subscribeToQuickActions((updatedQuickActions) => {
          setQuickActionTemplates(updatedQuickActions)
        })

        // Improved error handling for templates subscription
        let unsubscribeTemplates = () => {}
        try {
          unsubscribeTemplates = subscribeToTemplates((updatedTemplates) => {
            // Only update state if we got actual templates from Firebase
            if (updatedTemplates && updatedTemplates.length > 0) {
              setTemplates(updatedTemplates)
            }
            // If no templates are returned, keep the default templates
          })
        } catch (err) {
          console.error("Failed to subscribe to templates:", err)
          // Continue with default templates
        }

        return () => {
          try {
            unsubscribeScripts()
          } catch (e) {
            console.error(e)
          }
          try {
            unsubscribeQuickActions()
          } catch (e) {
            console.error(e)
          }
          try {
            unsubscribeTemplates()
          } catch (e) {
            console.error(e)
          }
        }
      } catch (err) {
        console.error("Error setting up subscriptions:", err)
        setError("Failed to load data. Please try refreshing the page.")
        setIsLoading(false)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [user])

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    } else {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  // If not authenticated, show login screen
  if (!user) {
    return <Login />
  }

  const copyToClipboard = async (content, id) => {
    try {
      // Ensure we're copying the exact content with preserved formatting
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
      // Fallback method for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = content
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      textArea.style.top = "-999999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand("copy")
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
      } catch (err) {
        console.error("Fallback copy failed:", err)
      }
      document.body.removeChild(textArea)
    }
  }

  const togglePin = async (id) => {
    try {
      const script = scripts.find((s) => s.id === id)
      if (script) {
        await updateScript(id, { pinned: !script.pinned })
      }
    } catch (err) {
      console.error("Error toggling pin:", err)
      setError("Failed to update script. Please try again.")
    }
  }

  const toggleFavorite = async (id) => {
    try {
      const script = scripts.find((s) => s.id === id)
      if (script) {
        await updateScript(id, { favorited: !script.favorited })
      }
    } catch (err) {
      console.error("Error toggling favorite:", err)
      setError("Failed to update script. Please try again.")
    }
  }

  const deleteScriptHandler = async (id) => {
    try {
      await deleteScript(id)
      setSelectedScripts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    } catch (err) {
      console.error("Error deleting script:", err)
      setError("Failed to delete script. Please try again.")
    }
  }

  const toggleScriptSelection = (id) => {
    setSelectedScripts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const selectAllScripts = (filteredScripts) => {
    setSelectedScripts(new Set(filteredScripts.map((s) => s.id)))
  }

  const deselectAllScripts = () => {
    setSelectedScripts(new Set())
  }

  const bulkDelete = async () => {
    try {
      const promises = Array.from(selectedScripts).map((id) => {
        const script = scripts.find((s) => s.id === id)
        return deleteScript(id, script?.imageUrl)
      })
      await Promise.all(promises)
      setSelectedScripts(new Set())
      setShowBulkActions(false)
    } catch (err) {
      console.error("Error bulk deleting:", err)
      setError("Failed to delete some scripts. Please try again.")
    }
  }

  const bulkUpdateCategory = async (newCategory) => {
    try {
      const promises = Array.from(selectedScripts).map((id) => updateScript(id, { category: newCategory }))
      await Promise.all(promises)
      setSelectedScripts(new Set())
      setShowBulkActions(false)
    } catch (err) {
      console.error("Error bulk updating:", err)
      setError("Failed to update some scripts. Please try again.")
    }
  }

  const saveScript = async (formData) => {
    try {
      if (editingScript) {
        await updateScript(editingScript.id, {
          ...formData,
          version: editingScript.version + 1,
        })
      } else {
        await addScript({
          ...formData,
          pinned: false,
          favorited: false,
          version: 1,
        })
      }
      setShowModal(false)
      setEditingScript(null)
    } catch (err) {
      console.error("Error saving script:", err)
      setError("Failed to save script. Please try again.")
    }
  }

  const exportScripts = () => {
    const dataStr = JSON.stringify(scripts, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "chat-scripts.json"
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importScripts = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const importedScripts = JSON.parse(e.target.result)
          const promises = importedScripts.map((script) => {
            const { id, userId, ...scriptData } = script
            return addScript(scriptData)
          })
          await Promise.all(promises)
        } catch (error) {
          console.error("Error importing scripts:", error)
          setError("Failed to import scripts. Please check the file format.")
        }
      }
      reader.readAsText(file)
    }
  }

  const saveQuickAction = async (formData) => {
    try {
      if (editingQuickAction) {
        await updateQuickAction(editingQuickAction.id, formData)
      } else {
        await addQuickAction(formData)
      }
      setShowQuickActionModal(false)
      setEditingQuickAction(null)
    } catch (err) {
      console.error("Error saving quick action:", err)
      setError("Failed to save quick action. Please try again.")
    }
  }

  const deleteQuickActionHandler = async (id) => {
    try {
      await deleteQuickAction(id)
    } catch (err) {
      console.error("Error deleting quick action:", err)
      setError("Failed to delete quick action. Please try again.")
    }
  }

  const addQuickActionHandler = (template) => {
    copyToClipboard(template.content, `quick-${template.id}`)
  }

  // Update the addTemplate function to always use local state
  const addTemplate = async (template: Omit<Template, "id" | "createdAt">) => {
    try {
      // Try to add to Firebase first
      const result = await fbAddTemplate(template)

      // Always add to local state regardless of Firebase result
      const newTemplate = {
        ...template,
        id: result.id || `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }

      setTemplates((prevTemplates) => [...prevTemplates, newTemplate])
      return Promise.resolve()
    } catch (err) {
      console.error("Error adding template:", err)
      // Fall back to local state
      const newTemplate = {
        ...template,
        id: `local-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate])
      return Promise.resolve()
    }
  }

  // Update the updateTemplate function to always use local state
  const updateTemplate = async (id: string, templateUpdate: Partial<Template>) => {
    try {
      // Try Firebase first
      const result = await fbUpdateTemplate(id, templateUpdate)

      // Always update local state
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) => (template.id === id ? { ...template, ...templateUpdate } : template)),
      )
      return Promise.resolve()
    } catch (err) {
      console.error("Error updating template:", err)
      // Fall back to local state
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) => (template.id === id ? { ...template, ...templateUpdate } : template)),
      )
      return Promise.resolve()
    }
  }

  // Update the deleteTemplate function to always use local state
  const deleteTemplate = async (id: string) => {
    try {
      // Try Firebase first
      await fbDeleteTemplate(id)

      // Always update local state
      setTemplates((prevTemplates) => prevTemplates.filter((template) => template.id !== id))
      return Promise.resolve()
    } catch (err) {
      console.error("Error deleting template:", err)
      // Fall back to local state
      setTemplates((prevTemplates) => prevTemplates.filter((template) => template.id !== id))
      return Promise.resolve()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading your scripts...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pb-20 md:pb-0`}
    >
      {error && (
        <div className="bg-red-500 text-white p-3 text-center">
          {error}
          <button onClick={() => setError("")} className="ml-4 underline">
            Dismiss
          </button>
        </div>
      )}

      <Header
        scripts={scripts}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        showQuickActions={showQuickActions}
        setShowQuickActions={setShowQuickActions}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        showPinnedOnly={showPinnedOnly}
        setShowPinnedOnly={setShowPinnedOnly}
        selectedScripts={selectedScripts}
        showBulkActions={showBulkActions}
        setShowBulkActions={setShowBulkActions}
        exportScripts={exportScripts}
        importScripts={importScripts}
        signOut={signOut}
        user={user}
      />

      {showQuickActions && (
        <QuickActions
          darkMode={darkMode}
          quickActionTemplates={quickActionTemplates}
          addQuickAction={addQuickActionHandler}
          setEditingQuickAction={setEditingQuickAction}
          setShowQuickActionModal={setShowQuickActionModal}
          deleteQuickAction={deleteQuickActionHandler}
          copiedId={copiedId}
        />
      )}

      {showBulkActions && selectedScripts.size > 0 && (
        <BulkActions
          darkMode={darkMode}
          selectedScripts={selectedScripts}
          deselectAllScripts={deselectAllScripts}
          categories={categories}
          bulkUpdateCategory={bulkUpdateCategory}
          bulkDelete={bulkDelete}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />

        <div className="flex flex-col lg:flex-row gap-8">
          {activeTab === "scripts" ? (
            <>
              <Sidebar
                darkMode={darkMode}
                categories={categories}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                scripts={scripts}
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
                setEditingScript={setEditingScript}
                setShowModal={setShowModal}
                selectedScripts={selectedScripts}
                toggleFavorite={toggleFavorite}
                togglePin={togglePin}
                deleteScript={deleteScriptHandler}
              />

              <MainContent
                darkMode={darkMode}
                scripts={scripts}
                activeCategory={activeCategory}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showPinnedOnly={showPinnedOnly}
                showFavoritesOnly={showFavoritesOnly}
                selectedTag={selectedTag}
                sortBy={sortBy}
                setSortBy={setSortBy}
                selectedScripts={selectedScripts}
                selectAllScripts={selectAllScripts}
                deselectAllScripts={deselectAllScripts}
                setEditingScript={setEditingScript}
                setShowModal={setShowModal}
                toggleScriptSelection={toggleScriptSelection}
                copyToClipboard={copyToClipboard}
                copiedId={copiedId}
                toggleFavorite={toggleFavorite}
                togglePin={togglePin}
                deleteScript={deleteScriptHandler}
              />
            </>
          ) : (
            <TemplatesTab
              darkMode={darkMode}
              templates={templates}
              addTemplate={addTemplate}
              updateTemplate={updateTemplate}
              deleteTemplate={deleteTemplate}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
            />
          )}
        </div>
      </div>

      <MobileNavigation
        darkMode={darkMode}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {showModal && (
        <ScriptModal
          script={editingScript}
          categories={categories.filter((cat) => cat.name !== "All")}
          onSave={saveScript}
          onClose={() => {
            setShowModal(false)
            setEditingScript(null)
          }}
          darkMode={darkMode}
        />
      )}

      {showQuickActionModal && (
        <QuickActionModal
          template={editingQuickAction}
          onSave={saveQuickAction}
          onClose={() => {
            setShowQuickActionModal(false)
            setEditingQuickAction(null)
          }}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default ChatScriptsApp
