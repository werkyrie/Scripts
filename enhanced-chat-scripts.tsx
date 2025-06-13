"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Star,
  StarOff,
  Moon,
  Sun,
  Download,
  Upload,
  Zap,
  History,
  CheckSquare,
  Square,
  Search,
  Tag,
  X,
  Check,
  Heart,
  HeartOff,
  Settings,
  CreditCard,
  Wrench,
  Package,
  RefreshCw,
  UserPlus,
  MoreHorizontal,
  Grid3X3,
  AtSign,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react"

const ChatScriptsApp = () => {
  const [scripts, setScripts] = useState([
    {
      id: 1,
      title: "Payment Processing Issue",
      category: "Transactions",
      content:
        "Hello! I understand you're experiencing issues with payment processing. Let me help you resolve this immediately. Can you please provide your transaction ID?",
      description: "For payment-related problems",
      tags: ["urgent", "payment"],
      pinned: true,
      favorited: false,
      createdAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: 2,
      title: "Order Status Inquiry",
      category: "Orders",
      content:
        "Thank you for contacting us about your order. I'd be happy to check the status for you. Please provide your order number, and I'll give you an immediate update.",
      description: "Standard order status response",
      tags: ["tracking", "status"],
      pinned: false,
      favorited: true,
      createdAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: 3,
      title: "Welcome New Customer",
      category: "Introduction",
      content:
        "Welcome to our service! I'm here to assist you today. How may I help you get started with your account?",
      description: "Greeting for new customers",
      tags: ["welcome", "new"],
      pinned: true,
      favorited: false,
      createdAt: new Date().toISOString(),
      version: 2,
    },
    {
      id: 4,
      title: "Technical Support Escalation",
      category: "Troubleshooting",
      content:
        "I understand this technical issue is causing frustration. Let me escalate this to our technical team for immediate attention. You should receive a response within 2 hours.",
      description: "For complex technical issues",
      tags: ["escalation", "technical"],
      pinned: false,
      favorited: false,
      createdAt: new Date().toISOString(),
      version: 1,
    },
  ])

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
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(null)
  const [personalizeValues, setPersonalizeValues] = useState({
    customerName: "",
    companyName: "",
    orderNumber: "",
    date: "",
    customMessage: "",
  })

  const [showQuickActionModal, setShowQuickActionModal] = useState(false)
  const [editingQuickAction, setEditingQuickAction] = useState(null)
  const [quickActionTemplates, setQuickActionTemplates] = useState([
    {
      id: 1,
      name: "Personalized Greeting",
      content: "Hello {{customerName}}! How can I assist you today?",
      personalize: true,
      placeholders: ["customerName"],
    },
    {
      id: 2,
      name: "Company Introduction",
      content: "Welcome to {{companyName}}! I'm here to help you with any questions you might have.",
      personalize: true,
      placeholders: ["companyName"],
    },
    {
      id: 3,
      name: "Order Follow-up",
      content: "I'm following up on your order #{{orderNumber}} placed on {{date}}. {{customMessage}}",
      personalize: true,
      placeholders: ["orderNumber", "date", "customMessage"],
    },
    {
      id: 4,
      name: "Thank You",
      content: "Thank you for contacting us. Is there anything else I can help you with?",
      personalize: false,
      placeholders: [],
    },
    {
      id: 5,
      name: "Hold Please",
      content: "Please hold on for a moment while I check that for you.",
      personalize: false,
      placeholders: [],
    },
    {
      id: 6,
      name: "Follow Up",
      content: "I'll follow up with you shortly with more information.",
      personalize: false,
      placeholders: [],
    },
  ])

  const categories = [
    { name: "All", icon: Grid3X3 },
    { name: "Transactions", icon: CreditCard },
    { name: "Troubleshooting", icon: Wrench },
    { name: "Orders", icon: Package },
    { name: "Updates", icon: RefreshCw },
    { name: "Introduction", icon: UserPlus },
    { name: "Others", icon: MoreHorizontal },
  ]

  const saveQuickAction = (formData) => {
    if (editingQuickAction) {
      setQuickActionTemplates(
        quickActionTemplates.map((template) =>
          template.id === editingQuickAction.id ? { ...template, ...formData, id: editingQuickAction.id } : template,
        ),
      )
    } else {
      const newTemplate = {
        id: Date.now(),
        ...formData,
      }
      setQuickActionTemplates([...quickActionTemplates, newTemplate])
    }
    setShowQuickActionModal(false)
    setEditingQuickAction(null)
  }

  const deleteQuickAction = (id) => {
    setQuickActionTemplates(quickActionTemplates.filter((template) => template.id !== id))
  }

  const allTags = useMemo(() => {
    const tags = new Set()
    scripts.forEach((script) => {
      script.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  }, [scripts])

  const sortedAndFilteredScripts = useMemo(() => {
    const filtered = scripts.filter((script) => {
      const matchesCategory = activeCategory === "All" || script.category === activeCategory
      const matchesSearch =
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesPinned = !showPinnedOnly || script.pinned
      const matchesFavorites = !showFavoritesOnly || script.favorited
      const matchesTag = !selectedTag || script.tags.includes(selectedTag)
      return matchesCategory && matchesSearch && matchesPinned && matchesFavorites && matchesTag
    })

    // Sort scripts
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "alphabetical":
          return a.title.localeCompare(b.title)
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt)
        default:
          return 0
      }
    })
  }, [scripts, activeCategory, searchTerm, showPinnedOnly, showFavoritesOnly, selectedTag, sortBy])

  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode")
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme))
    } else {
      setDarkMode(true) // Default to dark mode if no saved preference
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])

  const copyToClipboard = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const togglePin = (id) => {
    setScripts(scripts.map((script) => (script.id === id ? { ...script, pinned: !script.pinned } : script)))
  }

  const toggleFavorite = (id) => {
    setScripts(scripts.map((script) => (script.id === id ? { ...script, favorited: !script.favorited } : script)))
  }

  const deleteScript = (id) => {
    setScripts(scripts.filter((script) => script.id !== id))
    setSelectedScripts((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
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

  const selectAllScripts = () => {
    setSelectedScripts(new Set(sortedAndFilteredScripts.map((s) => s.id)))
  }

  const deselectAllScripts = () => {
    setSelectedScripts(new Set())
  }

  const bulkDelete = () => {
    setScripts(scripts.filter((script) => !selectedScripts.has(script.id)))
    setSelectedScripts(new Set())
    setShowBulkActions(false)
  }

  const bulkUpdateCategory = (newCategory) => {
    setScripts(
      scripts.map((script) => (selectedScripts.has(script.id) ? { ...script, category: newCategory } : script)),
    )
    setSelectedScripts(new Set())
    setShowBulkActions(false)
  }

  const saveScript = (formData) => {
    if (editingScript) {
      setScripts(
        scripts.map((script) =>
          script.id === editingScript.id
            ? { ...script, ...formData, id: editingScript.id, version: script.version + 1 }
            : script,
        ),
      )
    } else {
      const newScript = {
        id: Date.now(),
        ...formData,
        pinned: false,
        favorited: false,
        createdAt: new Date().toISOString(),
        version: 1,
      }
      setScripts([...scripts, newScript])
    }
    setShowModal(false)
    setEditingScript(null)
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

  const importScripts = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedScripts = JSON.parse(e.target.result)
          setScripts([...scripts, ...importedScripts])
        } catch (error) {
          alert("Invalid JSON file")
        }
      }
      reader.readAsText(file)
    }
  }

  const addQuickAction = (template) => {
    if (template.personalize) {
      setCurrentTemplate(template)
      // Reset personalize values
      setPersonalizeValues({
        customerName: "",
        companyName: "",
        orderNumber: "",
        date: new Date().toISOString().split("T")[0],
        customMessage: "",
      })
      setShowPersonalizeModal(true)
    } else {
      copyToClipboard(template.content, `quick-${Date.now()}`)
    }
  }

  const handlePersonalize = () => {
    if (!currentTemplate) return

    let personalizedContent = currentTemplate.content

    // Replace all placeholders with their values
    Object.keys(personalizeValues).forEach((key) => {
      const placeholder = `{{${key}}}`
      if (personalizedContent.includes(placeholder)) {
        personalizedContent = personalizedContent.replace(
          new RegExp(placeholder, "g"),
          personalizeValues[key] || `[${key}]`,
        )
      }
    })

    copyToClipboard(personalizedContent, `personalized-${Date.now()}`)
    setShowPersonalizeModal(false)
  }

  const getPlaceholderIcon = (placeholder) => {
    switch (placeholder) {
      case "customerName":
        return <User className="h-5 w-5" />
      case "companyName":
        return <AtSign className="h-5 w-5" />
      case "orderNumber":
        return <Package className="h-5 w-5" />
      case "date":
        return <Calendar className="h-5 w-5" />
      case "customMessage":
        return <MessageSquare className="h-5 w-5" />
      default:
        return <Tag className="h-5 w-5" />
    }
  }

  const getPlaceholderLabel = (placeholder) => {
    switch (placeholder) {
      case "customerName":
        return "Customer Name"
      case "companyName":
        return "Company Name"
      case "orderNumber":
        return "Order Number"
      case "date":
        return "Date"
      case "customMessage":
        return "Custom Message"
      default:
        return placeholder
    }
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pb-20 md:pb-0`}
    >
      {/* Header */}
      <header
        className={`border-b transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl md:text-2xl font-bold">Chat Scripts</h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500">
                <span>{scripts.length} scripts</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className={`p-2 rounded-lg transition-colors ${showQuickActions ? "bg-purple-600 text-white" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                title="Quick actions"
              >
                <Zap className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`p-2 rounded-lg transition-colors ${showFavoritesOnly ? "bg-red-500 text-white" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                title="Show favorites only"
              >
                <Heart className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                className={`p-2 rounded-lg transition-colors ${showPinnedOnly ? "bg-yellow-500 text-white" : darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                title="Show pinned only"
              >
                <Star className="h-5 w-5" />
              </button>
              {selectedScripts.size > 0 && (
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  title="Bulk actions"
                >
                  <Settings className="h-5 w-5" />
                </button>
              )}
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={exportScripts}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                  title="Export scripts"
                >
                  <Download className="h-5 w-5" />
                </button>
                <label
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                  title="Import scripts"
                >
                  <Upload className="h-5 w-5" />
                  <input type="file" accept=".json" onChange={importScripts} className="hidden" />
                </label>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions Panel */}
      {showQuickActions && (
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
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                title="Add quick action"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {quickActionTemplates.map((template, index) => (
                <div
                  key={template.id}
                  className={`relative group p-3 rounded-lg text-left transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                  <button onClick={() => addQuickAction(template)} className="w-full text-left">
                    <div className="font-medium flex items-center gap-2">
                      {template.name}
                      {template.personalize && (
                        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">Personalize</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{template.content}</div>
                  </button>

                  {/* Edit/Delete buttons - show on hover */}
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

                  {template.personalize && (
                    <div className="absolute top-2 right-2 group-hover:hidden">
                      <User className="h-4 w-4 text-blue-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedScripts.size > 0 && (
        <div
          className={`border-b transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{selectedScripts.size} scripts selected</span>
                <button onClick={deselectAllScripts} className="text-sm text-blue-600 hover:text-blue-700">
                  Deselect all
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  onChange={(e) => e.target.value && bulkUpdateCategory(e.target.value)}
                  className={`px-3 py-1 rounded border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                  defaultValue=""
                >
                  <option value="">Change Category</option>
                  {categories
                    .filter((cat) => cat.name !== "All")
                    .map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
                <button
                  onClick={bulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div
              className={`rounded-lg p-6 transition-colors duration-300 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm mb-6`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Categories</h2>
                <button
                  onClick={() => {
                    setEditingScript(null)
                    setShowModal(true)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                  title="Add new script"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        activeCategory === category.name
                          ? "bg-blue-600 text-white"
                          : darkMode
                            ? "hover:bg-gray-700"
                            : "hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </button>
                  )
                })}
              </nav>

              {allTags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-2">Filter by Tags</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedTag("")}
                      className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                        !selectedTag ? "bg-blue-600 text-white" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                    >
                      All Tags
                    </button>
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                        className={`w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                          selectedTag === tag
                            ? "bg-blue-600 text-white"
                            : darkMode
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                        }`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Bar */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scripts..."
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
                {sortedAndFilteredScripts.length > 0 && (
                  <button
                    onClick={
                      selectedScripts.size === sortedAndFilteredScripts.length ? deselectAllScripts : selectAllScripts
                    }
                    className={`p-3 rounded-lg transition-colors ${darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                    title={selectedScripts.size === sortedAndFilteredScripts.length ? "Deselect all" : "Select all"}
                  >
                    {selectedScripts.size === sortedAndFilteredScripts.length ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingScript(null)
                    setShowModal(true)
                  }}
                  className="lg:hidden bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors"
                  title="Add new script"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Scripts Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {sortedAndFilteredScripts.map((script) => (
                <div
                  key={script.id}
                  className={`rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${
                    darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:shadow-xl"
                  } shadow-sm border ${script.pinned ? "ring-2 ring-yellow-400" : ""} ${
                    script.favorited ? "ring-2 ring-red-400" : ""
                  } ${selectedScripts.has(script.id) ? "ring-2 ring-blue-500" : ""} ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start space-x-3 flex-1">
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
                        {selectedScripts.has(script.id) ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{script.title}</h3>
                        {script.description && (
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {script.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <History className="h-3 w-3 mr-1" />v{script.version}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => toggleFavorite(script.id)}
                        className={`p-1 rounded transition-colors ${
                          script.favorited
                            ? "text-red-500 hover:text-red-600"
                            : darkMode
                              ? "text-gray-500 hover:text-gray-400"
                              : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={script.favorited ? "Remove from favorites" : "Add to favorites"}
                      >
                        {script.favorited ? (
                          <Heart className="h-4 w-4 fill-current" />
                        ) : (
                          <HeartOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => togglePin(script.id)}
                        className={`p-1 rounded transition-colors ${
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
                        className={`p-1 rounded transition-colors ${
                          darkMode ? "text-gray-500 hover:text-gray-400" : "text-gray-400 hover:text-gray-600"
                        }`}
                        title="Edit script"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteScript(script.id)}
                        className="p-1 rounded text-red-500 hover:text-red-600 transition-colors"
                        title="Delete script"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className={`text-sm mb-4 p-3 rounded ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                    {script.content}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    <span
                      className={`px-2 py-1 text-xs rounded ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}
                    >
                      {script.category}
                    </span>
                    {/* Hide tags on mobile */}
                    <div className="hidden md:flex flex-wrap gap-1">
                      {script.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs rounded ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(script.content, script.id)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg transition-all ${
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
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {sortedAndFilteredScripts.length === 0 && (
              <div className={`text-center py-12 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <p className="text-lg">No scripts found matching your criteria.</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 border-t transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="grid grid-cols-7 gap-1 p-2">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                  activeCategory === category.name
                    ? "bg-blue-600 text-white"
                    : darkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <IconComponent className="h-5 w-5 mb-1" />
                <span className="text-xs truncate w-full text-center">{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Script Modal */}
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

      {/* Personalize Modal */}
      {showPersonalizeModal && currentTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Personalize: {currentTemplate.name}</h2>
                <button
                  onClick={() => setShowPersonalizeModal(false)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <div className={`p-3 rounded text-sm ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                  {currentTemplate.content}
                </div>
              </div>

              <div className="space-y-4">
                {currentTemplate.placeholders.map((placeholder) => (
                  <div key={placeholder}>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      {getPlaceholderIcon(placeholder)}
                      {getPlaceholderLabel(placeholder)}
                    </label>
                    {placeholder === "customMessage" ? (
                      <textarea
                        value={personalizeValues[placeholder] || ""}
                        onChange={(e) => setPersonalizeValues({ ...personalizeValues, [placeholder]: e.target.value })}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                        placeholder={`Enter ${getPlaceholderLabel(placeholder).toLowerCase()}`}
                      />
                    ) : placeholder === "date" ? (
                      <input
                        type="date"
                        value={personalizeValues[placeholder] || ""}
                        onChange={(e) => setPersonalizeValues({ ...personalizeValues, [placeholder]: e.target.value })}
                        className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                            : "bg-white border-gray-300 focus:border-blue-500"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={personalizeValues[placeholder] || ""}
                        onChange={(e) => setPersonalizeValues({ ...personalizeValues, [placeholder]: e.target.value })}
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

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowPersonalizeModal(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePersonalize}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy Personalized
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Modal */}
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

const ScriptModal = ({ script, categories, onSave, onClose, darkMode }) => {
  const [formData, setFormData] = useState({
    title: script?.title || "",
    category: script?.category || "Others",
    content: script?.content || "",
    description: script?.description || "",
    tags: script?.tags || [],
  })
  const [newTag, setNewTag] = useState("")

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim() && formData.content.trim()) {
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{script ? "Edit Script" : "Add New Script"}</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                required
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                placeholder="Brief description of the script"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Script Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                placeholder="Enter the script content that agents will copy..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  placeholder="Add a tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-sm rounded ${
                      darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {script ? "Update Script" : "Create Script"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const QuickActionModal = ({ template, onSave, onClose, darkMode }) => {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    content: template?.content || "",
    personalize: template?.personalize || false,
    placeholders: template?.placeholders || [],
  })
  const [newPlaceholder, setNewPlaceholder] = useState("")

  const addPlaceholder = () => {
    if (newPlaceholder.trim() && !formData.placeholders.includes(newPlaceholder.trim())) {
      setFormData({
        ...formData,
        placeholders: [...formData.placeholders, newPlaceholder.trim()],
      })
      setNewPlaceholder("")
    }
  }

  const removePlaceholder = (placeholderToRemove) => {
    setFormData({
      ...formData,
      placeholders: formData.placeholders.filter((placeholder) => placeholder !== placeholderToRemove),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name.trim() && formData.content.trim()) {
      onSave(formData)
    }
  }

  const detectPlaceholders = () => {
    const matches = formData.content.match(/\{\{([^}]+)\}\}/g)
    if (matches) {
      const detectedPlaceholders = matches.map((match) => match.replace(/[{}]/g, ""))
      const uniquePlaceholders = [...new Set([...formData.placeholders, ...detectedPlaceholders])]
      setFormData({
        ...formData,
        placeholders: uniquePlaceholders,
        personalize: uniquePlaceholders.length > 0,
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{template ? "Edit Quick Action" : "Add Quick Action"}</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

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
                placeholder="e.g., Greeting, Thank You, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Template Content *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                onBlur={detectPlaceholders}
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                    : "bg-white border-gray-300 focus:border-blue-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                placeholder="Enter your template content. Use {{placeholder}} for personalization (e.g., Hello {{customerName}}!)"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {"Use double curly braces for placeholders: {{customerName}}, {{orderNumber}}, etc."}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="personalize"
                checked={formData.personalize}
                onChange={(e) => setFormData({ ...formData, personalize: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="personalize" className="text-sm font-medium">
                Enable personalization
              </label>
            </div>

            {formData.personalize && (
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
                    placeholder="Add a placeholder (e.g., customerName)"
                  />
                  <button
                    type="button"
                    onClick={addPlaceholder}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
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
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  Auto-detect placeholders from content
                </button>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {template ? "Update Template" : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatScriptsApp
