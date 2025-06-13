"use client"

import { useState } from "react"
import { X, Tag, Eye, EyeOff } from "lucide-react"
import ImageUpload from "./image-upload"

const ScriptModal = ({ script, categories, onSave, onClose, darkMode }) => {
  const [formData, setFormData] = useState({
    title: script?.title || "",
    category: script?.category || "Others",
    content: script?.content || "",
    description: script?.description || "",
    imageUrl: script?.imageUrl || null,
    tags: script?.tags || [],
  })
  const [newTag, setNewTag] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [textareaRef, setTextareaRef] = useState(null)
  const [selectionStart, setSelectionStart] = useState(0)
  const [selectionEnd, setSelectionEnd] = useState(0)

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

  const handleImageChange = (imageUrl) => {
    setFormData({
      ...formData,
      imageUrl,
    })
  }

  const handleTextFormat = (formatType) => {
    if (!textareaRef) return

    const start = textareaRef.selectionStart
    const end = textareaRef.selectionEnd
    const selectedText = formData.content.substring(start, end)

    let formattedText = selectedText
    let wrapper = ""

    switch (formatType) {
      case "bold":
        wrapper = "**"
        formattedText = `**${selectedText}**`
        break
      case "italic":
        wrapper = "*"
        formattedText = `*${selectedText}*`
        break
      case "underline":
        wrapper = "__"
        formattedText = `__${selectedText}__`
        break
      case "code":
        wrapper = "`"
        formattedText = `\`${selectedText}\``
        break
    }

    const newContent = formData.content.substring(0, start) + formattedText + formData.content.substring(end)

    setFormData({ ...formData, content: newContent })

    // Restore cursor position
    setTimeout(() => {
      if (selectedText) {
        textareaRef.setSelectionRange(start + wrapper.length, end + wrapper.length)
      } else {
        textareaRef.setSelectionRange(start + wrapper.length, start + wrapper.length)
      }
      textareaRef.focus()
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault()
          handleTextFormat("bold")
          break
        case "i":
          e.preventDefault()
          handleTextFormat("italic")
          break
        case "u":
          e.preventDefault()
          handleTextFormat("underline")
          break
        case "`":
          e.preventDefault()
          handleTextFormat("code")
          break
      }
    }
  }

  const renderFormattedText = (text) => {
    if (!text) return "Enter script content to see preview..."

    // Replace markdown-style formatting with HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/__(.*?)__/g, "<u>$1</u>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-600 px-1 rounded text-sm">$1</code>')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.title.trim() && formData.content.trim()) {
      // Check if the image is too large (if it's a base64 string)
      if (
        formData.imageUrl &&
        typeof formData.imageUrl === "string" &&
        formData.imageUrl.startsWith("data:image/") &&
        formData.imageUrl.length > 700000 // Increased limit to match 500KB
      ) {
        setFormData({
          ...formData,
          imageUrl: null,
        })
        alert("Image is too large and has been removed. Please use a smaller image.")
      }
      onSave(formData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="space-y-6">
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

                <ImageUpload
                  initialImageUrl={formData.imageUrl}
                  onImageChange={handleImageChange}
                  darkMode={darkMode}
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Script Content *</label>
                    <div className="flex items-center space-x-2">
                      {/* Formatting Toolbar */}
                      <div className="flex items-center space-x-1 mr-2">
                        <button
                          type="button"
                          onClick={() => handleTextFormat("bold")}
                          className={`p-1.5 rounded text-sm font-bold transition-colors ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          title="Bold (Ctrl+B)"
                        >
                          B
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTextFormat("italic")}
                          className={`p-1.5 rounded text-sm italic transition-colors ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          title="Italic (Ctrl+I)"
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTextFormat("underline")}
                          className={`p-1.5 rounded text-sm underline transition-colors ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          title="Underline (Ctrl+U)"
                        >
                          U
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTextFormat("code")}
                          className={`p-1.5 rounded text-sm font-mono transition-colors ${
                            darkMode
                              ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                          title="Code (Ctrl+`)"
                        >
                          {"</>"}
                        </button>
                      </div>

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
                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showPreview ? "Hide Preview" : "Show Preview"}</span>
                      </button>
                    </div>
                  </div>

                  {showPreview ? (
                    <div
                      className={`w-full p-3 rounded-lg border min-h-[150px] whitespace-pre-wrap ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-300"}`}
                    >
                      <div
                        className="text-sm whitespace-pre-wrap break-words"
                        dangerouslySetInnerHTML={{ __html: renderFormattedText(formData.content) }}
                      />
                    </div>
                  ) : (
                    <textarea
                      ref={(ref) => setTextareaRef(ref)}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      onKeyDown={handleKeyDown}
                      onSelect={(e) => {
                        setSelectionStart(e.target.selectionStart)
                        setSelectionEnd(e.target.selectionEnd)
                      }}
                      rows={6}
                      className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                          : "bg-white border-gray-300 focus:border-blue-500"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                      placeholder="Enter the script content that agents will copy... Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline, Ctrl+` for code"
                      required
                    />
                  )}
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
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
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
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    {script ? "Update Script" : "Create Script"}
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <span className="text-sm text-gray-500">How your script will appear</span>
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
                      <h3 className="font-semibold text-lg mb-1">{formData.title || "Script Title"}</h3>
                      {formData.description && (
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {formData.description}
                        </p>
                      )}

                      {formData.imageUrl && (
                        <div className="relative mt-2 mb-2">
                          <img
                            src={formData.imageUrl || "/placeholder.svg"}
                            alt={formData.title || "Script image"}
                            className="w-full max-h-40 object-contain rounded-md"
                          />
                          {formData.imageUrl.startsWith("data:image/") && (
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 py-0.5 rounded">
                              Embedded
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">v1</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`text-sm mb-4 p-3 rounded whitespace-pre-wrap ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                >
                  <div dangerouslySetInnerHTML={{ __html: renderFormattedText(formData.content) }} />
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${darkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}
                  >
                    {formData.category}
                  </span>
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all"
                  disabled
                >
                  <span>Copy Script</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScriptModal
