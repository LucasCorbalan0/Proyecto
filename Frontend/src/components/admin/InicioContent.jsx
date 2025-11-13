import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import CardSimple from './CardSimple'
import { CheckCircle, AlertCircle, Receipt, UserPlus, UserCheck, BedDouble, Box } from 'lucide-react'
import apiClient from '../../services/apiClient'

export default function InicioContent({ setActive }) {
  const [dashboardData, setDashboardData] = useState({
    totalUsuarios: 0,
    ocupacion: 0,
    stockBajo: 0,
    factPendientes: 0,
    actividadReciente: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Obtener datos del dashboard admin
      const response = await apiClient.get('/admin/dashboard', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      // Normalizar respuesta
      const data = response.data?.data ?? response.data ?? {}
      
      setDashboardData({
        totalUsuarios: data.totalUsuarios || 0,
        ocupacion: data.ocupacion || 0,
        stockBajo: data.stockBajo || 0,
        factPendientes: data.factPendientes || 0,
        actividadReciente: Array.isArray(data.actividadReciente) ? data.actividadReciente : []
      })
    } catch (error) {
      console.error('Error al cargar dashboard admin:', error)
      if (error.response?.status === 401) {
        localStorage.clear()
        window.location.href = '/'
      } else {
        toast.error('Error al cargar datos del dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
      <p className="text-gray-600 mb-6">Resumen rápido de los módulos.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardSimple title="Ocupación" value={`${dashboardData.ocupacion}%`} subtitle="Camas ocupadas" icon={<CheckCircle className="w-10 h-10 text-green-600" />} />
        <CardSimple title="Stock bajo" value={dashboardData.stockBajo} subtitle="Productos por reponer" icon={<AlertCircle className="w-10 h-10 text-yellow-600" />} />
        <CardSimple title="Facturas pendientes" value={dashboardData.factPendientes} subtitle="Pendientes por cobrar" icon={<Receipt className="w-10 h-10 text-red-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActive('usuarios')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><UserPlus className="w-6 h-6" /><p className="font-medium">Usuarios ({dashboardData.totalUsuarios})</p><p className="text-sm text-gray-500">Crear/editar/desactivar</p></button>
            <button onClick={() => setActive('perfiles')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><UserCheck className="w-6 h-6" /><p className="font-medium">Perfiles</p><p className="text-sm text-gray-500">CRUD profesionales</p></button>
            <button onClick={() => setActive('infraestructura')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><BedDouble className="w-6 h-6" /><p className="font-medium">Infraestructura</p><p className="text-sm text-gray-500">Habitaciones y camas</p></button>
            <button onClick={() => setActive('compras')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><Box className="w-6 h-6" /><p className="font-medium">Compras</p><p className="text-sm text-gray-500">Ingresar lotes</p></button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>
          <ul className="space-y-3">
            {dashboardData.actividadReciente.length > 0 ? (
              dashboardData.actividadReciente.map((actividad, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  {actividad.tipo === 'compra' && <CheckCircle className="w-5 h-5 text-green-600 mt-1" />}
                  {actividad.tipo === 'stock' && <AlertCircle className="w-5 h-5 text-yellow-600 mt-1" />}
                  {actividad.tipo === 'factura' && <Receipt className="w-5 h-5 text-red-600 mt-1" />}
                  <div>
                    <p className="font-medium">{actividad.titulo}</p>
                    <p className="text-sm text-gray-500">{actividad.subtitulo}</p>
                  </div>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-1" /><div><p className="font-medium">Compra registrada</p><p className="text-sm text-gray-500">FarmaPlus — 10/04/2025</p></div></li>
                <li className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-yellow-600 mt-1" /><div><p className="font-medium">Stock bajo</p><p className="text-sm text-gray-500">Paracetamol 500mg</p></div></li>
                <li className="flex items-start gap-3"><Receipt className="w-5 h-5 text-red-600 mt-1" /><div><p className="font-medium">Factura pendiente</p><p className="text-sm text-gray-500">Internación — Martínez</p></div></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}