import { useState, useEffect } from "react"
import axios from "axios"
import { Toaster, toast } from 'react-hot-toast'
import { jsPDF } from 'jspdf'

// Configurar axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001/api', // Ajusta esto según tu configuración
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
})

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
  Search,
  Stethoscope,
} from "lucide-react"
import { Link } from "react-router-dom"

export default function PacienteDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return <InicioContent />
      case "buscar-medicos":
        return <BuscarMedicosContent />
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

  const generarPDF = (titulo, contenido) => {
    const doc = new jsPDF();
    
    // Configurar el título
    doc.setFontSize(18);
    doc.text(titulo, 20, 20);
    
    // Configurar el contenido
    doc.setFontSize(12);
    doc.text(contenido, 20, 40);
    
    return doc;
  };

  // Función para generar un PDF de consulta
  const generarPDFConsulta = (consulta) => {
    const doc = generarPDF('Detalle de Consulta', [
      `Fecha: ${consulta.fecha}`,
      `Médico: ${consulta.medico}`,
      `Especialidad: ${consulta.especialidad}`,
      `Motivo: ${consulta.motivo}`,
      `Diagnóstico: ${consulta.diagnostico}`,
      `Tratamiento: ${consulta.tratamiento}`
    ].join('\\n'));
    
    return doc.output('blob');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
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
            onClick={() => setActiveSection("buscar-medicos")}
            className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${
              activeSection === "buscar-medicos" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="font-medium">Buscar Médicos</span>
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
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text('Receta Médica', 20, 20);
                  doc.setFontSize(12);
                  doc.text(`Medicamento: ${receta.medicamento}`, 20, 35);
                  doc.text(`Médico: ${receta.medico}`, 20, 45);
                  doc.text(`Dosis: ${receta.dosis}`, 20, 55);
                  doc.text(`Inicio: ${receta.inicio}`, 20, 65);
                  doc.text(`Vencimiento: ${receta.vencimiento}`, 20, 75);
                  doc.text(`Renovaciones: ${receta.renovaciones}`, 20, 85);
                  doc.save(`Receta_${receta.medicamento.replace(/\s/g, '_')}.pdf`);
                  toast.success('PDF de la receta descargado');
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
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

    // Función para descargar todos los estudios en un solo PDF
    const handleDescargarTodos = () => {
      if (!estudiosDisponibles.length) {
        toast.error('No hay estudios disponibles para descargar');
        return;
      }
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Estudios Médicos', 20, 20);
      let y = 40;
      estudiosDisponibles.forEach((estudio, idx) => {
        doc.setFontSize(14);
        doc.text(`${idx + 1}. ${estudio.tipo}`, 20, y);
        y += 8;
        doc.setFontSize(11);
        doc.text(`Fecha: ${estudio.fecha}`, 25, y);
        y += 6;
        doc.text(`Médico: ${estudio.medico}`, 25, y);
        y += 6;
        doc.text(`Estado: ${estudio.estado}`, 25, y);
        y += 10;
        // Salto de página si se pasa del límite
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save('Estudios_Medicos.pdf');
      toast.success('PDF de estudios descargado');
    };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Estudios Médicos</h1>

        <div className="mb-4 flex justify-end">
          <button
            onClick={handleDescargarTodos}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar todos
          </button>
        </div>

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
              <button
                onClick={() => {
                  const doc = new jsPDF();
                  doc.setFontSize(16);
                  doc.text('Estudio Médico', 20, 20);
                  doc.setFontSize(12);
                  doc.text(`Tipo: ${estudio.tipo}`, 20, 35);
                  doc.text(`Fecha: ${estudio.fecha}`, 20, 45);
                  doc.text(`Médico: ${estudio.medico}`, 20, 55);
                  doc.text(`Estado: ${estudio.estado}`, 20, 65);
                  doc.save(`Estudio_${estudio.tipo.replace(/\s/g, '_')}.pdf`);
                  toast.success('PDF del estudio descargado');
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
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
  const [isEditing, setIsEditing] = useState(false);
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: "Ana María González",
    fechaNacimiento: "1985-05-15",
    dni: "35456789",
    obraSocial: "OSDE 310",
    email: "ana.gonzalez@email.com",
    telefono: "+54 11 4567-8900",
    direccion: "Av. Corrientes 1234, CABA, Buenos Aires"
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.actualizarDatosPersonales("PATIENT_ID", datosPersonales);
      setIsEditing(false);
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      toast.error("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            {isEditing ? (
              <div className="space-x-2">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
              >
                Editar
              </button>
            )}
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

// Datos de ejemplo para desarrollo
const MOCK_DATA = {
  especialidades: [
    { id: '1', nombre: 'Cardiología' },
    { id: '2', nombre: 'Dermatología' },
    { id: '3', nombre: 'Traumatología' },
    { id: '4', nombre: 'Pediatría' },
  ],
  medicos: [
    {
      id: '1',
      nombre: 'Dr. Juan Pérez',
      especialidad: 'Cardiología',
      experiencia: 15,
      matricula: '12345',
    },
    {
      id: '2',
      nombre: 'Dra. María López',
      especialidad: 'Dermatología',
      experiencia: 10,
      matricula: '12346',
    },
  ],
  horarios: [
    { fecha: '2025-11-04', hora: '09:00', disponible: true },
    { fecha: '2025-11-04', hora: '10:00', disponible: true },
    { fecha: '2025-11-04', hora: '11:00', disponible: false },
    { fecha: '2025-11-05', hora: '09:00', disponible: true },
  ]
}

// Función auxiliar para descargar archivos
const downloadFile = (blob, fileName) => {
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    toast.success('Archivo descargado correctamente');
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    toast.error('Error al descargar el archivo');
  }
};

// Funciones de API para el dashboard de pacientes
const api = {
  // RF-06: Búsqueda de médicos y gestión de turnos
  getEspecialidades: async () => {
    try {
      const response = await axiosInstance.get('/especialidades')
      return response.data
    } catch (error) {
      console.error('Error al obtener especialidades:', error)
      throw error
    }
  },

  getMedicos: async (especialidad = '', nombre = '') => {
    try {
      const response = await axiosInstance.get('/medicos', {
        params: { especialidad, nombre }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener médicos:', error)
      throw error
    }
  },

  getDisponibilidadMedico: async (medicoId, fecha) => {
    try {
      const response = await axiosInstance.get(`/disponibilidad_medicos/${medicoId}`, {
        params: { fecha }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener disponibilidad:', error)
      throw error
    }
  },

  // RF-06: Reserva de turnos
  reservarTurno: async (medicoId, fecha, hora, pacienteId) => {
    try {
      const response = await axiosInstance.post('/turnos', {
        medico_id: medicoId,
        fecha,
        hora,
        paciente_id: pacienteId,
        estado: 'Reservado'
      })
      return response.data
    } catch (error) {
      console.error('Error al reservar turno:', error)
      throw error
    }
  },

  // RF-07: Gestión de turnos del paciente
  getTurnosPaciente: async (pacienteId) => {
    try {
      const response = await axiosInstance.get(`/turnos/paciente/${pacienteId}`, {
        params: { estado: ['Reservado', 'En Espera'] }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener turnos:', error)
      throw error
    }
  },

  cancelarTurno: async (turnoId) => {
    try {
      const response = await axiosInstance.put(`/turnos/${turnoId}`, {
        estado: 'Cancelado'
      })
      return response.data
    } catch (error) {
      console.error('Error al cancelar turno:', error)
      throw error
    }
  },

  // RF-08: Recetas electrónicas
  getRecetasActivas: async (pacienteId) => {
    try {
      const response = await axiosInstance.get(`/recetas/paciente/${pacienteId}`, {
        params: { estado: 'Activa' }
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener recetas:', error)
      throw error
    }
  },

  getDetalleReceta: async (recetaId) => {
    try {
      const response = await axiosInstance.get(`/recetas/${recetaId}/detalle`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de receta:', error)
      throw error
    }
  },

  // RF-09: Estudios médicos
  getEstudiosMedicos: async (pacienteId) => {
    try {
      const response = await axiosInstance.get(`/estudiosmedicos/paciente/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener estudios médicos:', error)
      throw error
    }
  },

  getInformeEstudio: async (estudioId) => {
    try {
      const response = await axiosInstance.get(`/estudiosmedicos/${estudioId}/informe`, {
        responseType: 'blob' // Para descargar archivos
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener informe:', error)
      throw error
    }
  },

  // RF-10 y RF-11: Facturación y pagos
  getResumenFacturacion: async (pacienteId) => {
    try {
      const response = await axiosInstance.get(`/facturacion/paciente/${pacienteId}/resumen`)
      return response.data
    } catch (error) {
      console.error('Error al obtener resumen de facturación:', error)
      throw error
    }
  },

  getDetalleFacturacion: async (facturaId) => {
    try {
      const response = await axiosInstance.get(`/facturacion/${facturaId}/detalle`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de facturación:', error)
      throw error
    }
  },

  getHistorialPagos: async (pacienteId) => {
    try {
      const response = await axiosInstance.get(`/pagos/paciente/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error)
      throw error
    }
  },

  // RF-12: Gestión de datos personales
  getDatosPersonales: async (pacienteId) => {
    try {
      const response = await axiosInstance.get(`/personas/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener datos personales:', error)
      throw error
    }
  },

  actualizarDatosPersonales: async (pacienteId, datos) => {
    try {
      const response = await axiosInstance.put(`/personas/${pacienteId}`, datos)
      return response.data
    } catch (error) {
      console.error('Error al actualizar datos personales:', error)
      throw error
    }
  }
}


function BuscarMedicosContent() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [especialidades, setEspecialidades] = useState([])
  const [medicos, setMedicos] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [loading, setLoading] = useState(true) // Inicialmente true para mostrar loading
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  console.log('Estado actual:', { 
    especialidades, 
    medicos, 
    loading, 
    error 
  }) // Para debugging

  // Cargar especialidades al montar el componente
  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        setLoading(true)
        const data = await api.getEspecialidades()
        console.log('Especialidades cargadas:', data)
        setEspecialidades(data)
      } catch (err) {
        console.error('Error en loadEspecialidades:', err)
        setError("Error al cargar las especialidades")
      } finally {
        setLoading(false)
      }
    }
    loadEspecialidades()
  }, [])

  // Cargar médicos cuando cambia la especialidad o término de búsqueda
  useEffect(() => {
    const loadMedicos = async () => {
      if (!especialidades.length) return; // No cargar médicos hasta tener especialidades
      
      try {
        setLoading(true)
        const especialidadNombre = especialidades.find(e => e.id === selectedSpecialty)?.nombre || ''
        const data = await api.getMedicos(especialidadNombre, searchTerm)
        console.log('Médicos cargados:', data)
        setMedicos(data)
        setError(null) // Limpiar errores previos
      } catch (err) {
        console.error('Error en loadMedicos:', err)
        setError("Error al cargar los médicos")
        setMedicos([]) // Limpiar médicos en caso de error
      } finally {
        setLoading(false)
      }
    }

    // Usar un debounce para la búsqueda por nombre
    const timeoutId = setTimeout(() => {
      loadMedicos()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [selectedSpecialty, searchTerm, especialidades])

  // Cargar horarios disponibles de un médico
  const loadHorarios = async (medicoId) => {
    try {
      setLoading(true)
      setError(null) // Limpiar errores previos
      console.log('Cargando horarios para médico:', medicoId)
      const data = await api.getHorariosDisponibles(medicoId)
      console.log('Horarios obtenidos:', data)
      setHorariosDisponibles(data)
      const medicoSeleccionado = medicos.find(m => m.id === medicoId)
      console.log('Médico seleccionado:', medicoSeleccionado)
      setSelectedDoctor(medicoSeleccionado)
    } catch (err) {
      console.error('Error al cargar horarios:', err)
      setError("Error al cargar los horarios disponibles")
      setHorariosDisponibles([])
    } finally {
      setLoading(false)
    }
  }

  // Reservar un turno
  const reservarTurno = async (medicoId, fecha, hora) => {
    try {
      setLoading(true)
      // Simulamos la reserva del turno actualizando los horarios disponibles localmente
      const nuevosHorarios = horariosDisponibles.map(slot => {
        if (slot.fecha === fecha && slot.hora === hora) {
          return { ...slot, disponible: false };
        }
        return slot;
      });
      
      setHorariosDisponibles(nuevosHorarios);
      setSuccessMessage("Turno reservado exitosamente");
      
      // Simulamos un pequeño delay para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      setError("Error al reservar el turno")
      console.error('Error en reservarTurno:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Buscar Médicos</h1>
      
      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
            Especialidad
          </label>
          <select
            id="specialty"
            className="w-full rounded-lg border border-gray-300 p-2.5"
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
          >
            <option value="">Todas las especialidades</option>
            {especialidades.map((esp) => (
              <option key={esp.id} value={esp.id}>{esp.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Lista de médicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medicos.map((medico) => (
          <div key={medico.id} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <img
                src={medico.imagen || "https://via.placeholder.com/64"}
                alt={medico.nombre}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{medico.nombre}</h3>
                <p className="text-blue-600">{medico.especialidad}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <p>{medico.experiencia} años de experiencia</p>
                  {medico.matricula && <p>Matrícula: {medico.matricula}</p>}
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 ">
              <button
                onClick={() => loadHorarios(medico.id)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Ver Horarios Disponibles</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de horarios disponibles */}
      {selectedDoctor && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-black">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Horarios Disponibles - {selectedDoctor.nombre}
              </h2>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(
                horariosDisponibles.reduce((acc, slot) => {
                  const fecha = new Date(slot.fecha).toLocaleDateString()
                  if (!acc[fecha]) acc[fecha] = []
                  acc[fecha].push(slot)
                  return acc
                }, {})
              ).map(([fecha, slots]) => (
                <div key={fecha} className="border-b border-gray-200 pb-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {new Date(slots[0].fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot, index) => (
                      <button
                        key={index}
                        disabled={!slot.disponible || loading}
                        onClick={() => reservarTurno(selectedDoctor.id, slot.fecha, slot.hora)}
                        className={`p-2 rounded-lg text-center ${
                          loading
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : slot.disponible
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.hora}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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