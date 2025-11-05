import { useEffect, useState } from "react"
import { Toaster, toast } from "react-hot-toast"
import { useAuth } from '../../../hooks/useAuth';
import {
  Home,
  Users,
  UserPlus,
  UserCheck,
  FileText,
  BedDouble,
  Building2,
  Box,
  Truck,
  Archive,
  Receipt,
  BarChart2,
  ClipboardList,
  Search,
  Download,
  Save,
  Plus,
  Edit,
  Trash2,
  Eye,
  LogOut,
  Bell,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Calendar,
  Stethoscope,
  Clock,
} from "lucide-react"
import { jsPDF } from "jspdf"

/**
 * AdminHospitalDashboard.jsx
 * - Misma estética que tu page.jsx
 * - Todas las acciones CRUD están simuladas en frontend
 * - Modales implementados con Tailwind puro
 */

export default function AdminHospitalDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")
  const { logout } = useAuth()

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

/* -------------------- Inicio -------------------- */
function InicioContent({ setActive }) {
  const [ocupacion] = useState(72)
  const [stockBajo] = useState(14)
  const [factPendientes] = useState(5)

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
      <p className="text-gray-600 mb-6">Resumen rápido de los módulos.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CardSimple title="Ocupación" value={`${ocupacion}%`} subtitle="Camas ocupadas" icon={<CheckCircle className="w-10 h-10 text-green-600" />} />
        <CardSimple title="Stock bajo" value={stockBajo} subtitle="Productos por reponer" icon={<AlertCircle className="w-10 h-10 text-yellow-600" />} />
        <CardSimple title="Facturas pendientes" value={factPendientes} subtitle="Pendientes por cobrar" icon={<Receipt className="w-10 h-10 text-red-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActive('usuarios')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><UserPlus className="w-6 h-6" /><p className="font-medium">Usuarios</p><p className="text-sm text-gray-500">Crear/editar/desactivar</p></button>
            <button onClick={() => setActive('perfiles')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><UserCheck className="w-6 h-6" /><p className="font-medium">Perfiles</p><p className="text-sm text-gray-500">CRUD profesionales</p></button>
            <button onClick={() => setActive('infraestructura')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><BedDouble className="w-6 h-6" /><p className="font-medium">Infraestructura</p><p className="text-sm text-gray-500">Habitaciones y camas</p></button>
            <button onClick={() => setActive('compras')} className="bg-gray-50 p-4 rounded-lg text-left hover:bg-gray-100"><Box className="w-6 h-6" /><p className="font-medium">Compras</p><p className="text-sm text-gray-500">Ingresar lotes</p></button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Actividad reciente</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-600 mt-1" /><div><p className="font-medium">Compra registrada</p><p className="text-sm text-gray-500">FarmaPlus — 10/04/2025</p></div></li>
            <li className="flex items-start gap-3"><AlertCircle className="w-5 h-5 text-yellow-600 mt-1" /><div><p className="font-medium">Stock bajo</p><p className="text-sm text-gray-500">Paracetamol 500mg</p></div></li>
            <li className="flex items-start gap-3"><Receipt className="w-5 h-5 text-red-600 mt-1" /><div><p className="font-medium">Factura pendiente</p><p className="text-sm text-gray-500">Internación — Martínez</p></div></li>
          </ul>
        </div>
      </div>
    </>
  )
}

/* -------------------- Usuarios: modal create/edit + simulated actions -------------------- */
function UsuariosContent() {
  const initialUsers = [
    { id: 1, nombre: "Dr. Juan Pérez", rol: "Médico", activo: true, email: "juan.perez@hospital.local" },
    { id: 2, nombre: "Enf. Marta López", rol: "Enfermero", activo: true, email: "marta.lopez@hospital.local" },
    { id: 3, nombre: "Carlos Ramos", rol: "Recepcionista", activo: false, email: "carlos.ramos@hospital.local" },
  ]
  const [users, setUsers] = useState(initialUsers)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico" })

  useEffect(() => {
    if (editing) {
      setForm({
        nombre: editing.nombre.split(' ')[1] || "",
        apellido: editing.nombre.split(' ')[0] || "",
        dni: editing.dni || "",
        email: editing.email,
        fechaNacimiento: editing.fechaNacimiento || "",
        telefono: editing.telefono || "",
        username: editing.username || "",
        rol: editing.rol
      })
    }
  }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico" }); setModalOpen(true) }
  const openEdit = (u) => { setEditing(u); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre || !form.apellido || !form.dni || !form.email || !form.username) { toast.error("Completar todos los campos requeridos"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900)) // simula request
    if (editing) {
      setUsers(users.map(u => u.id === editing.id ? { ...u, nombre: `${form.apellido} ${form.nombre}`, ...form } : u))
      toast.success("Usuario modificado (simulado)")
    } else {
      const nuevo = { id: Date.now(), ...form, nombre: `${form.apellido} ${form.nombre}`, activo: true, password: form.dni }
      setUsers([nuevo, ...users])
      toast.success("Usuario creado (simulado)")
    }
    setModalOpen(false)
    setEditing(null)
    setForm({ nombre: "", apellido: "", dni: "", email: "", fechaNacimiento: "", telefono: "", username: "", rol: "Médico" })
    setLoading(false)
  }

  const toggleActive = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, activo: !u.activo } : u))
    toast.success("Estado actualizado (simulado)")
  }

  const remove = (id) => {
    if (!confirm("¿Eliminar usuario?")) return
    setUsers(users.filter(u => u.id !== id))
    toast.success("Usuario eliminado (simulado)")
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <div className="flex gap-2">
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Rol</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Estado</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{u.nombre}</td>
                  <td className="px-6 py-4">{u.rol}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{u.activo ? 'Activo' : 'Desactivado'}</span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(u)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm flex items-center gap-1"><Edit className="w-4 h-4" />Editar</button>
                    <button onClick={() => toggleActive(u.id)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm flex items-center gap-1"><UserCheck className="w-4 h-4" />{u.activo ? 'Desactivar' : 'Activar'}</button>
                    <button onClick={() => remove(u.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm flex items-center gap-1"><Trash2 className="w-4 h-4" />Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="p-4 text-sm text-gray-500">No hay usuarios.</p>}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={() => { if (!loading) setModalOpen(false); }}>
          <h3 className="text-xl font-semibold mb-4">{editing ? 'Editar Usuario' : 'Crear Usuario'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Apellido</label>
              <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">DNI</label>
              <input value={form.dni} onChange={e => setForm({ ...form, dni: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Fecha de Nacimiento</label>
              <input type="date" value={form.fechaNacimiento} onChange={e => setForm({ ...form, fechaNacimiento: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Teléfono</label>
              <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Nombre de Usuario</label>
              <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="w-full rounded-lg border p-2" />
            </div>
            <div>
              <label className="text-sm text-gray-500">Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })} className="w-full rounded-lg border p-2">
                <option>Médico</option>
                <option>Enfermero</option>
                <option>Recepcionista</option>
                <option>Administrativo</option>
              </select>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500">La contraseña será el DNI.</p>
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <button onClick={save} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2">
              {loading ? 'Guardando...' : (<><Save className="w-4 h-4" /> Guardar</>)}
            </button>
            <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
          </div>
        </Modal>
      )}
    </>
  )
}


/* -------------------- Personas / Pacientes (modal) -------------------- */

/* -------------------- Infraestructura (modal) -------------------- */
function InfraestructuraContent() {
  const initialRooms = [
    { id: 101, tipo: "Habitación", camas: 2, ocupadas: 1 },
    { id: 201, tipo: "Quirófano", camas: 0, ocupadas: 0 },
  ]
  const [rooms, setRooms] = useState(initialRooms)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ id: "", tipo: "Habitación", camas: 1 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ id: editing.id, tipo: editing.tipo, camas: editing.camas }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ id: "", tipo: "Habitación", camas: 1 }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setModalOpen(true) }

  const save = async () => {
    if (!form.id) { toast.error('Número requerido'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    if (editing) {
      setRooms(rooms.map(rm => rm.id === editing.id ? { ...rm, ...form, camas: Number(form.camas) } : rm))
      toast.success('Elemento actualizado (simulado)')
    } else {
      setRooms([{ id: form.id, tipo: form.tipo, camas: Number(form.camas), ocupadas: 0 }, ...rooms])
      toast.success('Elemento agregado (simulado)')
    }
    setLoading(false)
    setModalOpen(false)
    setEditing(null)
  }

  const occupy = (id) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ocupadas: Math.min(r.camas, r.ocupadas + 1) } : r))
    toast.success('Ocupación actualizada (simulado)')
  }

  const remove = (id) => {
    if (!confirm('Eliminar elemento de infraestructura?')) return
    setRooms(rooms.filter(r => r.id !== id))
    toast.success('Eliminado (simulado)')
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Infraestructura</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">N°</th>
                <th className="px-6 py-3 text-xs text-gray-500">Tipo</th>
                <th className="px-6 py-3 text-xs text-gray-500">Camas</th>
                <th className="px-6 py-3 text-xs text-gray-500">Ocupadas</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rooms.map(r => (
                <tr key={r.id}>
                  <td className="px-6 py-4">{r.id}</td>
                  <td className="px-6 py-4">{r.tipo}</td>
                  <td className="px-6 py-4">{r.camas}</td>
                  <td className="px-6 py-4">{r.ocupadas}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(r)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => occupy(r.id)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">Ocupar</button>
                    <button onClick={() => remove(r.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar elemento' : 'Nuevo elemento'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Número</label>
            <input value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Tipo</label>
            <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="w-full rounded-lg border p-2">
              <option>Habitación</option>
              <option>Quirófano</option>
              <option>UCI</option>
            </select>
            <label className="text-sm text-gray-500">Camas</label>
            <input type="number" value={form.camas} onChange={e => setForm({ ...form, camas: e.target.value })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

/* -------------------- Productos & Proveedores (modal) -------------------- */
function ProductosContent() {
  const initial = [
    { id: 1, nombre: "Paracetamol 500mg", stock: 8, proveedor: "FarmaPlus", vencimiento: "2025-11-30" },
    { id: 2, nombre: "Guantes Nitrilo", stock: 150, proveedor: "MedSupplies", vencimiento: "2027-01-01" },
  ]
  const [items, setItems] = useState(initial)
  const [filter, setFilter] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nombre: "", stock: 0, proveedor: "", vencimiento: "" })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ nombre: editing.nombre, stock: editing.stock, proveedor: editing.proveedor, vencimiento: editing.vencimiento }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", stock: 0, proveedor: "", vencimiento: "" }); setModalOpen(true) }
  const openEdit = (it) => { setEditing(it); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre) { toast.error('Nombre requerido'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (editing) {
      setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i))
      toast.success('Producto actualizado (simulado)')
    } else {
      setItems([{ id: Date.now(), ...form }, ...items])
      toast.success('Producto creado (simulado)')
    }
    setModalOpen(false)
    setEditing(null)
    setLoading(false)
  }

  const downloadCSV = () => {
    const csv = ["Nombre,Stock,Proveedor,Vencimiento", ...items.map(i => `${i.nombre},${i.stock},${i.proveedor},${i.vencimiento}`)].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'productos.csv'; a.click(); a.remove()
    toast.success("CSV descargado (simulado)")
  }

  const viewLotes = (item) => {
    toast.info(`Ver lotes de ${item.nombre} (simulado)`)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Productos y Proveedores</h1>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Download className="w-4 h-4" /> Exportar CSV</button>
          <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <input placeholder="Buscar producto o proveedor" value={filter} onChange={e => setFilter(e.target.value)} className="rounded-lg border p-2 w-1/3" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Producto</th>
                <th className="px-6 py-3 text-xs text-gray-500">Stock</th>
                <th className="px-6 py-3 text-xs text-gray-500">Proveedor</th>
                <th className="px-6 py-3 text-xs text-gray-500">Vencimiento</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.filter(i => i.nombre.toLowerCase().includes(filter.toLowerCase()) || i.proveedor.toLowerCase().includes(filter.toLowerCase())).map(i => (
                <tr key={i.id}>
                  <td className="px-6 py-4">{i.nombre}</td>
                  <td className={`px-6 py-4 ${i.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>{i.stock}</td>
                  <td className="px-6 py-4">{i.proveedor}</td>
                  <td className="px-6 py-4">{i.vencimiento}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(i)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => viewLotes(i)} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">Lotes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-4 text-sm text-gray-500">No hay productos.</p>}
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Proveedor</label>
            <input value={form.proveedor} onChange={e => setForm({ ...form, proveedor: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Vencimiento</label>
            <input type="date" value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

/* -------------------- Compras / Stock-Lotes (modal) -------------------- */
function ComprasContent() {
  const [purchases, setPurchases] = useState([
    { id: 1, proveedor: "FarmaPlus", fecha: "2025-04-10", total: 120000, items: 10 },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ producto: "", lote: "", vencimiento: "", cantidad: 0 })
  const [loading, setLoading] = useState(false)

  const register = async () => {
    if (!form.producto || !form.lote) { toast.error("Completar datos del lote"); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setPurchases([{ id: Date.now(), proveedor: "Proveedor X", fecha: new Date().toLocaleDateString(), total: 0, items: form.cantidad }, ...purchases])
    toast.success("Compra registrada & stock ingresado (simulado)")
    setForm({ producto: "", lote: "", vencimiento: "", cantidad: 0 })
    setModalOpen(false)
    setLoading(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Compras y Stock (lote + vencimiento)</h1>
        <div>
          <button onClick={() => setModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Ingresar lote</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold mb-4">Compras recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Proveedor</th>
                <th className="px-6 py-3 text-xs text-gray-500">Fecha</th>
                <th className="px-6 py-3 text-xs text-gray-500">Total</th>
                <th className="px-6 py-3 text-xs text-gray-500">Items</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {purchases.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.proveedor}</td>
                  <td className="px-6 py-4">{p.fecha}</td>
                  <td className="px-6 py-4">${p.total.toLocaleString()}</td>
                  <td className="px-6 py-4">{p.items}</td>
                  <td className="px-6 py-4"><button onClick={() => toast('Detalle (simulado)')} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">Detalle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">Ingresar stock por lote</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Producto</label>
            <input value={form.producto} onChange={e => setForm({ ...form, producto: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Lote</label>
            <input value={form.lote} onChange={e => setForm({ ...form, lote: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Vencimiento</label>
            <input type="date" value={form.vencimiento} onChange={e => setForm({ ...form, vencimiento: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Cantidad</label>
            <input type="number" value={form.cantidad} onChange={e => setForm({ ...form, cantidad: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={register} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Registrando...' : 'Registrar compra'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

/* -------------------- Prestaciones (modal) -------------------- */
function PrestacionesContent() {
  const [prestaciones, setPrestaciones] = useState([
    { id: 1, codigo: "P-001", nombre: "Consulta de Clínica", precio: 8000 },
    { id: 2, codigo: "P-002", nombre: "Sala de Internación (día)", precio: 45000 },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ codigo: "", nombre: "", precio: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ codigo: editing.codigo, nombre: editing.nombre, precio: editing.precio }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ codigo: "", nombre: "", precio: 0 }); setModalOpen(true) }
  const openEdit = (p) => { setEditing(p); setModalOpen(true) }

  const save = async () => {
    if (!form.codigo || !form.nombre) { toast.error('Código y nombre requeridos'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    if (editing) {
      setPrestaciones(prestaciones.map(pr => pr.id === editing.id ? { ...pr, ...form } : pr))
      toast.success('Prestación actualizada (simulado)')
    } else {
      setPrestaciones([{ id: Date.now(), ...form }, ...prestaciones])
      toast.success('Prestación creada (simulado)')
    }
    setModalOpen(false)
    setLoading(false)
    setEditing(null)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Prestaciones y Precios</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Código</th>
                <th className="px-6 py-3 text-xs text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-xs text-gray-500">Precio</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {prestaciones.map(p => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.codigo}</td>
                  <td className="px-6 py-4">{p.nombre}</td>
                  <td className="px-6 py-4">${p.precio.toLocaleString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(p)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar prestación' : 'Nueva prestación'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Código</label>
            <input value={form.codigo} onChange={e => setForm({ ...form, codigo: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Precio</label>
            <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

/* -------------------- Facturación (simulada pagos complejos) -------------------- */
function FacturacionContent() {
  const invoices = [
    { id: 1, numero: "FAC-2025-0342", fecha: "2025-03-20", concepto: "Internación", monto: 250000, estado: "Pendiente" },
    { id: 2, numero: "FAC-2025-0298", fecha: "2025-02-28", concepto: "Consulta", monto: 8500, estado: "Pagada" },
  ]
  const [payments, setPayments] = useState([])
  const [selected, setSelected] = useState(null)
  const [modalPayOpen, setModalPayOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [payForm, setPayForm] = useState({ monto: 0, metodo: "Transferencia" })

  const openPayModal = (inv) => { setSelected(inv); setPayForm({ monto: inv.monto, metodo: "Transferencia" }); setModalPayOpen(true) }

  const registerPartial = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setPayments([{ id: Date.now(), facturaId: selected.id, fecha: new Date().toLocaleDateString(), monto: Number(payForm.monto), metodo: payForm.metodo }, ...payments])
    toast.success("Pago registrado (simulado)")
    setModalPayOpen(false)
    setLoading(false)
  }

  const exportResumenPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Resumen Facturación", 20, 20)
    let y = 40
    invoices.forEach(inv => { doc.setFontSize(12); doc.text(`${inv.numero} — ${inv.concepto} — $${inv.monto.toLocaleString()} — ${inv.estado}`, 20, y); y += 8 })
    doc.save("resumen_facturacion.pdf")
    toast.success("PDF descargado (simulado)")
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
        <div className="flex gap-2">
          <button onClick={exportResumenPDF} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Download className="w-4 h-4" />Exportar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4">Facturas</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-xs text-gray-500">N°</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Fecha</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Concepto</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Monto</th>
                  <th className="px-6 py-3 text-xs text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map(inv => (
                  <tr key={inv.id} onClick={() => setSelected(inv)} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-6 py-4">{inv.numero}</td>
                    <td className="px-6 py-4">{inv.fecha}</td>
                    <td className="px-6 py-4">{inv.concepto}</td>
                    <td className="px-6 py-4">${inv.monto.toLocaleString()}</td>
                    <td className="px-6 py-4">{inv.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-4">Detalle / Registrar pago</h3>
          {selected ? (
            <>
              <p className="text-sm text-gray-600 mb-2">Factura: <span className="font-medium">{selected.numero}</span></p>
              <p className="text-sm text-gray-600 mb-4">Monto: <span className="font-medium">${selected.monto.toLocaleString()}</span></p>
              <div className="flex gap-2">
                <button onClick={() => openPayModal(selected)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Registrar Pago</button>
                <button onClick={() => toast('Abrir modal pagos compuestos (simulado)')} className="px-4 py-2 bg-blue-50 rounded-lg">Pago complejo</button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Seleccione una factura para ver detalle y registrar pagos.</p>
          )}

          <div className="mt-6">
            <h4 className="font-semibold mb-2">Historial de pagos (simulado)</h4>
            {payments.length === 0 ? <p className="text-sm text-gray-500">Sin pagos registrados.</p> : (
              <ul className="space-y-2">{payments.map(p => <li key={p.id} className="text-sm text-gray-700">{p.fecha} — ${p.monto.toLocaleString()} — {p.metodo}</li>)}</ul>
            )}
          </div>
        </div>
      </div>

      {modalPayOpen && (
        <Modal onClose={() => setModalPayOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">Registrar pago</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Monto</label>
            <input type="number" value={payForm.monto} onChange={e => setPayForm({ ...payForm, monto: Number(e.target.value) })} className="w-full rounded-lg border p-2" />
            <label className="text-sm text-gray-500">Método</label>
            <select value={payForm.metodo} onChange={e => setPayForm({ ...payForm, metodo: e.target.value })} className="w-full rounded-lg border p-2">
              <option>Transferencia</option>
              <option>Tarjeta</option>
              <option>Efectivo</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button onClick={registerPartial} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg">{loading ? 'Registrando...' : 'Registrar pago'}</button>
              <button onClick={() => setModalPayOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

/* -------------------- Reportes -------------------- */
function ReportesContent() {
  const reportData = { ocupacion: 74, stockBajo: 12, facturacionPendiente: 420000 }
  const [generating, setGenerating] = useState(false)

  const gen = async (tipo) => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 900))
    setGenerating(false)
    toast.success(`${tipo} generado (simulado)`)
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Reportes</h1>
      <p className="text-gray-600 mb-6">Generación de reportes: ocupación, stock bajo, facturación pendiente.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Ocupación</h3>
          <p className="text-3xl font-bold mb-2">{reportData.ocupacion}%</p>
          <button onClick={() => gen('Reporte de ocupación')} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Exportar PDF'}</button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Stock bajo</h3>
          <p className="text-3xl font-bold mb-2">{reportData.stockBajo}</p>
          <button onClick={() => gen('Reporte de stock')} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Exportar CSV'}</button>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold mb-2">Facturación pendiente</h3>
          <p className="text-3xl font-bold mb-2">${reportData.facturacionPendiente.toLocaleString()}</p>
          <button onClick={() => gen('Reporte de facturación pendiente')} className="px-3 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Exportar'}</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="font-semibold mb-4">Generar reporte personalizado</h3>
        <div className="flex gap-2">
          <select className="rounded-lg border p-2">
            <option>Últimos 30 días</option>
            <option>Últimos 3 meses</option>
            <option>Año fiscal</option>
          </select>
          <button onClick={() => gen('Reporte personalizado')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{generating ? 'Generando...' : 'Generar'}</button>
        </div>
      </div>
    </>
  )
}

/* -------------------- Auditoría -------------------- */
function AuditoriaContent() {
  const [logs] = useState([
    { id: 1, who: "admin", action: "Creó usuario Dr. Juan Pérez", when: "2025-04-10 09:12" },
    { id: 2, who: "sistema", action: "Stock Paracetamol modificado", when: "2025-04-11 14:03" },
  ])

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Auditoría</h1>
      <p className="text-gray-600 mb-4">Registro de eventos del sistema y cambios importantes.</p>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Usuario</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acción</th>
                <th className="px-6 py-3 text-xs text-gray-500">Fecha / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(l => (
                <tr key={l.id}>
                  <td className="px-6 py-4">{l.who}</td>
                  <td className="px-6 py-4">{l.action}</td>
                  <td className="px-6 py-4">{l.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

/* -------------------- Especialidades -------------------- */
function EspecialidadesContent() {
  const [esp, setEsp] = useState([
    { id: 1, nombre: "Cardiología", es_quirurgica: false },
    { id: 2, nombre: "Cirugía General", es_quirurgica: true },
  ])
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ nombre: "", es_quirurgica: false })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (editing) setForm({ nombre: editing.nombre, es_quirurgica: editing.es_quirurgica }) }, [editing])

  const openCreate = () => { setEditing(null); setForm({ nombre: "", es_quirurgica: false }); setModalOpen(true) }
  const openEdit = (e) => { setEditing(e); setModalOpen(true) }

  const save = async () => {
    if (!form.nombre) { toast.error('Nombre requerido'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    if (editing) {
      setEsp(esp.map(x => x.id === editing.id ? { ...x, ...form } : x))
      toast.success('Especialidad actualizada (simulado)')
    } else {
      setEsp([{ id: Date.now(), ...form }, ...esp])
      toast.success('Especialidad agregada (simulado)')
    }
    setModalOpen(false)
    setEditing(null)
    setLoading(false)
  }

  const toggleSurgical = (id) => { setEsp(esp.map(e => e.id === id ? { ...e, es_quirurgica: !e.es_quirurgica } : e)); toast.success('Actualizado (simulado)') }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Especialidades</h1>
        <div>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg"><Plus className="w-4 h-4" /> Nuevo</button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-xs text-gray-500">Nombre</th>
                <th className="px-6 py-3 text-xs text-gray-500">Es Quirúrgica</th>
                <th className="px-6 py-3 text-xs text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {esp.map(e => (
                <tr key={e.id}>
                  <td className="px-6 py-4">{e.nombre}</td>
                  <td className="px-6 py-4">{e.es_quirurgica ? 'Sí' : 'No'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEdit(e)} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-sm"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => toggleSurgical(e.id)} className={`px-2 py-1 rounded text-sm ${e.es_quirurgica ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{e.es_quirurgica ? 'Quitar quirúrgica' : 'Marcar quirúrgica'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold mb-2">{editing ? 'Editar especialidad' : 'Nueva especialidad'}</h3>
          <div className="space-y-3">
            <label className="text-sm text-gray-500">Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="w-full rounded-lg border p-2" />
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.es_quirurgica} onChange={e => setForm({ ...form, es_quirurgica: e.target.checked })} /> Marcar como quirúrgica</label>
            <div className="flex gap-2 mt-2">
              <button onClick={save} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">{loading ? 'Guardando...' : 'Guardar'}</button>
              <button onClick={() => setModalOpen(false)} disabled={loading} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}

/* -------------------- Reutilizables: Modal y pequeños componentes -------------------- */

function Modal({ children, onClose }) {
  // Modal sencillo con backdrop. Cierra al click en overlay.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-xl p-6 max-w-2xl w-full border border-gray-200 z-10 shadow-lg">
        {children}
      </div>
    </div>
  )
}

function SidebarButton({ icon: Icon, label, section, active, setActive }) {
  const isActive = active === section
  return (
    <button onClick={() => setActive(section)} className={`w-full flex items-center gap-3 px-4 py-3 mb-2 text-left rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  )
}

function CardSimple({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div>{icon}</div>
    </div>
  )
}
