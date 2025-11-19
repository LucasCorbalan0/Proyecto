import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import {
  Home,
  Calendar,
  Clock,
  FileText,
  Pill,
  Stethoscope,
  Activity,
  LogOut,
  Bell,
  RefreshCw,
} from "lucide-react";
import {
  InicioContent,
  AgendaContent,
  DisponibilidadContent,
  ConsultasContent,
  RecetasContent,
  EstudiosContent,
  CirugiasContent,
  SidebarButton,
} from "../../../components/medico";

export default function MedicoDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("inicio");

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return <InicioContent setActive={setActiveSection} />;
      case "agenda":
        return <AgendaContent />;
      case "disponibilidad":
        return <DisponibilidadContent />;
      case "consultas":
        return <ConsultasContent />;
      case "recetas":
        return <RecetasContent />;
      case "estudios":
        return <EstudiosContent />;
      case "cirugias":
        return <CirugiasContent />;
      default:
        return <InicioContent setActive={setActiveSection} />;
    }
  };

  const handleLogout = () => {
    logout();
  };

  const medicName = user?.nombre || "Médico";

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-semibold">
              MD
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Médico</h2>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <SidebarButton
            icon={Home}
            label="Inicio"
            section="inicio"
            active={activeSection}
            setActive={setActiveSection}
          />
          <SidebarButton
            icon={Calendar}
            label="Agenda de Turnos"
            section="agenda"
            active={activeSection}
            setActive={setActiveSection}
          />
          <SidebarButton
            icon={Clock}
            label="Mi Disponibilidad"
            section="disponibilidad"
            active={activeSection}
            setActive={setActiveSection}
          />
          <SidebarButton
            icon={Stethoscope}
            label="Mis Consultas"
            section="consultas"
            active={activeSection}
            setActive={setActiveSection}
          />
          <SidebarButton
            icon={Pill}
            label="Recetas Electrónicas"
            section="recetas"
            active={activeSection}
            setActive={setActiveSection}
          />
          <SidebarButton
            icon={FileText}
            label="Solicitar Estudios"
            section="estudios"
            active={activeSection}
            setActive={setActiveSection}
          />
          <SidebarButton
            icon={Activity}
            label="Cirugías"
            section="cirugias"
            active={activeSection}
            setActive={setActiveSection}
          />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">
              Hola, <span className="font-semibold">{medicName}</span>
            </span>
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

        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
