"use client"

import { useState } from "react"
import Link from "next/link"

export default function MedicoDashboard() {
  const [activeView, setActiveView] = useState<string>("inicio")
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)

  // Mock data
  const roomStats = {
    occupied: 32,
    available: 18,
    total: 50,
  }

  const myPatients = [
    {
      id: 1,
      name: "María González",
      age: 45,
      room: "201",
      diagnosis: "Neumonía",
      admissionDate: "2025-10-01",
      status: "Estable",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      age: 62,
      room: "305",
      diagnosis: "Post-operatorio cardíaco",
      admissionDate: "2025-10-03",
      status: "Crítico",
    },
    {
      id: 3,
      name: "Ana Martínez",
      age: 38,
      room: "112",
      diagnosis: "Diabetes descompensada",
      admissionDate: "2025-10-05",
      status: "Estable",
    },
    {
      id: 4,
      name: "Jorge López",
      age: 55,
      room: "208",
      diagnosis: "Fractura de cadera",
      admissionDate: "2025-10-02",
      status: "Recuperación",
    },
    {
      id: 5,
      name: "Laura Fernández",
      age: 29,
      room: "401",
      diagnosis: "Apendicitis post-op",
      admissionDate: "2025-10-06",
      status: "Estable",
    },
  ]

  const medications = {
    toAdminister: [
      { patient: "María González", medication: "Amoxicilina 500mg", time: "14:00", room: "201" },
      { patient: "Jorge López", medication: "Tramadol 50mg", time: "15:00", room: "208" },
    ],
    delayed: [{ patient: "Carlos Rodríguez", medication: "Atorvastatina 20mg", scheduledTime: "12:00", room: "305" }],
    completed: [{ patient: "Ana Martínez", medication: "Insulina NPH", time: "08:00", room: "112" }],
  }

  const rooms = [
    { number: "201", patient: "María González", status: "Ocupada", bed: "A", floor: 2 },
    { number: "202", patient: null, status: "Disponible", bed: "A", floor: 2 },
    { number: "203", patient: null, status: "Disponible", bed: "A", floor: 2 },
    { number: "305", patient: "Carlos Rodríguez", status: "Ocupada", bed: "B", floor: 3 },
    { number: "112", patient: "Ana Martínez", status: "Ocupada", bed: "A", floor: 1 },
    { number: "208", patient: "Jorge López", status: "Ocupada", bed: "B", floor: 2 },
    { number: "401", patient: "Laura Fernández", status: "Ocupada", bed: "A", floor: 4 },
  ]

  const evolutions = [
    {
      id: 1,
      patientName: "María González",
      date: "2025-10-07",
      time: "08:30",
      note: "Paciente estable, afebril. Continúa con antibióticos.",
    },
    {
      id: 2,
      patientName: "Carlos Rodríguez",
      date: "2025-10-07",
      time: "09:15",
      note: "Evolución favorable post-cirugía. Signos vitales estables.",
    },
    {
      id: 3,
      patientName: "Ana Martínez",
      date: "2025-10-06",
      time: "16:00",
      note: "Glucemia controlada. Ajuste de dosis de insulina.",
    },
  ]

  const openPatientDetail = (patient: any) => {
    setSelectedPatient(patient)
    setActiveModal("patient-detail")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-400 to-blue-500 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold">Hospital System</h2>
          <p className="text-sm text-blue-100 mt-1">Panel Médico</p>
        </div>

        <nav className="flex-1 px-3">
          <button
            onClick={() => setActiveView("inicio")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 hover:bg-white/30 transition-colors ${
              activeView === "inicio" ? "bg-white/20 text-white" : "text-white"
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
            <span className="font-medium">Inicio</span>
          </button>

          <button
            onClick={() => setActiveView("pacientes")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 hover:bg-white/30 transition-colors ${
              activeView === "pacientes" ? "bg-white/20 text-white" : "text-white"
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
            <span className="font-medium">Pacientes</span>
          </button>

          <button
            onClick={() => setActiveModal("medicaciones")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white mb-2 hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="font-medium">Medicaciones</span>
          </button>

          <button
            onClick={() => setActiveModal("evoluciones")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white mb-2 hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="font-medium">Apoyar consultas</span>
          </button>
        </nav>

        <div className="p-3">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Cerrar sesión</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Bienvenido, Sergio</h1>

        {activeView === "inicio" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estado de habitaciones */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Estado de habitaciones</h3>
                  <div className="flex gap-4 mb-4">
                    <p className="text-gray-600">
                      <span className="font-bold text-2xl text-gray-900">{roomStats.occupied}</span> ocupadas
                    </p>
                    <p className="text-gray-600">
                      <span className="font-bold text-2xl text-blue-600">{roomStats.available}</span> disponibles
                    </p>
                  </div>
                  <Link
                    href="/dashboard/medico/habitaciones"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Gestioná habitaciones y camas
                  </Link>
                </div>
              </div>
            </div>

            {/* Mis pacientes */}
            <div
              onClick={() => setActiveView("pacientes")}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mis pacientes</h3>
                  <p className="text-gray-600">Controlá el ingreso y egreso de los pacientes internados</p>
                </div>
              </div>
            </div>

            {/* Evoluciones */}
            <div
              onClick={() => setActiveModal("evoluciones")}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Evoluciones</h3>
                  <p className="text-gray-600">Registrar la evolución clínica diaria de los pacientes</p>
                </div>
              </div>
            </div>

            {/* Medicaciones hoy */}
            <div
              onClick={() => setActiveModal("medicaciones")}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Medicaciones hoy</h3>
                    <div className="space-y-1">
                      <p className="text-gray-600">
                        <span className="font-bold text-gray-900">{medications.toAdminister.length}</span> a suministrar
                      </p>
                      <p className="text-gray-600">
                        <span className="font-bold text-red-600">{medications.delayed.length}</span> en retraso
                      </p>
                      <p className="text-gray-600">
                        <span className="font-bold text-green-600">{medications.completed.length}</span> finalizadas
                      </p>
                    </div>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeView === "pacientes" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mis pacientes card */}
            <div
              onClick={() => setActiveModal("mis-pacientes")}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mis pacientes</h3>
                  <p className="text-gray-600">Controlá el ingreso y egreso de los pacientes internados</p>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-blue-600">{myPatients.length}</p>
                    <p className="text-sm text-gray-500">Pacientes asignados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evoluciones de pacientes card */}
            <div
              onClick={() => setActiveModal("evoluciones")}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Evoluciones de pacientes</h3>
                  <p className="text-gray-600">Registrar y consultar la evolución clínica diaria</p>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-blue-600">{evolutions.length}</p>
                    <p className="text-sm text-gray-500">Evoluciones registradas hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-white/30 backdrop-blur-sm"
            onClick={() => {
              setActiveModal(null)
              setSelectedPatient(null)
            }}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {activeModal === "habitaciones" && "Gestión de Habitaciones"}
                {activeModal === "mis-pacientes" && "Mis Pacientes"}
                {activeModal === "medicaciones" && "Medicaciones"}
                {activeModal === "evoluciones" && "Evoluciones Clínicas"}
                {activeModal === "patient-detail" && `Paciente: ${selectedPatient?.name}`}
              </h2>
              <button
                onClick={() => {
                  setActiveModal(null)
                  setSelectedPatient(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Habitaciones Modal */}
              {activeModal === "habitaciones" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{roomStats.total}</p>
                      <p className="text-sm text-gray-600 mt-1">Total habitaciones</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-red-600">{roomStats.occupied}</p>
                      <p className="text-sm text-gray-600 mt-1">Ocupadas</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{roomStats.available}</p>
                      <p className="text-sm text-gray-600 mt-1">Disponibles</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {rooms.map((room) => (
                      <div
                        key={room.number}
                        className={`border-2 rounded-lg p-4 ${
                          room.status === "Ocupada" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-lg">Habitación {room.number}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              room.status === "Ocupada" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                            }`}
                          >
                            {room.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Piso {room.floor} - Cama {room.bed}
                        </p>
                        {room.patient && (
                          <p className="text-sm font-medium text-gray-900 mt-2">Paciente: {room.patient}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mis Pacientes Modal */}
              {activeModal === "mis-pacientes" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600">Total de pacientes asignados</p>
                    <p className="text-3xl font-bold text-blue-600">{myPatients.length}</p>
                  </div>

                  {myPatients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => openPatientDetail(patient)}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900">{patient.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {patient.age} años - Habitación {patient.room}
                          </p>
                          <p className="text-sm text-gray-900 font-medium mt-2">{patient.diagnosis}</p>
                          <p className="text-xs text-gray-500 mt-1">Ingreso: {patient.admissionDate}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            patient.status === "Crítico"
                              ? "bg-red-100 text-red-800"
                              : patient.status === "Estable"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Patient Detail Modal */}
              {activeModal === "patient-detail" && selectedPatient && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Edad</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.age} años</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Habitación</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.room}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Fecha de ingreso</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.admissionDate}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600">Estado</p>
                      <p className="text-lg font-bold text-gray-900">{selectedPatient.status}</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-2">Diagnóstico</h4>
                    <p className="text-gray-700">{selectedPatient.diagnosis}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Acciones</h4>
                    <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Registrar evolución
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                      Prescribir medicación
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                      Solicitar estudios
                    </button>
                    <button className="w-full bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                      Dar de alta
                    </button>
                  </div>
                </div>
              )}

              {/* Medicaciones Modal */}
              {activeModal === "medicaciones" && (
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <h4 className="font-bold text-red-900 mb-3">
                      Medicaciones en retraso ({medications.delayed.length})
                    </h4>
                    {medications.delayed.map((med, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 mb-2">
                        <p className="font-medium text-gray-900">
                          {med.patient} - Hab. {med.room}
                        </p>
                        <p className="text-sm text-gray-600">{med.medication}</p>
                        <p className="text-xs text-red-600 mt-1">Programado: {med.scheduledTime}</p>
                        <button className="mt-2 bg-red-600 text-white px-4 py-1 rounded text-sm hover:bg-red-700">
                          Administrar ahora
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                    <h4 className="font-bold text-yellow-900 mb-3">
                      Pendientes de administrar ({medications.toAdminister.length})
                    </h4>
                    {medications.toAdminister.map((med, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 mb-2">
                        <p className="font-medium text-gray-900">
                          {med.patient} - Hab. {med.room}
                        </p>
                        <p className="text-sm text-gray-600">{med.medication}</p>
                        <p className="text-xs text-gray-500 mt-1">Hora programada: {med.time}</p>
                        <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                          Marcar como administrado
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-bold text-green-900 mb-3">Completadas hoy ({medications.completed.length})</h4>
                    {medications.completed.map((med, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 mb-2">
                        <p className="font-medium text-gray-900">
                          {med.patient} - Hab. {med.room}
                        </p>
                        <p className="text-sm text-gray-600">{med.medication}</p>
                        <p className="text-xs text-green-600 mt-1">Administrado: {med.time}</p>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    + Prescribir nueva medicación
                  </button>
                </div>
              )}

              {/* Evoluciones Modal */}
              {activeModal === "evoluciones" && (
                <div className="space-y-4">
                  <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4">
                    + Registrar nueva evolución
                  </button>

                  <h4 className="font-bold text-gray-900">Evoluciones recientes</h4>
                  {evolutions.map((evolution) => (
                    <div key={evolution.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-bold text-gray-900">{evolution.patientName}</h5>
                        <span className="text-xs text-gray-500">
                          {evolution.date} - {evolution.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{evolution.note}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Editar</button>
                        <button className="text-sm text-gray-600 hover:text-gray-700 font-medium">
                          Ver historial completo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
