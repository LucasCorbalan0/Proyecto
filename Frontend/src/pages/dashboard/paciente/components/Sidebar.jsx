import {
  Home,
  FileText,
  Pill,
  FlaskConical,
  Activity,
  User,
  Receipt,
  LogOut,
  Stethoscope,
} from "lucide-react";

export function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { id: "inicio", icon: Home, label: "Inicio" },
    { id: "buscar-medicos", icon: Stethoscope, label: "Buscar Médicos" },
    { id: "historia-clinica", icon: FileText, label: "Mi Historia Clínica" },
    { id: "recetas", icon: Pill, label: "Recetas" },
    { id: "estudios", icon: FlaskConical, label: "Estudios" },
    { id: "cirugias", icon: Activity, label: "Mis Cirugías" },
    { id: "cuenta", icon: User, label: "Mi Cuenta" },
    { id: "facturacion", icon: Receipt, label: "Facturación y Pagos" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <div className="w-5 h-1 bg-white rotate-90"></div>
            <div className="w-1 h-5 bg-white -ml-3"></div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            MediCare Clinic
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === id
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
