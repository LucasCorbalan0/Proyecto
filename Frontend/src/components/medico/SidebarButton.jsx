export function SidebarButton({ icon: Icon, label, section, active, setActive }) {
  return (
    <button
      onClick={() => setActive(section)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
        active === section
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  )
}
