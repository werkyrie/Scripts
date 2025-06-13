"use client"

import { useState } from "react"
import DeleteConfirmationModal from "./delete-confirmation-modal"

const BulkActions = ({ darkMode, selectedScripts, deselectAllScripts, categories, bulkUpdateCategory, bulkDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleBulkDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmBulkDelete = () => {
    bulkDelete()
    setShowDeleteModal(false)
  }

  const handleCancelBulkDelete = () => {
    setShowDeleteModal(false)
  }

  return (
    <>
      <div
        className={`border-b transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="font-medium">{selectedScripts.size} scripts selected</span>
              <button onClick={deselectAllScripts} className="text-sm text-blue-500 hover:text-blue-600">
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
                onClick={handleBulkDeleteClick}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelBulkDelete}
        onConfirm={handleConfirmBulkDelete}
        darkMode={darkMode}
        scriptTitle=""
        isMultiple={true}
        count={selectedScripts.size}
      />
    </>
  )
}

export default BulkActions
