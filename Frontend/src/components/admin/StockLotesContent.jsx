import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Plus, Edit2, Trash2, X, Loader } from "lucide-react";
import apiClient from "../../services/apiClient";

export default function StockLotesContent() {
  const [lotes, setLotes] = useState([]);
  const [filteredLotes, setFilteredLotes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingLote, setEditingLote] = useState(null);
  const [deletingLote, setDeletingLote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [form, setForm] = useState({
    id_producto: "",
    numero_lote: "",
    cantidad_actual: "",
    fecha_vencimiento: "",
  });

  // Cargar lotes y productos al montar
  useEffect(() => {
    loadLotes();
    loadProductos();
  }, []);

  // Filtrar lotes
  useEffect(() => {
    const filtered = lotes.filter(
      (l) =>
        l.numero_lote.toLowerCase().includes(filter.toLowerCase()) ||
        (l.nombre_producto &&
          l.nombre_producto.toLowerCase().includes(filter.toLowerCase()))
    );
    setFilteredLotes(filtered);
  }, [filter, lotes]);

  const loadLotes = async () => {
    setDataLoading(true);
    try {
      const response = await apiClient.get("/stock/lotes");
      const data = response.data?.data || response.data || [];
      setLotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando lotes:", error);
      toast.error("Error al cargar lotes");
      setLotes([]);
    } finally {
      setDataLoading(false);
    }
  };

  const loadProductos = async () => {
    try {
      const response = await apiClient.get("/admin/productos");
      const data = response.data?.data || response.data || [];
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const openCreate = () => {
    setEditingLote(null);
    setForm({
      id_producto: "",
      numero_lote: "",
      cantidad_actual: "",
      fecha_vencimiento: "",
    });
    setModalOpen(true);
  };

  const openEdit = (lote) => {
    setEditingLote(lote);
    setForm({
      id_producto: lote.id_producto,
      numero_lote: lote.numero_lote,
      cantidad_actual: lote.cantidad_actual,
      fecha_vencimiento: lote.fecha_vencimiento
        ? lote.fecha_vencimiento.split("T")[0]
        : "",
    });
    setModalOpen(true);
  };

  const openDelete = (lote) => {
    setDeletingLote(lote);
    setDeleteConfirmOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveLote = async () => {
    if (!form.id_producto) {
      toast.error("El producto es requerido");
      return;
    }

    if (!form.numero_lote.trim()) {
      toast.error("El número de lote es requerido");
      return;
    }

    if (!form.cantidad_actual || form.cantidad_actual <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setLoading(true);
    try {
      if (editingLote) {
        // Actualizar
        await apiClient.put(`/stock/lotes/${editingLote.id_lote}`, {
          cantidad_actual: parseInt(form.cantidad_actual),
          fecha_vencimiento: form.fecha_vencimiento || null,
        });
        setLotes(
          lotes.map((l) =>
            l.id_lote === editingLote.id_lote
              ? {
                  ...l,
                  cantidad_actual: parseInt(form.cantidad_actual),
                  fecha_vencimiento: form.fecha_vencimiento || null,
                }
              : l
          )
        );
        toast.success("Lote actualizado correctamente");
      } else {
        // Crear
        const response = await apiClient.post("/stock/lotes", {
          id_producto: parseInt(form.id_producto),
          numero_lote: form.numero_lote,
          cantidad_actual: parseInt(form.cantidad_actual),
          fecha_vencimiento: form.fecha_vencimiento || null,
        });
        const productoNombre = productos.find(
          (p) => p.id_producto === parseInt(form.id_producto)
        )?.nombre;
        const newLote = {
          id_lote: response.data?.id_lote || Date.now(),
          ...form,
          nombre_producto: productoNombre,
        };
        setLotes([newLote, ...lotes]);
        toast.success("Lote creado correctamente");
      }
      setModalOpen(false);
      setEditingLote(null);
      setForm({
        id_producto: "",
        numero_lote: "",
        cantidad_actual: "",
        fecha_vencimiento: "",
      });
    } catch (error) {
      console.error("Error al guardar lote:", error);
      toast.error(error.response?.data?.message || "Error al guardar lote");
    } finally {
      setLoading(false);
    }
  };

  const deleteLote = async () => {
    if (!deletingLote) return;

    setLoading(true);
    try {
      await apiClient.delete(`/stock/lotes/${deletingLote.id_lote}`);
      setLotes(lotes.filter((l) => l.id_lote !== deletingLote.id_lote));
      toast.success("Lote eliminado correctamente");
      setDeleteConfirmOpen(false);
      setDeletingLote(null);
    } catch (error) {
      console.error("Error al eliminar lote:", error);
      toast.error("Error al eliminar lote");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  const isVencido = (fecha_vencimiento) => {
    if (!fecha_vencimiento) return false;
    return new Date(fecha_vencimiento) < new Date();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Stock por Lotes
            </h1>
            <p className="text-gray-600 mt-2">
              Administra los lotes de productos del hospital
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nuevo Lote
          </button>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <input
            type="text"
            placeholder="Buscar por número de lote o producto..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Tabla de lotes */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {dataLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center gap-3">
                <Loader className="w-6 h-6 animate-spin text-green-600" />
                <p className="text-gray-600">Cargando lotes...</p>
              </div>
            </div>
          ) : filteredLotes.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {filter
                    ? "No se encontraron lotes"
                    : "No hay lotes registrados"}
                </p>
                <button
                  onClick={openCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear primer lote
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Número de Lote
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Vencimiento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Ingreso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLotes.map((lote) => (
                    <tr
                      key={lote.id_lote}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {lote.nombre_producto}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lote.numero_lote}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {lote.cantidad_actual}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {isVencido(lote.fecha_vencimiento) ? (
                          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            VENCIDO: {formatDate(lote.fecha_vencimiento)}
                          </span>
                        ) : (
                          formatDate(lote.fecha_vencimiento)
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(lote.fecha_ingreso)}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => openEdit(lote)}
                          className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDelete(lote)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer con contador */}
          {!dataLoading && lotes.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Mostrando <strong>{filteredLotes.length}</strong> de{" "}
                <strong>{lotes.length}</strong> lotes
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de crear/editar */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {editingLote ? "Editar Lote" : "Nuevo Lote"}
                </h3>
                <p className="text-green-100 text-sm">
                  {editingLote
                    ? "Actualiza la información del lote"
                    : "Crea un nuevo lote de stock"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-green-600 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Producto */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Producto *
                </label>
                <select
                  name="id_producto"
                  value={form.id_producto}
                  onChange={handleInputChange}
                  disabled={editingLote !== null}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Número de Lote */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Número de Lote *
                </label>
                <input
                  type="text"
                  name="numero_lote"
                  value={form.numero_lote}
                  onChange={handleInputChange}
                  placeholder="Ej: LOT-2024-001"
                  disabled={editingLote !== null}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
              </div>

              {/* Cantidad */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cantidad *
                </label>
                <input
                  type="number"
                  name="cantidad_actual"
                  value={form.cantidad_actual}
                  onChange={handleInputChange}
                  placeholder="Ej: 100"
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Fecha de Vencimiento */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Fecha de Vencimiento
                </label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={form.fecha_vencimiento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setModalOpen(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveLote}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="bg-red-50 border-b border-red-200 px-6 py-4">
              <h3 className="text-lg font-bold text-red-900">Eliminar Lote</h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar el lote{" "}
                <strong>{deletingLote?.numero_lote}</strong>?
              </p>
              <p className="text-sm text-gray-600">
                Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={deleteLote}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading && <Loader className="w-4 h-4 animate-spin" />}
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
