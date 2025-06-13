"use client"

import { X } from "lucide-react"

interface ImagePreviewModalProps {
  imageUrl: string
  alt: string
  onClose: () => void
  darkMode: boolean
}

const ImagePreviewModal = ({ imageUrl, alt, onClose, darkMode }: ImagePreviewModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
        >
          <X className="h-6 w-6" />
        </button>

        <div
          className={`relative rounded-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"} p-2`}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={alt}
            className="max-h-[80vh] max-w-full mx-auto object-contain"
          />

          <div className="mt-2 px-4 py-2 flex justify-between items-center">
            <span className="text-sm opacity-70">{alt}</span>
            {imageUrl.startsWith("data:image/") && (
              <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">Embedded</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePreviewModal
