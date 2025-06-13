"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ImageIcon, X, Clipboard, AlertCircle, Maximize2 } from "lucide-react"
import { compressImage, storeImage } from "../lib/image-storage"
import ImagePreviewModal from "./image-preview-modal"

interface ImageUploadProps {
  initialImageUrl?: string | null
  onImageChange: (imageUrl: string | null) => void
  darkMode: boolean
}

const ImageUpload = ({ initialImageUrl, onImageChange, darkMode }: ImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showPasteHint, setShowPasteHint] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    // Basic validation
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      // Compress the image
      const compressedFile = await compressImage(file)

      // Store the image (as base64 for small images)
      const imageData = await storeImage(compressedFile)

      if (imageData) {
        setImageUrl(imageData)
        onImageChange(imageData)
      } else {
        // If we couldn't store the image, use a placeholder
        setUploadError("Image too large. Please use a smaller image (under 500KB) or try a different image.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setUploadError("Failed to process image. Please try again with a smaller image.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle paste events
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!isFocused) return

      const items = e.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.startsWith("image/")) {
          e.preventDefault()
          const file = item.getAsFile()
          if (file) {
            await handleFileUpload(file)
          }
          break
        }
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [isFocused])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await handleFileUpload(file)
  }

  const handleRemoveImage = () => {
    setImageUrl(null)
    onImageChange(null)
    setIsUploading(false)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Check if the image is base64
  const isBase64Image = imageUrl?.startsWith("data:image/")

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Image (Optional)</label>

      {imageUrl ? (
        <div className="relative">
          <div className="group cursor-pointer" onClick={() => setShowPreview(true)}>
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Script description"
              className="w-full max-h-48 object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <Maximize2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="h-4 w-4" />
          </button>

          {isBase64Image && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Embedded
            </div>
          )}
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
            darkMode ? "border-gray-600 hover:border-gray-500" : "border-gray-300 hover:border-gray-400"
          } ${showPasteHint ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""}`}
          tabIndex={0}
          onFocus={() => {
            setIsFocused(true)
            setShowPasteHint(true)
          }}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false)
              setShowPasteHint(false)
            }, 100)
          }}
          onClick={() => containerRef.current?.focus()}
        >
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" ref={fileInputRef} />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="text-sm">Processing image...</span>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="flex flex-col items-center justify-center w-full hover:opacity-80 transition-opacity"
              >
                <ImageIcon className="h-10 w-10 mb-2 text-gray-400" />
                <span className="text-sm font-medium">Click to upload an image</span>
                <span className="text-xs text-gray-500 mt-1">
                  Images up to 500KB (larger images will be compressed)
                </span>
              </button>

              <div className="flex items-center justify-center">
                <div className={`h-px flex-1 ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
                <span className="px-3 text-xs text-gray-500">OR</span>
                <div className={`h-px flex-1 ${darkMode ? "bg-gray-600" : "bg-gray-300"}`}></div>
              </div>

              <div className="flex flex-col items-center">
                <Clipboard
                  className={`h-6 w-6 mb-1 ${showPasteHint ? "text-blue-500" : "text-gray-400"} transition-colors`}
                />
                <span className="text-xs text-center">
                  {showPasteHint ? (
                    <span className="text-blue-600 font-medium">Ready! Press Ctrl+V to paste</span>
                  ) : (
                    <span className="text-gray-500">Click here, then paste image (Ctrl+V)</span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="flex items-center space-x-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-red-600 dark:text-red-400 text-sm">{uploadError}</p>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-1">
        <p>Note: Images are stored directly in the database. For best performance, use images under 500KB.</p>
      </div>

      {showPreview && imageUrl && (
        <ImagePreviewModal
          imageUrl={imageUrl}
          alt="Image Preview"
          onClose={() => setShowPreview(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}

export default ImageUpload
