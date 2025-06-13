"use client"

import { AlertTriangle, X, Trash2 } from "lucide-react"

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  darkMode,
  scriptTitle,
  isMultiple = false,
  count = 1,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className={`max-w-md w-full rounded-lg shadow-xl transition-colors ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {isMultiple ? "Delete Scripts" : "Delete Script"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg transition-colors ${
                darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            {isMultiple ? (
              <div>
                <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Are you sure you want to delete <strong>{count} scripts</strong>?
                </p>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    This action cannot be undone. All selected scripts and their associated data will be permanently
                    removed.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Are you sure you want to delete the script{" "}
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>"{scriptTitle}"</span>?
                </p>
                <div
                  className={`p-4 rounded-lg ${
                    darkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    This action cannot be undone. The script and all its data will be permanently removed.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                darkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isMultiple ? `Delete Scripts` : "Delete Script"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
