"use client"

import { Heart, Star, Settings, Download, Upload, Sun, Moon, LogOut } from "lucide-react"

const Header = ({
  scripts,
  darkMode,
  setDarkMode,
  showQuickActions,
  setShowQuickActions,
  showFavoritesOnly,
  setShowFavoritesOnly,
  showPinnedOnly,
  setShowPinnedOnly,
  selectedScripts,
  showBulkActions,
  setShowBulkActions,
  exportScripts,
  importScripts,
  signOut,
  user,
}) => {
  return (
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

            <div className="flex items-center ml-2">
              <div className="hidden md:block mr-2">
                <div className="text-sm font-medium">{user.email || "Guest User"}</div>
              </div>
              <button
                onClick={signOut}
                className={`p-2 rounded-lg transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"}`}
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
