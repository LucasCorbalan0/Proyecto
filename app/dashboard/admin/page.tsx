"use client"

import { useState } from "react"
import Link from "next/link"

export default function AdminDashboard() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState("usuarios")

  const openModal = (modal: string) => setActiveModal(modal)
  const closeModal = () => setActiveModal(null)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold">Hospital Admin</h1>
        </div>

        <nav className="flex-1 py-4">
          <button
            onClick={() => setActiveSection("usuarios")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "usuarios" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>Usuarios</span>
          </button>

          <button
            onClick={() => setActiveSection("medicos")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "medicos" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Médicos</span>
          </button>

          <button
            onClick={() => setActiveSection("enfermeros")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "enfermeros" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Enfermeros</span>
          </button>

          <button
            onClick={() => setActiveSection("pacientes")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "pacientes" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Pacientes</span>
          </button>

          <button
            onClick={() => setActiveSection("turnos")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "turnos" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Turnos</span>
          </button>

          <button
            onClick={() => setActiveSection("habitaciones")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "habitaciones" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Habitaciones</span>
          </button>

          <button
            onClick={() => setActiveSection("consultas")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "consultas" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>Consultas</span>
          </button>

          <button
            onClick={() => setActiveSection("estudios")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "estudios" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Estudios médicos</span>
          </button>

          <button
            onClick={() => setActiveSection("recetas")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "recetas" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Recetas</span>
          </button>

          <button
            onClick={() => setActiveSection("configuracion")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "configuracion" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Configuración</span>
          </button>
        </nav>

        <div className="p-4 border-t border-blue-700">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Bienvenido, Alejandro</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestión de usuarios */}
          <button
            onClick={() => openModal("usuarios")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de usuarios</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  129 <span className="text-sm font-normal text-gray-600">usuarios</span>
                </p>
                <p className="text-sm text-gray-600">5 roles diferentes</p>
              </div>
            </div>
          </button>

          {/* Médicos registrados */}
          <button
            onClick={() => openModal("medicos")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Médicos registrados</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  48 <span className="text-sm font-normal text-gray-600">médicos</span>
                </p>
                <p className="text-sm text-gray-600 mb-3">10 especialidades</p>
                <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  CRUD médicos
                </span>
              </div>
            </div>
          </button>

          {/* Turnos programados */}
          <button
            onClick={() => openModal("turnos")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Turnos programados</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  457 <span className="text-sm font-normal text-gray-600">turnos programados</span>
                </p>
                <p className="text-sm text-gray-600">15 sin asignar</p>
              </div>
            </div>
          </button>

          {/* Habitaciones y camas */}
          <button
            onClick={() => openModal("habitaciones")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Habitaciones y camas</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  50 <span className="text-sm font-normal text-gray-600">habitaciones</span>
                </p>
                <p className="text-sm text-gray-600">4 mantenimiento</p>
                <p className="text-sm text-gray-600">38 camas disponibles</p>
              </div>
            </div>
          </button>

          {/* Consultas clínicas */}
          <button
            onClick={() => openModal("consultas")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultas clínicas</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  760 <span className="text-sm font-normal text-gray-600">consultas atendidas</span>
                </p>
                <p className="text-sm text-gray-600">4 cirugías hoy</p>
              </div>
            </div>
          </button>

          {/* Estudios y cirugías */}
          <button
            onClick={() => openModal("estudios")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Estudios, cirugías</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  18 <span className="text-sm font-normal text-gray-600">estudios por realizar</span>
                </p>
                <p className="text-sm text-gray-600">4 cirugías hoy</p>
              </div>
            </div>
          </button>

          {/* Estadísticas y logs */}
          <button
            onClick={() => openModal("estadisticas")}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas y logs</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  2,405 <span className="text-sm font-normal text-gray-600">pacientes atendidos</span>
                </p>
                <p className="text-sm text-gray-600">742 ciclos clínicos</p>
              </div>
            </div>
          </button>
        </div>
      </main>

      {/* Modal Backdrop with Blur */}
      {activeModal && <div className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40" onClick={closeModal} />}

      {/* Modals */}
      {activeModal === "usuarios" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  + Nuevo Usuario
                </button>
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rol
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
                    {[
                      { id: 1, nombre: "Juan Pérez", email: "juan@hospital.com", rol: "Admin", estado: "Activo" },
                      { id: 2, nombre: "María García", email: "maria@hospital.com", rol: "Médico", estado: "Activo" },
                      {
                        id: 3,
                        nombre: "Carlos López",
                        email: "carlos@hospital.com",
                        rol: "Enfermero",
                        estado: "Activo",
                      },
                      { id: 4, nombre: "Ana Martínez", email: "ana@hospital.com", rol: "Paciente", estado: "Activo" },
                      {
                        id: 5,
                        nombre: "Luis Rodríguez",
                        email: "luis@hospital.com",
                        rol: "Médico",
                        estado: "Inactivo",
                      },
                    ].map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {usuario.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{usuario.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {usuario.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              usuario.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {usuario.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                          <button className="text-red-600 hover:text-red-800">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "medicos" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Médicos</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  + Nuevo Médico
                </button>
                <input
                  type="text"
                  placeholder="Buscar médico..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todas las especialidades</option>
                  <option>Cardiología</option>
                  <option>Pediatría</option>
                  <option>Neurología</option>
                  <option>Traumatología</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { nombre: "Dr. Roberto Sánchez", especialidad: "Cardiología", pacientes: 45, disponible: true },
                  { nombre: "Dra. Laura Fernández", especialidad: "Pediatría", pacientes: 62, disponible: true },
                  { nombre: "Dr. Miguel Torres", especialidad: "Neurología", pacientes: 38, disponible: false },
                  { nombre: "Dra. Carmen Ruiz", especialidad: "Traumatología", pacientes: 51, disponible: true },
                  { nombre: "Dr. José Morales", especialidad: "Cardiología", pacientes: 42, disponible: true },
                  { nombre: "Dra. Patricia Díaz", especialidad: "Pediatría", pacientes: 58, disponible: false },
                ].map((medico, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{medico.nombre}</h3>
                        <p className="text-sm text-gray-600">{medico.especialidad}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">
                        Pacientes activos: <span className="font-semibold text-gray-900">{medico.pacientes}</span>
                      </p>
                      <p className="text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            medico.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {medico.disponible ? "Disponible" : "No disponible"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Ver perfil
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                        Editar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "turnos" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Turnos</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  + Nuevo Turno
                </button>
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos los estados</option>
                  <option>Confirmado</option>
                  <option>Pendiente</option>
                  <option>Cancelado</option>
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-medium">⚠️ 15 turnos sin asignar médico</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especialidad
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
                    {[
                      {
                        fecha: "2025-10-08",
                        hora: "09:00",
                        paciente: "Ana Martínez",
                        medico: "Dr. Sánchez",
                        especialidad: "Cardiología",
                        estado: "Confirmado",
                      },
                      {
                        fecha: "2025-10-08",
                        hora: "10:00",
                        paciente: "Pedro Gómez",
                        medico: "Sin asignar",
                        especialidad: "Pediatría",
                        estado: "Pendiente",
                      },
                      {
                        fecha: "2025-10-08",
                        hora: "11:00",
                        paciente: "Laura Silva",
                        medico: "Dra. Fernández",
                        especialidad: "Pediatría",
                        estado: "Confirmado",
                      },
                      {
                        fecha: "2025-10-08",
                        hora: "14:00",
                        paciente: "Carlos Ruiz",
                        medico: "Dr. Torres",
                        especialidad: "Neurología",
                        estado: "Confirmado",
                      },
                      {
                        fecha: "2025-10-09",
                        hora: "09:00",
                        paciente: "María López",
                        medico: "Sin asignar",
                        especialidad: "Traumatología",
                        estado: "Pendiente",
                      },
                    ].map((turno, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{turno.fecha}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{turno.hora}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {turno.paciente}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {turno.medico === "Sin asignar" ? (
                            <span className="text-red-600 font-medium">{turno.medico}</span>
                          ) : (
                            turno.medico
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turno.especialidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              turno.estado === "Confirmado"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {turno.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button>
                          <button className="text-red-600 hover:text-red-800">Cancelar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "habitaciones" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Disponibles</p>
                  <p className="text-3xl font-bold text-green-700">38</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Ocupadas</p>
                  <p className="text-3xl font-bold text-blue-700">8</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-1">Mantenimiento</p>
                  <p className="text-3xl font-bold text-orange-700">4</p>
                </div>
              </div>

              <div className="mb-6 flex gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos los pisos</option>
                  <option>Piso 1</option>
                  <option>Piso 2</option>
                  <option>Piso 3</option>
                  <option>Piso 4</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos los estados</option>
                  <option>Disponible</option>
                  <option>Ocupada</option>
                  <option>Mantenimiento</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { numero: "101", piso: 1, tipo: "Individual", estado: "Disponible", paciente: null },
                  { numero: "102", piso: 1, tipo: "Doble", estado: "Ocupada", paciente: "Juan Pérez" },
                  { numero: "103", piso: 1, tipo: "Individual", estado: "Mantenimiento", paciente: null },
                  { numero: "104", piso: 1, tipo: "Suite", estado: "Disponible", paciente: null },
                  { numero: "201", piso: 2, tipo: "Individual", estado: "Ocupada", paciente: "María García" },
                  { numero: "202", piso: 2, tipo: "Doble", estado: "Disponible", paciente: null },
                  { numero: "203", piso: 2, tipo: "Individual", estado: "Disponible", paciente: null },
                  { numero: "204", piso: 2, tipo: "Suite", estado: "Ocupada", paciente: "Carlos López" },
                ].map((habitacion) => (
                  <div
                    key={habitacion.numero}
                    className={`border-2 rounded-xl p-4 ${
                      habitacion.estado === "Disponible"
                        ? "border-green-300 bg-green-50"
                        : habitacion.estado === "Ocupada"
                          ? "border-blue-300 bg-blue-50"
                          : "border-orange-300 bg-orange-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">#{habitacion.numero}</h3>
                        <p className="text-sm text-gray-600">Piso {habitacion.piso}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          habitacion.estado === "Disponible"
                            ? "bg-green-200 text-green-800"
                            : habitacion.estado === "Ocupada"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-orange-200 text-orange-800"
                        }`}
                      >
                        {habitacion.estado}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{habitacion.tipo}</p>
                    {habitacion.paciente && (
                      <p className="text-sm font-medium text-gray-900">Paciente: {habitacion.paciente}</p>
                    )}
                    <button className="mt-3 w-full px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      Ver detalles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "consultas" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Consultas</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Total atendidas</p>
                  <p className="text-3xl font-bold text-blue-700">760</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Hoy</p>
                  <p className="text-3xl font-bold text-green-700">24</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">Cirugías hoy</p>
                  <p className="text-3xl font-bold text-purple-700">4</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-1">Pendientes</p>
                  <p className="text-3xl font-bold text-orange-700">12</p>
                </div>
              </div>

              <div className="mb-6 flex gap-4">
                <input
                  type="date"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todas las especialidades</option>
                  <option>Cardiología</option>
                  <option>Pediatría</option>
                  <option>Neurología</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Todos los estados</option>
                  <option>Completada</option>
                  <option>En proceso</option>
                  <option>Pendiente</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Especialidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
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
                    {[
                      {
                        fecha: "2025-10-07",
                        paciente: "Ana Martínez",
                        medico: "Dr. Sánchez",
                        especialidad: "Cardiología",
                        tipo: "Consulta",
                        estado: "Completada",
                      },
                      {
                        fecha: "2025-10-07",
                        paciente: "Pedro Gómez",
                        medico: "Dra. Fernández",
                        especialidad: "Pediatría",
                        tipo: "Consulta",
                        estado: "Completada",
                      },
                      {
                        fecha: "2025-10-07",
                        paciente: "Laura Silva",
                        medico: "Dr. Torres",
                        especialidad: "Neurología",
                        tipo: "Cirugía",
                        estado: "En proceso",
                      },
                      {
                        fecha: "2025-10-08",
                        paciente: "Carlos Ruiz",
                        medico: "Dra. Ruiz",
                        especialidad: "Traumatología",
                        tipo: "Cirugía",
                        estado: "Pendiente",
                      },
                      {
                        fecha: "2025-10-08",
                        paciente: "María López",
                        medico: "Dr. Morales",
                        especialidad: "Cardiología",
                        tipo: "Consulta",
                        estado: "Pendiente",
                      },
                    ].map((consulta, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consulta.fecha}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {consulta.paciente}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consulta.medico}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{consulta.especialidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              consulta.tipo === "Cirugía"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {consulta.tipo}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              consulta.estado === "Completada"
                                ? "bg-green-100 text-green-800"
                                : consulta.estado === "En proceso"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {consulta.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button className="text-blue-600 hover:text-blue-800">Ver detalles</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "estudios" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Estudios Médicos y Cirugías</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Estudios Pendientes</h3>
                  <div className="space-y-3">
                    {[
                      { paciente: "Ana Martínez", tipo: "Resonancia Magnética", fecha: "2025-10-08" },
                      { paciente: "Pedro Gómez", tipo: "Tomografía", fecha: "2025-10-08" },
                      { paciente: "Laura Silva", tipo: "Ecografía", fecha: "2025-10-09" },
                    ].map((estudio, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{estudio.paciente}</p>
                        <p className="text-sm text-gray-600">{estudio.tipo}</p>
                        <p className="text-sm text-blue-600">{estudio.fecha}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Cirugías Programadas Hoy</h3>
                  <div className="space-y-3">
                    {[
                      { paciente: "Carlos Ruiz", tipo: "Cirugía Cardiovascular", hora: "08:00", sala: "Quirófano 1" },
                      { paciente: "María López", tipo: "Cirugía Ortopédica", hora: "11:00", sala: "Quirófano 2" },
                      { paciente: "José Fernández", tipo: "Cirugía General", hora: "14:00", sala: "Quirófano 1" },
                      { paciente: "Carmen Díaz", tipo: "Cirugía Neurológica", hora: "16:00", sala: "Quirófano 3" },
                    ].map((cirugia, index) => (
                      <div key={index} className="bg-white p-4 rounded-lg">
                        <p className="font-medium text-gray-900">{cirugia.paciente}</p>
                        <p className="text-sm text-gray-600">{cirugia.tipo}</p>
                        <div className="flex justify-between mt-2">
                          <p className="text-sm text-purple-600">{cirugia.hora}</p>
                          <p className="text-sm text-gray-600">{cirugia.sala}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estudios</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Paciente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de estudio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Médico solicitante
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
                      {[
                        {
                          fecha: "2025-10-06",
                          paciente: "Roberto Sánchez",
                          tipo: "Análisis de sangre",
                          medico: "Dr. Morales",
                          estado: "Completado",
                        },
                        {
                          fecha: "2025-10-06",
                          paciente: "Patricia Díaz",
                          tipo: "Radiografía",
                          medico: "Dra. Ruiz",
                          estado: "Completado",
                        },
                        {
                          fecha: "2025-10-07",
                          paciente: "Miguel Torres",
                          tipo: "Electrocardiograma",
                          medico: "Dr. Sánchez",
                          estado: "Completado",
                        },
                      ].map((estudio, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{estudio.fecha}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {estudio.paciente}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{estudio.tipo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{estudio.medico}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {estudio.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800">Ver resultados</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === "estadisticas" && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Estadísticas y Logs del Sistema</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-600 mb-1">Pacientes atendidos</p>
                  <p className="text-3xl font-bold text-blue-700">2,405</p>
                  <p className="text-xs text-blue-600 mt-1">+12% vs mes anterior</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-600 mb-1">Ciclos clínicos</p>
                  <p className="text-3xl font-bold text-green-700">742</p>
                  <p className="text-xs text-green-600 mt-1">+8% vs mes anterior</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-600 mb-1">Cirugías realizadas</p>
                  <p className="text-3xl font-bold text-purple-700">156</p>
                  <p className="text-xs text-purple-600 mt-1">+5% vs mes anterior</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-600 mb-1">Tasa de ocupación</p>
                  <p className="text-3xl font-bold text-orange-700">84%</p>
                  <p className="text-xs text-orange-600 mt-1">-3% vs mes anterior</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente del Sistema</h3>
                <div className="space-y-3">
                  {[
                    {
                      usuario: "Admin - Juan Pérez",
                      accion: "Creó nuevo usuario médico",
                      tiempo: "Hace 5 minutos",
                      tipo: "success",
                    },
                    {
                      usuario: "Dr. Sánchez",
                      accion: "Actualizó historial clínico de paciente #1234",
                      tiempo: "Hace 12 minutos",
                      tipo: "info",
                    },
                    {
                      usuario: "Enfermera - María García",
                      accion: "Registró signos vitales en habitación 201",
                      tiempo: "Hace 18 minutos",
                      tipo: "info",
                    },
                    {
                      usuario: "Sistema",
                      accion: "Backup automático completado",
                      tiempo: "Hace 1 hora",
                      tipo: "success",
                    },
                    {
                      usuario: "Admin - Juan Pérez",
                      accion: "Modificó configuración de turnos",
                      tiempo: "Hace 2 horas",
                      tipo: "warning",
                    },
                    {
                      usuario: "Dr. Torres",
                      accion: "Solicitó estudios médicos para paciente #5678",
                      tiempo: "Hace 3 horas",
                      tipo: "info",
                    },
                  ].map((log, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          log.tipo === "success"
                            ? "bg-green-500"
                            : log.tipo === "warning"
                              ? "bg-orange-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{log.usuario}</p>
                        <p className="text-sm text-gray-600">{log.accion}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.tiempo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades más solicitadas</h3>
                  <div className="space-y-3">
                    {[
                      { especialidad: "Cardiología", consultas: 245, porcentaje: 85 },
                      { especialidad: "Pediatría", consultas: 198, porcentaje: 70 },
                      { especialidad: "Traumatología", consultas: 167, porcentaje: 60 },
                      { especialidad: "Neurología", consultas: 132, porcentaje: 45 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.especialidad}</span>
                          <span className="text-sm text-gray-600">{item.consultas} consultas</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${item.porcentaje}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento del personal</h3>
                  <div className="space-y-3">
                    {[
                      { nombre: "Dr. Roberto Sánchez", consultas: 87, satisfaccion: 98 },
                      { nombre: "Dra. Laura Fernández", consultas: 76, satisfaccion: 96 },
                      { nombre: "Dr. Miguel Torres", consultas: 65, satisfaccion: 94 },
                      { nombre: "Dra. Carmen Ruiz", consultas: 58, satisfaccion: 97 },
                    ].map((medico, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{medico.nombre}</p>
                          <p className="text-xs text-gray-600">{medico.consultas} consultas este mes</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">{medico.satisfaccion}%</p>
                          <p className="text-xs text-gray-600">Satisfacción</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
