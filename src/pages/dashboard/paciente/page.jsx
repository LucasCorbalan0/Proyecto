import { useState, useEffect } from "react"
import { Toaster, toast } from 'react-hot-toast'
import { jsPDF } from 'jspdf'

// Importar cliente axios configurado
import apiClient from '../../../services/apiClient';

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
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
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
            <span className="text-gray-700">Hola {localStorage.getItem('nombre')}</span>
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

function InicioContent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const idPaciente = localStorage.getItem('id_paciente');
      const token = localStorage.getItem('token');
      
      if (!idPaciente || !token) {
        throw new Error('No se encontró el ID del paciente o el token');
      }

      const response = await apiClient.get(`/pacientes/dashboard/${idPaciente}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setDashboardData(response.data);
        setError(null);
      } else {
        throw new Error('No se recibieron datos del servidor');
      }
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      if (err.response?.status === 401) {
        // Error de autenticación - redirigir al login
        localStorage.clear();
        window.location.href = '/';
      } else {
        toast.error(err.response?.data?.message || 'Error al cargar la información del dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelarTurno = async (idTurno) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      await apiClient.put(`/pacientes/turnos/${idTurno}/cancelar`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Turno cancelado exitosamente');
      // Recargar los datos del dashboard
      fetchDashboardData(); // Reutilizamos la función que ya tiene la lógica de auth
    } catch (err) {
      console.error('Error al cancelar turno:', err);
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/';
      } else {
        toast.error('Error al cancelar el turno. Por favor intente nuevamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { paciente, proximosTurnos, ultimosEstudios, recetasProximasVencer } = dashboardData;

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Hola, {paciente?.nombre || 'Paciente'}.
      </h1>

      {/* Información Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Próximo Turno</h3>
              <p className="text-sm text-gray-600 mt-1">
                {proximosTurnos[0] ? (
                  `${new Date(proximosTurnos[0].fecha).toLocaleDateString()} - ${proximosTurnos[0].hora_inicio}`
                ) : (
                  'No hay turnos programados'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Últimos Estudios</h3>
              <p className="text-sm text-gray-600 mt-1">
                {ultimosEstudios.length ? 
                  `${ultimosEstudios.length} resultados disponibles` : 
                  'No hay estudios recientes'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-3">
            <Pill className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Recetas Activas</h3>
              <p className="text-sm text-gray-600 mt-1">
                {recetasProximasVencer.length ? 
                  `${recetasProximasVencer.length} recetas vigentes` : 
                  'No hay recetas activas'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Turnos Section */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximos Turnos</h2>
        <div className="space-y-4">
          {proximosTurnos.length > 0 ? (
            proximosTurnos.map((turno) => (
              <div key={turno.id_turno} className="bg-white rounded-lg p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(turno.fecha).toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })} / {turno.hora_inicio}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">Dr. {turno.nombre_medico}</h3>
                    <p className="text-gray-600">{turno.especialidad}</p>
                  </div>
                  <button
                    onClick={() => handleCancelarTurno(turno.id_turno)}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancelar Turno
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8">
              No tienes turnos programados
            </div>
          )}
        </div>

        <Link 
          to="/dashboard/buscar-medicos"
          className="block w-full mt-6 px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg text-center"
        >
          Solicitar Nuevo Turno
        </Link>
      </div>

      {/* Últimos Resultados Section */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Últimos Resultados</h2>
        {ultimosEstudios.length > 0 ? (
          <div className="space-y-2">
            {ultimosEstudios.map((estudio) => (
              <div key={estudio.id_estudio} className="flex items-center justify-between">
                <Link 
                  href={estudio.ruta_resultado_pdf} 
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {estudio.tipo_estudio}
                </Link>
                <span className="text-sm text-gray-600">
                  {new Date(estudio.fecha_resultado).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-4">
            No hay resultados disponibles
          </div>
        )}
      </div>
    </>
  )
}

function ConsultasContent() {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        const idPaciente = localStorage.getItem('id_paciente');
        const token = localStorage.getItem('token');
        
        if (!idPaciente || !token) {
          throw new Error('No se encontró el ID del paciente o el token');
        }
        
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await apiClient.get(`/pacientes/consultas/${idPaciente}`);
        
        if (!response.data) {
          throw new Error('No se recibieron datos del servidor');
        }
        
        setConsultas(response.data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar consultas:', err);
        if (err.response?.status === 401) {
          // Error de autenticación
          localStorage.clear();
          window.location.href = '/';
        } else {
          setError(err.response?.data?.message || 'Error al cargar el historial de consultas');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConsultas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

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
  const [recetas, setRecetas] = useState({ activas: [], vencidas: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        setLoading(true);
        const idPaciente = localStorage.getItem('id_paciente');
        if (!idPaciente) {
          throw new Error('No se encontró el ID del paciente');
        }
        
        const response = await apiClient.get(`/pacientes/recetas/${idPaciente}`);
        
        const hoy = new Date();
        const activas = response.data.data.filter(receta => 
          new Date(receta.fecha_vencimiento) > hoy
        );
        const vencidas = response.data.data.filter(receta => 
          new Date(receta.fecha_vencimiento) <= hoy
        );
        
        setRecetas({ activas, vencidas });
      } catch (err) {
        console.error('Error al cargar recetas:', err);
        toast.error('Error al cargar las recetas médicas');
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Recetas Activas</h1>
        <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors">
          Solicitar Renovación
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recetas.activas.map((receta, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{receta.medicamento}</h3>
                  <p className="text-gray-600 text-sm">Recetado por Dr. {receta.nombre_medico} {receta.apellido_medico}</p>
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
                      {new Date(receta.fecha_emision).toLocaleDateString()} - {new Date(receta.fecha_vencimiento).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Renovaciones disponibles</p>
                    <p className="text-gray-900">{receta.renovaciones_disponibles || 0}</p>
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
                    doc.text(`Médico: Dr. ${receta.nombre_medico} ${receta.apellido_medico}`, 20, 45);
                    doc.text(`Dosis: ${receta.dosis}`, 20, 55);
                    doc.text(`Fecha Emisión: ${new Date(receta.fecha_emision).toLocaleDateString()}`, 20, 65);
                    doc.text(`Vencimiento: ${new Date(receta.fecha_vencimiento).toLocaleDateString()}`, 20, 75);
                    doc.text(`Renovaciones disponibles: ${receta.renovaciones_disponibles || 0}`, 20, 85);
                    doc.save(`Receta_${receta.medicamento.replace(/\s/g, '_')}.pdf`);
                    toast.success('PDF de la receta descargado');
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </button>
                {receta.renovaciones_disponibles > 0 && (
                  <button className="flex-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors">
                    Renovar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recetas Vencidas</h2>
        <div className="space-y-4">
          {recetas.vencidas.map((receta, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{receta.medicamento}</h3>
                  <p className="text-sm text-gray-600 mb-2">Recetado por Dr. {receta.nombre_medico} {receta.apellido_medico}</p>
                  <p className="text-sm text-gray-500">Vencida el {new Date(receta.fecha_vencimiento).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
          {recetas.vencidas.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No hay recetas vencidas
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function EstudiosContent() {
  const [estudios, setEstudios] = useState({ disponibles: [], pendientes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstudios = async () => {
      try {
        setLoading(true);
        const idPaciente = localStorage.getItem('id_paciente');
        if (!idPaciente) {
          throw new Error('No se encontró el ID del paciente');
        }
        
        const response = await apiClient.get(`/pacientes/estudios/${idPaciente}`);
        
        // Separar estudios disponibles y pendientes
        const disponibles = response.data.data.filter(estudio => 
          estudio.estado === 'Completado' || estudio.estado === 'Resultado Disponible'
        );
        const pendientes = response.data.data.filter(estudio => 
          estudio.estado === 'Pendiente' || estudio.estado === 'En Proceso'
        );
        
        setEstudios({ disponibles, pendientes });
      } catch (err) {
        console.error('Error al cargar estudios:', err);
        toast.error('Error al cargar los estudios médicos');
      } finally {
        setLoading(false);
      }
    };
    fetchEstudios();
  }, []);

  // Función para descargar todos los estudios en un solo PDF
  const handleDescargarTodos = () => {
    if (!estudios.disponibles.length) {
      toast.error('No hay estudios disponibles para descargar');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Estudios Médicos', 20, 20);
    let y = 40;
    estudios.disponibles.forEach((estudio, idx) => {
      doc.setFontSize(14);
      doc.text(`${idx + 1}. ${estudio.tipo_estudio}`, 20, y);
      y += 8;
      doc.setFontSize(11);
      doc.text(`Fecha: ${new Date(estudio.fecha_resultado).toLocaleDateString()}`, 25, y);
      y += 6;
      doc.text(`Médico: Dr. ${estudio.nombre_medico} ${estudio.apellido_medico}`, 25, y);
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

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resultados Disponibles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {estudios.disponibles.map((estudio, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{estudio.tipo_estudio}</h3>
                        <p className="text-sm text-gray-600">Solicitado por Dr. {estudio.nombre_medico} {estudio.apellido_medico}</p>
                        <p className="text-sm text-gray-500 mt-1">{new Date(estudio.fecha_resultado).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Aquí deberíamos hacer una petición para obtener el PDF real del estudio
                      // Por ahora generamos uno de ejemplo
                      const doc = new jsPDF();
                      doc.setFontSize(16);
                      doc.text('Estudio Médico', 20, 20);
                      doc.setFontSize(12);
                      doc.text(`Tipo: ${estudio.tipo_estudio}`, 20, 35);
                      doc.text(`Fecha: ${new Date(estudio.fecha_resultado).toLocaleDateString()}`, 20, 45);
                      doc.text(`Médico: Dr. ${estudio.nombre_medico} ${estudio.apellido_medico}`, 20, 55);
                      doc.text(`Estado: ${estudio.estado}`, 20, 65);
                      doc.save(`Estudio_${estudio.tipo_estudio.replace(/\s/g, '_')}.pdf`);
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
              {estudios.pendientes.map((estudio, index) => (
                <div key={index} className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-yellow-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{estudio.tipo_estudio}</h3>
                      <p className="text-sm text-gray-600">Solicitado por Dr. {estudio.nombre_medico} {estudio.apellido_medico}</p>
                      <p className="text-sm text-gray-500 mt-1">Fecha de solicitud: {new Date(estudio.fecha_solicitud).toLocaleDateString()}</p>
                      <p className="text-sm text-yellow-700 mt-2 font-medium">
                        {estudio.estado === 'Pendiente' ? 'Pendiente de realización - Coordinar turno' : 'En proceso'}
                      </p>
                    </div>
                    {estudio.estado === 'Pendiente' && (
                      <button className="px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors">
                        Agendar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

function CuentaContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosPersonales, setDatosPersonales] = useState({
    nombre: localStorage.getItem('nombre') || '',
    apellido: localStorage.getItem('apellido') || '',
    email: localStorage.getItem('email') || '',
    fechaNacimiento: '',
    dni: '',
    obraSocial: '',
    telefono: '',
    direccion: '',
    // Historia clínica
    grupoSanguineo: '',
    alergias: '',
    condicionesCronicas: '',
    medicacionActual: '',
    antecedentesQuirurgicos: '',
    // Contacto de emergencia
    contactoEmergenciaNombre: '',
    contactoEmergenciaRelacion: '',
    contactoEmergenciaTelefono: ''
  });

  useEffect(() => {
    const fetchDatosPersonales = async () => {
      try {
        setLoading(true);
        const idPaciente = localStorage.getItem('id_paciente');
        const token = localStorage.getItem('token');
        
        if (!idPaciente || !token) {
          throw new Error('No se encontró el ID del paciente o el token de autenticación');
        }
        
        // Primero obtenemos los datos básicos del paciente
        const responsePaciente = await apiClient.get(`/pacientes/${idPaciente}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Luego obtenemos la historia clínica
        const responseHistoria = await apiClient.get(`/pacientes/${idPaciente}/historia-clinica`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (responsePaciente.data && responseHistoria.data) {
          const datosActualizados = {
            nombre: responsePaciente.data.nombre,
            apellido: responsePaciente.data.apellido,
            email: responsePaciente.data.email,
            dni: responsePaciente.data.dni,
            fechaNacimiento: responsePaciente.data.fecha_nacimiento,
            obraSocial: responsePaciente.data.obra_social,
            telefono: responsePaciente.data.telefono,
            direccion: responsePaciente.data.direccion,
            // Datos de historia clínica
            grupoSanguineo: responseHistoria.data.grupo_sanguineo,
            alergias: responseHistoria.data.alergias,
            condicionesCronicas: responseHistoria.data.condiciones_cronicas,
            medicacionActual: responseHistoria.data.medicacion_actual,
            antecedentesQuirurgicos: responseHistoria.data.antecedentes_quirurgicos
          };
          
          setDatosPersonales(datosActualizados);
          setError(null);
        }
      } catch (err) {
        console.error('Error al cargar datos personales:', err);
        toast.error('Error al cargar los datos personales');
      } finally {
        setLoading(false);
      }
    };

    fetchDatosPersonales();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const idPaciente = localStorage.getItem('id_paciente');
      const token = localStorage.getItem('token');
      if (!idPaciente || !token) {
        throw new Error('No se encontró el ID del paciente o el token');
      }
      await apiClient.put(`/pacientes/datos/${idPaciente}`, datosPersonales, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setIsEditing(false);
      toast.success("Datos actualizados correctamente");
    } catch (err) {
      console.error('Error al actualizar datos:', err);
      toast.error("Error al actualizar los datos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Cuenta</h1>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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
              <label className="text-sm text-gray-500 mb-1 block">Nombre</label>
              <p className="text-gray-900 font-medium">{datosPersonales.nombre}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Apellido</label>
              <p className="text-gray-900 font-medium">{datosPersonales.apellido}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">DNI</label>
              <p className="text-gray-900 font-medium">{datosPersonales.dni || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Fecha de Nacimiento</label>
              <p className="text-gray-900 font-medium">
                {datosPersonales.fechaNacimiento ? new Date(datosPersonales.fechaNacimiento).toLocaleDateString() : "No especificado"}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Obra Social</label>
              <p className="text-gray-900 font-medium">{datosPersonales.obraSocial || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Nº de Afiliado</label>
              <p className="text-gray-900 font-medium">{datosPersonales.numeroAfiliado || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Email</label>
              <p className="text-gray-900 font-medium">{datosPersonales.email || "No especificado"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Teléfono</label>
              <p className="text-gray-900 font-medium">{datosPersonales.telefono || "No especificado"}</p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-500 mb-1 block">Dirección</label>
              <p className="text-gray-900 font-medium">{datosPersonales.direccion || "No especificado"}</p>
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
    </div>
  )
}





// Funciones de API para el dashboard de pacientes
const api = {
  // RF-06: Búsqueda de médicos y gestión de turnos
  getEspecialidades: async () => {
    try {
      console.log('Obteniendo especialidades...');
      const response = await apiClient.get('/especialidades');
      console.log('Respuesta especialidades:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener especialidades:', error);
      if (error.response?.status === 401) {
        // Error de autenticación
        localStorage.clear();
        window.location.href = '/';
      }
      throw error;
    }
  },

  getMedicos: async (especialidad = '', nombre = '') => {
    try {
      const response = await apiClient.get('/medicos', {
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
      const response = await apiClient.get(`/disponibilidad_medicos/${medicoId}`, {
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
      const response = await apiClient.post('/turnos', {
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
      const response = await apiClient.get(`/turnos/paciente/${pacienteId}`, {
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
      const response = await apiClient.put(`/turnos/${turnoId}`, {
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
      const response = await apiClient.get(`/recetas/paciente/${pacienteId}`, {
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
      const response = await apiClient.get(`/recetas/${recetaId}/detalle`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de receta:', error)
      throw error
    }
  },

  // RF-09: Estudios médicos
  getEstudiosMedicos: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/estudiosmedicos/paciente/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener estudios médicos:', error)
      throw error
    }
  },

  getInformeEstudio: async (estudioId) => {
    try {
      const response = await apiClient.get(`/estudiosmedicos/${estudioId}/informe`, {
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
      const response = await apiClient.get(`/facturacion/paciente/${pacienteId}/resumen`)
      return response.data
    } catch (error) {
      console.error('Error al obtener resumen de facturación:', error)
      throw error
    }
  },

  getDetalleFacturacion: async (facturaId) => {
    try {
      const response = await apiClient.get(`/facturacion/${facturaId}/detalle`)
      return response.data
    } catch (error) {
      console.error('Error al obtener detalle de facturación:', error)
      throw error
    }
  },

  getHistorialPagos: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/pagos/paciente/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener historial de pagos:', error)
      throw error
    }
  },

  // RF-12: Gestión de datos personales
  getDatosPersonales: async (pacienteId) => {
    try {
      const response = await apiClient.get(`/personas/${pacienteId}`)
      return response.data
    } catch (error) {
      console.error('Error al obtener datos personales:', error)
      throw error
    }
  },

  actualizarDatosPersonales: async (pacienteId, datos) => {
    try {
      const response = await apiClient.put(`/personas/${pacienteId}`, datos)
      return response.data
    } catch (error) {
      console.error('Error al actualizar datos personales:', error)
      throw error
    }
  }
}


function BuscarMedicosContent() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
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
        const data = await api.getMedicos(especialidadNombre, '')
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

    loadMedicos()
  }, [selectedSpecialty, especialidades])

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
  const [facturas, setFacturas] = useState({ pendientes: [], historial: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const idPaciente = localStorage.getItem('id_paciente');
        const token = localStorage.getItem('token');
        
        if (!idPaciente || !token) {
          throw new Error('No se encontró el ID del paciente o el token');
        }

        const response = await apiClient.get(`/pacientes/facturas/${idPaciente}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Separar facturas pendientes y pagadas
        const pendientes = response.data.filter(f => f.estado === 'Pendiente');
        const historial = response.data.filter(f => f.estado === 'Pagada');
        
        setFacturas({ pendientes, historial });
      } catch (err) {
        console.error('Error al cargar facturas:', err);
        toast.error('Error al cargar la información de facturación');
      } finally {
        setLoading(false);
      }
    };

    fetchFacturas();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Facturación y Pagos</h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Facturas Pendientes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Facturas Pendientes</h2>
            <div className="space-y-4">
              {facturas.pendientes.map((factura, index) => (
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
                {facturas.historial.map((factura, index) => (
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
      )}
    </>
  )
}
