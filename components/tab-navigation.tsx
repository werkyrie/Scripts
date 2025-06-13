"use client"

interface TabNavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  darkMode: boolean
}

const TabNavigation = ({ activeTab, setActiveTab, darkMode }: TabNavigationProps) => {
  const tabs = [
    { id: "scripts", label: "Scripts" },
    { id: "templates", label: "Templates" },
  ]

  return (
    <div className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"} mb-6`}>
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-4 px-1 relative font-medium text-sm ${
              activeTab === tab.id
                ? `${darkMode ? "text-blue-400" : "text-blue-600"} border-b-2 border-blue-500`
                : `${darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TabNavigation
