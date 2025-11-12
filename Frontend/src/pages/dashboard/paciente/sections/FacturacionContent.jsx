import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { AlertCircle, CreditCard, Download, CheckCircle, XCircle } from 'lucide-react'
import apiClient from '../../../../services/apiClient'

export function FacturacionContent() {
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
        
        const facturasData = response.data.data || response.data;
        const pendientes = Array.isArray(facturasData) ? facturasData.filter(f => f.estado === 'Pendiente') : [];
        const historial = Array.isArray(facturasData) ? facturasData.filter(f => f.estado === 'Pagada') : [];
        
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
