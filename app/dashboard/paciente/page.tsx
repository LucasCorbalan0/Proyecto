"use client"

import { useState } from "react"
import {
  Home,
  FileText,
  Pill,
  FlaskConical,
  User,
  Receipt,
  LogOut,
  Download,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function PacienteDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return <InicioContent />
      case "historia-clinica":
        return <ConsultasContent />
      case "recetas":
        return <RecetasContent />
      case "estudios":
        return <EstudiosContent />
      case "cuenta":
        return <CuentaContent />
      case "facturacion":
        return <FacturacionContent />
      default:
        return <InicioContent />
    }
  }

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
            onClick={() => setActiveSection("historia-clinica")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "historia-clinica" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Mi Historia Clínica</span>
          </button>

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

        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  )
}

function InicioContent() {
  return (
    <>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Resultados</h2>
        <div className="space-y-2">
          <Link href="#" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Análisis de Sangre - PDF
          </Link>
          <Link href="#" className="block text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Radiografía - Ver informe
          </Link>
        </div>
      </div>
    </>
  )
}

function ConsultasContent() {
  const consultas = [
    {
      fecha: "15 de Marzo, 2025",
      medico: "Dr. Juan Perez",
      especialidad: "Cardiología",
      motivo: "Control de presión arterial",
      diagnostico: "Hipertensión controlada",
      tratamiento: "Continuar con medicación actual",
    },
    {
      fecha: "28 de Febrero, 2025",
      medico: "Dra. Laura García",
      especialidad: "Dermatología",
      motivo: "Revisión de lunares",
      diagnostico: "Lunares benignos",
      tratamiento: "Control anual recomendado",
    },
    {
      fecha: "10 de Enero, 2025",
      medico: "Dr. Carlos Mendez",
      especialidad: "Medicina General",
      motivo: "Chequeo anual",
      diagnostico: "Estado de salud general bueno",
      tratamiento: "Mantener hábitos saludables",
    },
  ]

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Historial de Consultas</h1>
      <div className="space-y-4">
        {consultas.map((consulta, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-600">{consulta.fecha}</p>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{consulta.medico}</h3>
                <p className="text-blue-600">{consulta.especialidad}</p>
              </div>
              <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-sm text-gray-500 mb-1">Motivo de consulta</p>
                <p className="text-gray-900">{consulta.motivo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Diagnóstico</p>
                <p className="text-gray-900">{consulta.diagnostico}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Tratamiento</p>
                <p className="text-gray-900">{consulta.tratamiento}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function RecetasContent() {
  const recetasActivas = [
    {
      medicamento: "Enalapril 10mg",
      medico: "Dr. Juan Perez",
      dosis: "1 comprimido cada 12 horas",
      inicio: "15 de Marzo, 2025",
      vencimiento: "15 de Abril, 2025",
      renovaciones: 2,
    },
    {
      medicamento: "Omeprazol 20mg",
      medico: "Dra. María López",
      dosis: "1 comprimido en ayunas",
      inicio: "1 de Marzo, 2025",
      vencimiento: "1 de Junio, 2025",
      renovaciones: 1,
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Recetas Activas</h1>
        <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">
          Solicitar Renovación
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recetasActivas.map((receta, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{receta.medicamento}</h3>
                <p className="text-gray-600 text-sm">Recetado por {receta.medico}</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Activa</span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-start gap-2">
                <Pill className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Dosis</p>
                  <p className="text-gray-900">{receta.dosis}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Período</p>
                  <p className="text-gray-900">
                    {receta.inicio} - {receta.vencimiento}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Renovaciones disponibles</p>
                  <p className="text-gray-900">{receta.renovaciones}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar
              </button>
              <button className="flex-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                Renovar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recetas Vencidas</h2>
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Crema Hidrocortisona 1%</h3>
              <p className="text-sm text-gray-600 mb-2">Recetado por Dra. Laura García</p>
              <p className="text-sm text-gray-500">Vencida el 14 de Marzo, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function EstudiosContent() {
  const estudiosDisponibles = [
    {
      tipo: "Análisis de Sangre Completo",
      fecha: "20 de Marzo, 2025",
      medico: "Dr. Juan Perez",
      estado: "Disponible",
    },
    {
      tipo: "Radiografía de Tórax",
      fecha: "5 de Marzo, 2025",
      medico: "Dr. Carlos Mendez",
      estado: "Disponible",
    },
  ]

  const estudiosPendientes = [
    {
      tipo: "Ecografía Abdominal",
      fechaSolicitada: "22 de Marzo, 2025",
      medico: "Dra. María López",
      estado: "Pendiente",
    },
  ]

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Estudios Médicos</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultados Disponibles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {estudiosDisponibles.map((estudio, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{estudio.tipo}</h3>
                    <p className="text-sm text-gray-600">Solicitado por {estudio.medico}</p>
                    <p className="text-sm text-gray-500 mt-1">{estudio.fecha}</p>
                  </div>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Descargar Resultados
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Estudios Pendientes</h2>
        <div className="space-y-4">
          {estudiosPendientes.map((estudio, index) => (
            <div key={index} className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{estudio.tipo}</h3>
                  <p className="text-sm text-gray-600">Solicitado por {estudio.medico}</p>
                  <p className="text-sm text-gray-500 mt-1">Fecha de solicitud: {estudio.fechaSolicitada}</p>
                  <p className="text-sm text-yellow-700 mt-2 font-medium">Pendiente de realización - Coordinar turno</p>
                </div>
                <button className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors">
                  Agendar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function CuentaContent() {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Nombre Completo</label>
              <p className="text-gray-900 font-medium">Ana María González</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Fecha de Nacimiento</label>
              <p className="text-gray-900 font-medium">15 de Mayo, 1985</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">DNI</label>
              <p className="text-gray-900 font-medium">35.456.789</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Obra Social</label>
              <p className="text-gray-900 font-medium">OSDE 310</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <p className="text-gray-900 font-medium">ana.gonzalez@email.com</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
              <p className="text-gray-900 font-medium">+54 11 4567-8900</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 mb-1 block">Dirección</label>
              <p className="text-gray-900 font-medium">Av. Corrientes 1234, CABA, Buenos Aires</p>
            </div>
          </div>
        </div>

        {/* Información Médica */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Médica</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Grupo Sanguíneo</label>
              <p className="text-gray-900 font-medium">O+</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Alergias</label>
              <p className="text-gray-900 font-medium">Penicilina</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Condiciones Crónicas</label>
              <p className="text-gray-900 font-medium">Hipertensión</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contacto de Emergencia */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Contacto de Emergencia</h2>
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
            Editar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
            <p className="text-gray-900 font-medium">Carlos González</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Relación</label>
            <p className="text-gray-900 font-medium">Esposo</p>
          </div>
          <div>
            <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
            <p className="text-gray-900 font-medium">+54 11 4567-8901</p>
          </div>
        </div>
      </div>

      {/* Seguridad */}
      <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Seguridad</h2>
        <div className="space-y-3">
          <button className="w-full md:w-auto px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-left">
            Cambiar Contraseña
          </button>
          <button className="w-full md:w-auto px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors text-left">
            Configurar Autenticación de Dos Factores
          </button>
        </div>
      </div>
    </>
  )
}

function FacturacionContent() {
  const facturasPendientes = [
    {
      numero: "FAC-2025-0342",
      fecha: "20 de Marzo, 2025",
      concepto: "Consulta Cardiología",
      monto: 8500,
      estado: "Pendiente",
    },
  ]

  const facturasHistorial = [
    {
      numero: "FAC-2025-0298",
      fecha: "28 de Febrero, 2025",
      concepto: "Consulta Dermatología",
      monto: 7500,
      estado: "Pagada",
      metodoPago: "Tarjeta de Crédito",
    },
    {
      numero: "FAC-2025-0156",
      fecha: "10 de Enero, 2025",
      concepto: "Chequeo Anual",
      monto: 12000,
      estado: "Pagada",
      metodoPago: "Obra Social",
    },
  ]

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Facturación y Pagos</h1>

      {/* Facturas Pendientes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Facturas Pendientes</h2>
        <div className="space-y-4">
          {facturasPendientes.map((factura, index) => (
            <div key={index} className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{factura.concepto}</h3>
                    <p className="text-sm text-gray-600">Factura N° {factura.numero}</p>
                    <p className="text-sm text-gray-500">{factura.fecha}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-3">${factura.monto.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pagar Ahora
                  </button>
                  <button className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métodos de Pago */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Métodos de Pago</h2>
          <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
            + Agregar Método
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <CreditCard className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visa •••• 4532</h3>
                  <p className="text-sm text-gray-600">Vence 08/2026</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    Predeterminada
                  </span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Pagos</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Factura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facturasHistorial.map((factura, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{factura.numero}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{factura.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{factura.concepto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${factura.monto.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        {factura.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        Descargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
