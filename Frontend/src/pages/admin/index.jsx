"use client"

import { useState } from "react"
import Link from "next/link"

export default function AdminDashboard() {
  // Solo necesitamos UN estado para saber qué sección mostrar.
  // "inicio" será nuestra sección por defecto.
  const [activeSection, setActiveSection] = useState("inicio")

  // Estado para el modal de facturación (lo mantenemos para las pestañas internas)
  const [tabFacturacion, setTabFacturacion] = useState("pendientes")

  // Ya no necesitamos openModal ni closeModal

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
        <div className="p-6 border-b border-blue-700">
          <h1 className="text-xl font-bold">Hospital Admin</h1>
        </div>

        {/* --- BARRA DE NAVEGACIÓN ACTUALIZADA --- */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {/* Botón "Inicio" (NUEVO) */}
          <button
            onClick={() => setActiveSection("inicio")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "inicio" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Inicio</span>
          </button>
          
          <button
            onClick={() => setActiveSection("usuarios")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "usuarios" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span>Usuarios</span>
          </button>
          
          <button
            onClick={() => setActiveSection("medicos")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "medicos" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>Médicos</span>
          </button>
          
          <button
            onClick={() => setActiveSection("enfermeros")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "enfermeros" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span>Enfermeros</span>
          </button>
          
          <button
            onClick={() => setActiveSection("pacientes")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "pacientes" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span>Pacientes</span>
          </button>
          
          <button
            onClick={() => setActiveSection("turnos")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "turnos" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span>Turnos</span>
          </button>

          <button
            onClick={() => setActiveSection("habitaciones")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "habitaciones" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span>Habitaciones y Camas</span>
          </button>
          
          <button
            onClick={() => setActiveSection("cirugias")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "cirugias" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM12 9v6m-3-3h6" /></svg>
            <span>Cirugías</span>
          </button>
          
          <button
            onClick={() => setActiveSection("quirofanos")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "quirofanos" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <span>Quirófanos</span>
          </button>

          <button
            onClick={() => setActiveSection("inventario")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "inventario" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
            <span>Inventario</span>
          </button>

          <button
            onClick={() => setActiveSection("facturacion")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "facturacion" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            <span>Facturación</span>
          </button>
          
          <button
            onClick={() => setActiveSection("proveedores")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "proveedores" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 12v4m-2-2h4" /></svg>
            <span>Proveedores</span>
          </button>
          
          <button
            onClick={() => setActiveSection("consultas")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "consultas" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            <span>Consultas</span>
          </button>
          
          <button
            onClick={() => setActiveSection("estudios")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "estudios" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span>Estudios médicos</span>
          </button>
          
          <button
            onClick={() => setActiveSection("recetas")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "recetas" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Recetas</span>
          </button>
          
          <button
            onClick={() => setActiveSection("estadisticas")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "estadisticas" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span>Estadísticas y Logs</span>
          </button>

          <button
            onClick={() => setActiveSection("configuracion")}
            className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-blue-700 transition-colors ${
              activeSection === "configuracion" ? "bg-blue-700" : ""
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>Configuración</span>
          </button>
        </nav>

        <div className="p-4 border-t border-blue-700">
          <Link href="/" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            <span>Cerrar sesión</span>
          </Link>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL DINÁMICO --- */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">

        {/* --- SECCIÓN 1: INICIO (KPIs) --- */}
        {activeSection === "inicio" && (
          <>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Bienvenido, Lucas</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Tarjetas actualizadas para que naveguen */}
              <button
                onClick={() => setActiveSection("usuarios")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de usuarios</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">129 <span className="text-sm font-normal text-gray-600">usuarios</span></p>
                    <p className="text-sm text-gray-600">5 roles (de `rolessistema`)</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection("medicos")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Médicos registrados</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">48 <span className="text-sm font-normal text-gray-600">médicos</span></p>
                    <p className="text-sm text-gray-600">10 especialidades</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection("turnos")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Turnos programados</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">457 <span className="text-sm font-normal text-gray-600">turnos</span></p>
                    <p className="text-sm text-gray-600">15 sin asignar (de `turnos`)</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection("habitaciones")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Habitaciones y camas</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">50 <span className="text-sm font-normal text-gray-600">habitaciones</span></p>
                    <p className="text-sm text-gray-600">38 camas disponibles (de `camas`)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveSection("cirugias")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg"><svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2zM12 9v6m-3-3h6" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cirugías Programadas</h3>
                    <p className="text-2xl font-bold text-purple-600 mb-1">8 <span className="text-sm font-normal text-gray-600">para hoy</span></p>
                    <p className="text-sm text-gray-600">2 quirófanos disponibles (de `cirugias`)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveSection("inventario")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-100 rounded-lg"><svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Inventario</h3>
                    <p className="text-2xl font-bold text-teal-600 mb-1">14 <span className="text-sm font-normal text-gray-600">productos bajos de stock</span></p>
                    <p className="text-sm text-gray-600">(de `stock_lotes` y `productos`)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveSection("facturacion")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-lg"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H7a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Facturación y Pagos</h3>
                    <p className="text-2xl font-bold text-green-600 mb-1">$1,250.00 <span className="text-sm font-normal text-gray-600">pend. de cobro</span></p>
                    <p className="text-sm text-gray-600">(de `facturacion` y `pagos`)</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveSection("consultas")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultas clínicas</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">760 <span className="text-sm font-normal text-gray-600">atendidas</span></p>
                    <p className="text-sm text-gray-600">(de `consultas`)</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection("estudios")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Estudios médicos</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">18 <span className="text-sm font-normal text-gray-600">pendientes</span></p>
                    <p className="text-sm text-gray-600">(de `estudiosmedicos`)</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setActiveSection("estadisticas")}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-left border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg"><svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg></div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Estadísticas y logs</h3>
                    <p className="text-2xl font-bold text-blue-600 mb-1">75 <span className="text-sm font-normal text-gray-600">acciones hoy</span></p>
                    <p className="text-sm text-gray-600">(de `auditorias`)</p>
                  </div>
                </div>
              </button>
            </div>
          </>
        )}

        {/* --- SECCIÓN 2: GESTIÓN DE USUARIOS --- */}
        {activeSection === "usuarios" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios (de `usuarios`, `personas`, `rolessistema`)</h2>
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Nuevo Usuario</button>
                <input type="text" placeholder="Buscar usuario..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[{ id: 1, nombre: "Juan Pérez", email: "juan@hospital.com", rol: "Admin", estado: "Activo" }, { id: 2, nombre: "María García", email: "maria@hospital.com", rol: "Médico", estado: "Activo" }, { id: 3, nombre: "Carlos López", email: "carlos@hospital.com", rol: "Enfermero", estado: "Activo" }, { id: 4, nombre: "Ana Martínez", email: "ana@hospital.com", rol: "Paciente", estado: "Activo" }, { id: 5, nombre: "Luis Rodríguez", email: "luis@hospital.com", rol: "Médico", estado: "Inactivo" }].map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{usuario.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{usuario.rol}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 text-xs font-medium rounded-full ${ usuario.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>{usuario.estado}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button><button className="text-red-600 hover:text-red-800">Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SECCIÓN 3: GESTIÓN DE MÉDICOS --- */}
        {activeSection === "medicos" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Médicos (de `medicos`, `especialidades`, `disponibilidad_medicos`)</h2>
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Nuevo Médico</button>
                <input type="text" placeholder="Buscar médico..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Todas las especialidades</option><option>Cardiología</option><option>Pediatría</option><option>Neurología</option><option>Traumatología</option></select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[{ nombre: "Dr. Roberto Sánchez", especialidad: "Cardiología", pacientes: 45, disponible: true }, { nombre: "Dra. Laura Fernández", especialidad: "Pediatría", pacientes: 62, disponible: true }, { nombre: "Dr. Miguel Torres", especialidad: "Neurología", pacientes: 38, disponible: false }, { nombre: "Dra. Carmen Ruiz", especialidad: "Traumatología", pacientes: 51, disponible: true }, { nombre: "Dr. José Morales", especialidad: "Cardiología", pacientes: 42, disponible: true }, { nombre: "Dra. Patricia Díaz", especialidad: "Pediatría", pacientes: 58, disponible: false }].map((medico, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                      <div className="flex-1"><h3 className="font-semibold text-gray-900">{medico.nombre}</h3><p className="text-sm text-gray-600">{medico.especialidad}</p></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">Pacientes activos: <span className="font-semibold text-gray-900">{medico.pacientes}</span></p>
                      <p className="text-sm"><span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${ medico.disponible ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800" }`}>{medico.disponible ? "Disponible" : "No disponible"}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">Ver perfil</button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">Editar</button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">Horarios</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SECCIÓN 4: GESTIÓN DE TURNOS --- */}
        {activeSection === "turnos" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Turnos (de `turnos`, `tipos_turno`)</h2>
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Nuevo Turno</button>
                <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Todos los estados</option><option>Confirmado</option><option>Pendiente</option><option>Cancelado</option></select>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"><p className="text-yellow-800 font-medium">⚠️ 15 turnos sin asignar médico</p></div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[{ fecha: "2025-10-08", hora: "09:00", paciente: "Ana Martínez", medico: "Dr. Sánchez", especialidad: "Cardiología", estado: "Confirmado" }, { fecha: "2025-10-08", hora: "10:00", paciente: "Pedro Gómez", medico: "Sin asignar", especialidad: "Pediatría", estado: "Pendiente" }, { fecha: "2025-10-08", hora: "11:00", paciente: "Laura Silva", medico: "Dra. Fernández", especialidad: "Pediatría", estado: "Confirmado" }, { fecha: "2025-10-08", hora: "14:00", paciente: "Carlos Ruiz", medico: "Dr. Torres", especialidad: "Neurología", estado: "Confirmado" }, { fecha: "2025-10-09", hora: "09:00", paciente: "María López", medico: "Sin asignar", especialidad: "Traumatología", estado: "Pendiente" }].map((turno, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{turno.fecha}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{turno.hora}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{turno.paciente}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{turno.medico === "Sin asignar" ? <span className="text-red-600 font-medium">{turno.medico}</span> : turno.medico}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{turno.especialidad}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 text-xs font-medium rounded-full ${ turno.estado === "Confirmado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" }`}>{turno.estado}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm"><button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button><button className="text-red-600 hover:text-red-800">Cancelar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* --- SECCIÓN 5: GESTIÓN DE HABITACIONES --- */}
        {activeSection === "habitaciones" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Habitaciones y Camas (de `habitaciones`, `camas`, `internaciones`)</h2>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="text-sm text-green-600 mb-1">Camas Disponibles</p><p className="text-3xl font-bold text-green-700">38</p></div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm text-blue-600 mb-1">Camas Ocupadas</p><p className="text-3xl font-bold text-blue-700">8</p></div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4"><p className="text-sm text-orange-600 mb-1">En Mantenimiento/Limpieza</p><p className="text-3xl font-bold text-orange-700">4</p></div>
              </div>
              <div className="mb-6 flex gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Todos los pisos</option><option>Piso 1</option><option>Piso 2</option><option>Piso 3</option></select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option>Todos los tipos</option><option>Simple</option><option>Doble</option><option>UCI</option></select>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Nueva Habitación</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Habitación 101 <span className="text-sm font-normal text-gray-700">(Doble)</span></h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">Cama 101-A</p>
                      <p className="text-sm text-gray-600">Estado: <span className="font-medium text-blue-600">Ocupada</span></p>
                      <p className="text-sm text-gray-600">Paciente: Juan Pérez</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">Cama 101-B</p>
                      <p className="text-sm text-gray-600">Estado: <span className="font-medium text-green-600">Disponible</span></p>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-green-300 bg-green-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Habitación 102 <span className="text-sm font-normal text-gray-700">(Simple)</span></h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">Cama 102-A</p>
                      <p className="text-sm text-gray-600">Estado: <span className="font-medium text-green-600">Disponible</span></p>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-orange-300 bg-orange-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Habitación 201 <span className="text-sm font-normal text-gray-700">(UCI)</span></h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">Cama 201-A</p>
                      <p className="text-sm text-gray-600">Estado: <span className="font-medium text-orange-600">En Mantenimiento</span></p>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Habitación 202 <span className="text-sm font-normal text-gray-700">(Doble)</span></h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">Cama 202-A</p>
                      <p className="text-sm text-gray-600">Estado: <span className="font-medium text-blue-600">Ocupada</span></p>
                      <p className="text-sm text-gray-600">Paciente: María García</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="font-semibold text-gray-900">Cama 202-B</p>
                      <p className="text-sm text-gray-600">Estado: <span className="font-medium text-orange-600">Limpieza</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECCIÓN 6: GESTIÓN DE CIRUGÍAS --- */}
        {activeSection === "cirugias" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Cirugías y Quirófanos (de `cirugias`, `quirofanos`)</h2>
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">+ Programar Cirugía</button>
                <input type="date" className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4">Estado de Quirófanos</h3>
                  <div className="space-y-3">
                    <div className="bg-green-100 border border-green-300 p-3 rounded-lg"><h4 className="font-semibold">Quirófano 1</h4><p className="text-sm text-green-800">Estado: Disponible</p></div>
                    <div className="bg-red-100 border border-red-300 p-3 rounded-lg"><h4 className="font-semibold">Quirófano 2</h4><p className="text-sm text-red-800">Estado: Ocupado (Cirugía Apendicitis)</p></div>
                    <div className="bg-green-100 border border-green-300 p-3 rounded-lg"><h4 className="font-semibold">Quirófano 3</h4><p className="text-sm text-green-800">Estado: Disponible</p></div>
                    <div className="bg-orange-100 border border-orange-300 p-3 rounded-lg"><h4 className="font-semibold">Quirófano 4</h4><p className="text-sm text-orange-800">Estado: Limpieza</p></div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Cirugías Programadas (Hoy)</h3>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo Cirugía</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quirófano</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[{ hora: "08:00", pac: "Carlos Ruiz", tipo: "Apendicectomía", med: "Dr. Sánchez", sala: "Quirófano 2", estado: "Realizada" }, { hora: "11:00", pac: "Ana Gómez", tipo: "Cardiovascular", med: "Dr. Morales", sala: "Quirófano 2", estado: "Programada" }, { hora: "14:00", pac: "Pedro Luna", tipo: "Traumatología", med: "Dra. Ruiz", sala: "Quirófano 1", estado: "Programada" }].map((cirugia, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">{cirugia.hora}</td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">{cirugia.pac}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{cirugia.tipo}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{cirugia.med}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{cirugia.sala}</td>
                          <td className="px-4 py-4"><span className={`px-3 py-1 text-xs font-medium rounded-full ${ cirugia.estado === "Realizada" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" }`}>{cirugia.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SECCIÓN 7: GESTIÓN DE INVENTARIO --- */}
        {activeSection === "inventario" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventario (de `productos`, `stock_lotes`)</h2>
            <div className="p-6">
              <div className="mb-6 flex gap-4">
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">+ Nuevo Producto</button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Ver Órdenes de Compra</button>
                <input type="text" placeholder="Buscar producto..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Producto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Actual (Lotes)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próximo Vencimiento</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[{ id: 101, nom: "Paracetamol 500mg", tipo: "Medicamento", stock: 1200, venc: "2026-05-01" }, { id: 102, nom: "Gasas Estériles", tipo: "Insumo", stock: 50, venc: "N/A" }, { id: 103, nom: "Jeringa 5ml", tipo: "Insumo", stock: 800, venc: "2027-01-01" }, { id: 104, nom: "Amoxicilina", tipo: "Medicamento", stock: 30, venc: "2025-11-20" }, { id: 105, nom: "Bisturí Descartable", tipo: "Material Quirurgico", stock: 150, venc: "2028-01-01" }].map((prod) => (
                      <tr key={prod.id} className={`${prod.stock < 100 ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                        <td className="px-6 py-4 text-sm text-gray-900">{prod.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{prod.nom} {prod.stock < 100 && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">Stock Bajo</span>}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{prod.tipo}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{prod.stock}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{prod.venc} {prod.venc === "2025-11-20" && <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">Vence Pronto</span>}</td>
                        <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:text-blue-800 mr-3">Ver Lotes</button><button className="text-red-600 hover:text-red-800">Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- SECCIÓN 8: GESTIÓN DE FACTURACIÓN --- */}
        {activeSection === "facturacion" && (
          <div className="bg-white rounded-2xl shadow-xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Facturación (de `facturacion`, `pagos`, `prestaciones`)</h2>
            <div className="p-6">
              <div className="mb-6 flex border-b border-gray-200">
                <button onClick={() => setTabFacturacion("pendientes")} className={`px-6 py-3 font-medium ${ tabFacturacion === "pendientes" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800" }`}>
                  Facturas Pendientes
                </button>
                <button onClick={() => setTabFacturacion("precios")} className={`px-6 py-3 font-medium ${ tabFacturacion === "precios" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800" }`}>
                  Lista de Precios (Prestaciones)
                </button>
              </div>

              {tabFacturacion === "pendientes" && (
                <div>
                  <div className="mb-4 flex gap-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">+ Registrar Pago</button>
                    <input type="text" placeholder="Buscar por paciente o DNI..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Factura ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Emisión</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[{ id: 901, pac: "Ana Martínez", fecha: "2025-10-07", total: 450.00, estado: "Pendiente" }, { id: 902, pac: "Carlos Ruiz", fecha: "2025-10-07", total: 1200.00, estado: "Pagada" }, { id: 903, pac: "Laura Silva", fecha: "2025-10-08", total: 800.00, estado: "Pendiente" }].map((fact) => (
                        <tr key={fact.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">#{fact.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{fact.pac}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{fact.fecha}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">${fact.total.toFixed(2)}</td>
                          <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-medium rounded-full ${ fact.estado === "Pagada" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800" }`}>{fact.estado}</span></td>
                          <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:text-blue-800 mr-3">Ver Detalle</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tabFacturacion === "precios" && (
                <div>
                  <div className="mb-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ Nueva Prestación</button>
                  </div>
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Prestación</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[{ id: 1, desc: "Consulta Clínica General", precio: 150.00 }, { id: 2, desc: "Consulta Especialista", precio: 250.00 }, { id: 3, desc: "Radiografía Simple", precio: 300.00 }, { id: 4, desc: "Análisis de Sangre Básico", precio: 200.00 }, { id: 5, desc: "Día de Internación (Hab. Simple)", precio: 1000.00 }].map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{item.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.desc}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">${item.precio.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm"><button className="text-blue-600 hover:text-blue-800 mr-3">Editar</button><button className="text-red-600 hover:text-red-800">Eliminar</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* --- AGREGAR EL RESTO DE SECCIONES... --- */}
        {/*
          Aquí irían las demás secciones (Enfermeros, Pacientes, Quirófanos, Proveedores, etc.)
          siguiendo el mismo patrón:
        
          {activeSection === "enfermeros" && (
            <div className="bg-white rounded-2xl shadow-xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900">Gestión de Enfermeros</h2>
              <div className="p-6">
                {...Contenido del CRUD de enfermeros...}
              </div>
            </div>
          )}
        */}

      </main>

      {/* --- SECCIÓN DE MODALES ELIMINADA --- */}
      {/* Ya no hay modales, el contenido está en el <main> */}

    </div>
  )
}