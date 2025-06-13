"use client"

const MobileNavigation = ({ darkMode, categories, activeCategory, setActiveCategory }) => {
  return (
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
  )
}

export default MobileNavigation
