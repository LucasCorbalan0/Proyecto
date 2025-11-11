import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { jsPDF } from 'jspdf'
import { CheckCircle, Clock, Download } from 'lucide-react'
import apiClient from '../../../../services/apiClient'

export function EstudiosContent() {
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
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save('Estudios_Medicos.pdf');
    toast.success('PDF de estudios descargado');
  };

  const handleDescargarEstudio = (estudio) => {
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
                    onClick={() => handleDescargarEstudio(estudio)}
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
