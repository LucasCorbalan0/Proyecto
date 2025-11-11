import { useState } from "react"
import { Toaster } from "react-hot-toast"
import {
  Home,
  Users,
  BedDouble,
  Box,
  Truck,
  Archive,
  Receipt,
  BarChart2,
  ClipboardList,
  Stethoscope,
  Bell,
  RefreshCw,
  LogOut,
} from "lucide-react"
import {
  InicioContent,
  UsuariosContent,
  InfraestructuraContent,
  ProductosContent,
  ComprasContent,
  PrestacionesContent,
  FacturacionContent,
  ReportesContent,
  AuditoriaContent,
  EspecialidadesContent,
  SidebarButton,
} from "../../../components/admin"

export default function AdminHospitalDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")

  const renderContent = () => {
    switch (activeSection) {
      case "inicio": return <InicioContent setActive={setActiveSection} />
      case "usuarios": return <UsuariosContent />
      case "infraestructura": return <InfraestructuraContent />
      case "productos": return <ProductosContent />
      case "compras": return <ComprasContent />
      case "prestaciones": return <PrestacionesContent />
      case "facturacion": return <FacturacionContent />
      case "reportes": return <ReportesContent />
      case "auditoria": return <AuditoriaContent />
      case "especialidades": return <EspecialidadesContent />
      default: return <InicioContent setActive={setActiveSection} />
    }
  }

  const handleAdminLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-semibold">
              AH
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AdminHospital</h2>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <SidebarButton icon={Home} label="Inicio" section="inicio" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={Users} label="Gestión de Usuarios" section="usuarios" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={BedDouble} label="Infraestructura" section="infraestructura" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={Box} label="Productos & Proveedores" section="productos" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={Truck} label="Compras / Stock-Lotes" section="compras" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={Archive} label="Prestaciones y Precios" section="prestaciones" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={Receipt} label="Facturación" section="facturacion" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={BarChart2} label="Reportes" section="reportes" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={ClipboardList} label="Auditoría" section="auditoria" active={activeSection} setActive={setActiveSection} />
          <SidebarButton icon={Stethoscope} label="Especialidades" section="especialidades" active={activeSection} setActive={setActiveSection} />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleAdminLogout}
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
            <span className="text-gray-700">Hola, <span className="font-semibold">Administrador</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Bell className="w-5 h-5 text-gray-600" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><RefreshCw className="w-5 h-5 text-gray-600" /></button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  )
}