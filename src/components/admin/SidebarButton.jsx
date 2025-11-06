export default function SidebarButton({ icon: Icon, label, section, active, setActive }) {
  const isActive = active === section
  return (
    <button onClick={() => setActive(section)} className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}