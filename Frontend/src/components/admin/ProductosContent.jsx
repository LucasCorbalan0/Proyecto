import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Download, Plus, Edit2, Trash2, X, Loader } from "lucide-react";
import apiClient from "../../services/apiClient";

export default function ProductosContent() {
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [deletingProducto, setDeletingProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tipo_producto: "Medicamento",
  });

  // Cargar productos al montar
  useEffect(() => {
    loadProductos();
  }, []);

  // Actualizar form cuando se edita
  useEffect(() => {
    if (editingProducto) {
      setForm({
        nombre: editingProducto.nombre || "",
        descripcion: editingProducto.descripcion || "",
        tipo_producto: editingProducto.tipo_producto || "Medicamento",
      });
    }
  }, [editingProducto]);

  // Filtrar productos
  useEffect(() => {
    const filtered = productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(filter.toLowerCase()) ||
        (p.descripcion &&
          p.descripcion.toLowerCase().includes(filter.toLowerCase()))
    );
    setFilteredProductos(filtered);
  }, [filter, productos]);

  const loadProductos = async () => {
    setDataLoading(true);
    try {
      const response = await apiClient.get("/admin/productos");
      const data = response.data?.data || response.data || [];
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      toast.error("Error al cargar productos");
      setProductos([]);
    } finally {
      setDataLoading(false);
    }
  };

  const openCreate = () => {
    setEditingProducto(null);
    setForm({
      nombre: "",
      descripcion: "",
      tipo_producto: "Medicamento",
    });
    setModalOpen(true);
  };

  const openEdit = (producto) => {
    setEditingProducto(producto);
    setModalOpen(true);
  };

  const openDelete = (producto) => {
    setDeletingProducto(producto);
    setDeleteConfirmOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveProducto = async () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre del producto es requerido");
      return;
    }

    if (!form.tipo_producto) {
      toast.error("El tipo de producto es requerido");
      return;
    }

    setLoading(true);
    try {
      if (editingProducto) {
        // Actualizar
        await apiClient.put(
          `/admin/productos/${editingProducto.id_producto}`,
          form
        );
        setProductos(
          productos.map((p) =>
            p.id_producto === editingProducto.id_producto
              ? { ...p, ...form }
              : p
          )
        );
        toast.success("Producto actualizado correctamente");
      } else {
        // Crear
        const response = await apiClient.post("/admin/productos", form);
        const newProducto = {
          id_producto: response.data?.id_producto || Date.now(),
          ...form,
        };
        setProductos([newProducto, ...productos]);
        toast.success("Producto creado correctamente");
      }
      setModalOpen(false);
      setEditingProducto(null);
      setForm({
        nombre: "",
        descripcion: "",
        tipo_producto: "Medicamento",
      });
    } catch (error) {
      console.error("Error al guardar producto:", error);
      toast.error(error.response?.data?.message || "Error al guardar producto");
    } finally {
      setLoading(false);
    }
  };

  const deleteProducto = async () => {
    if (!deletingProducto) return;

    setLoading(true);
    try {
      await apiClient.delete(
        `/admin/productos/${deletingProducto.id_producto}`
      );
      setProductos(
        productos.filter((p) => p.id_producto !== deletingProducto.id_producto)
      );
      toast.success("Producto eliminado correctamente");
      setDeleteConfirmOpen(false);
      setDeletingProducto(null);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      toast.error("Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = ["Nombre", "Descripción", "Tipo de Producto"];
    const rows = productos.map((p) => [
      p.nombre,
      p.descripcion || "",
      p.tipo_producto,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `productos_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV descargado correctamente");
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Productos
            </h1>
            <p className="text-gray-600 mt-2">
              Administra el catálogo de productos del hospital
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {dataLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="flex flex-col items-center gap-3">
                <Loader className="w-6 h-6 animate-spin text-blue-600" />
                <p className="text-gray-600">Cargando productos...</p>
              </div>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {filter
                    ? "No se encontraron productos"
                    : "No hay productos registrados"}
                </p>
                <button
                  onClick={openCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Crear primer producto
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProductos.map((producto) => (
                    <tr
                      key={producto.id_producto}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {producto.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {producto.descripcion || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {producto.tipo_producto}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => openEdit(producto)}
                          className="p-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDelete(producto)}
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
          {!dataLoading && productos.length > 0 && (
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Mostrando <strong>{filteredProductos.length}</strong> de{" "}
                <strong>{productos.length}</strong> productos
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
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  {editingProducto ? "Editar Producto" : "Nuevo Producto"}
                </h3>
                <p className="text-blue-100 text-sm">
                  {editingProducto
                    ? "Actualiza la información del producto"
                    : "Crea un nuevo producto en el catálogo"}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-blue-600 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  placeholder="Ej: Paracetamol 500mg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción detallada del producto..."
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tipo de Producto *
                </label>
                <select
                  name="tipo_producto"
                  value={form.tipo_producto}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Medicamento">Medicamento</option>
                  <option value="Insumo">Insumo</option>
                  <option value="Material Quirurgico">
                    Material Quirúrgico
                  </option>
                </select>
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
                  onClick={saveProducto}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center justify-center gap-2"
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
              <h3 className="text-lg font-bold text-red-900">
                Eliminar Producto
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-700">
                ¿Estás seguro de que deseas eliminar{" "}
                <strong>{deletingProducto?.nombre}</strong>?
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
                  onClick={deleteProducto}
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
