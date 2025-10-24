"use client"

import { useState } from "react"
import {
  Home,
  Calendar,
  FileText,
  Pill,
  FlaskConical,
  User,
  Receipt,
  ChevronDown,
  Bell,
  RefreshCw,
  LogOut,
} from "lucide-react"
import Link from "next/link"

export default function PacienteDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")
  const [historiaClinicaOpen, setHistoriaClinicaOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <div className="w-5 h-1 bg-white rotate-90"></div>
              <div className="w-1 h-5 bg-white -ml-3"></div>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">MediCare Clinic</h2>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveSection("inicio")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "inicio" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Inicio</span>
          </button>

          <button
            onClick={() => setActiveSection("turnos")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "turnos" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Mis Turnos</span>
          </button>

          <div className="mb-2">
            <button
              onClick={() => setHistoriaClinicaOpen(!historiaClinicaOpen)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Mi Historia Clínica</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${historiaClinicaOpen ? "rotate-180" : ""}`} />
            </button>
            {historiaClinicaOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Consultas
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Recetas
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Estudios
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveSection("recetas")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "recetas" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Pill className="w-5 h-5" />
            <span className="font-medium">Recetas</span>
          </button>

          <button
            onClick={() => setActiveSection("estudios")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "estudios" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FlaskConical className="w-5 h-5" />
            <span className="font-medium">Estudios</span>
          </button>

          <button
            onClick={() => setActiveSection("cuenta")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "cuenta" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="w-5 h-5" />
            <span className="font-medium">Mi Cuenta</span>
          </button>

          <button
            onClick={() => setActiveSection("facturacion")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "facturacion" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Receipt className="w-5 h-5" />
            <span className="font-medium">Facturación y Pagos</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">Hola, Ana,</span>
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

        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Hola, Ana.</h1>

          {/* Próximos Turnos Section */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Turnos</h2>
            <div className="space-y-4">
              {/* Turno 1 */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mar. 10 / 10:00 AM</p>
                    <h3 className="text-lg font-semibold text-gray-900">Dr. Juan Perez</h3>
                    <p className="text-gray-600">Cardiología</p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                    Cancelar Turno
                  </button>
                </div>
              </div>

              {/* Turno 2 */}
              <div className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Vie. 12 / 15:30 PM</p>
                    <h3 className="text-lg font-semibold text-gray-900">Dra. Laura García</h3>
                    <p className="text-gray-600">Dermatogía</p>
                  </div>
                  <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                    Cancelar Turno
                  </button>
                </div>
              </div>
            </div>

            {/* Solicitar Nuevo Turno Button */}
            <button className="w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg">
              Solicitar Nuevo Turno
            </button>
          </div>

          {/* Últimos Resultados Section */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Resultass</h2>
            <div className="space-y-2">
              <Link href="#" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Análisis de Slangre - PDF
              </Link>
              <Link href="#" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                Radiografía - Ver informe
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
