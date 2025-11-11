import { User, Bell, RefreshCw } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-gray-400" />
        <span className="text-gray-700">Hola {localStorage.getItem("nombre")}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
