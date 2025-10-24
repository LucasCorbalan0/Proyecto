"use client"

import Link from "next/link"
import { useState } from "react"

export default function HabitacionesPage() {
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const roomStats = {
    occupied: 32,
    available: 18,
    maintenance: 4,
    total: 54,
  }

  const rooms = [
    { number: "101", patient: "Pedro Sánchez", status: "Ocupada", bed: "A", floor: 1, doctor: "Dr. Sergio" },
    { number: "102", patient: null, status: "Disponible", bed: "A", floor: 1, doctor: null },
    { number: "103", patient: null, status: "Mantenimiento", bed: "A", floor: 1, doctor: null },
    { number: "104", patient: "Lucía Ramírez", status: "Ocupada", bed: "B", floor: 1, doctor: "Dr. Sergio" },
    { number: "201", patient: "María González", status: "Ocupada", bed: "A", floor: 2, doctor: "Dr. Sergio" },
    { number: "202", patient: null, status: "Disponible", bed: "A", floor: 2, doctor: null },
    { number: "203", patient: null, status: "Disponible", bed: "A", floor: 2, doctor: null },
    { number: "204", patient: "Roberto Díaz", status: "Ocupada", bed: "B", floor: 2, doctor: "Dra. Martínez" },
    { number: "205", patient: null, status: "Disponible", bed: "B", floor: 2, doctor: null },
    { number: "206", patient: null, status: "Mantenimiento", bed: "A", floor: 2, doctor: null },
    { number: "207", patient: "Carmen Torres", status: "Ocupada", bed: "A", floor: 2, doctor: "Dr. Sergio" },
    { number: "208", patient: "Jorge López", status: "Ocupada", bed: "B", floor: 2, doctor: "Dr. Sergio" },
    { number: "301", patient: "Fernando Ruiz", status: "Ocupada", bed: "A", floor: 3, doctor: "Dra. Martínez" },
    { number: "302", patient: null, status: "Disponible", bed: "A", floor: 3, doctor: null },
    { number: "303", patient: null, status: "Disponible", bed: "B", floor: 3, doctor: null },
    { number: "304", patient: null, status: "Mantenimiento", bed: "A", floor: 3, doctor: null },
    { number: "305", patient: "Carlos Rodríguez", status: "Ocupada", bed: "B", floor: 3, doctor: "Dr. Sergio" },
    { number: "306", patient: "Isabel Moreno", status: "Ocupada", bed: "A", floor: 3, doctor: "Dra. Martínez" },
    { number: "401", patient: "Laura Fernández", status: "Ocupada", bed: "A", floor: 4, doctor: "Dr. Sergio" },
    { number: "402", patient: null, status: "Disponible", bed: "A", floor: 4, doctor: null },
    { number: "403", patient: "Miguel Ángel Castro", status: "Ocupada", bed: "B", floor: 4, doctor: "Dra. Martínez" },
    { number: "404", patient: null, status: "Disponible", bed: "B", floor: 4, doctor: null },
    { number: "405", patient: null, status: "Mantenimiento", bed: "A", floor: 4, doctor: null },
  ]

  const filteredRooms = rooms.filter((room) => {
    const matchesFloor = selectedFloor === null || room.floor === selectedFloor
    const matchesSearch =
      searchTerm === "" ||
      room.number.includes(searchTerm) ||
      room.patient?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFloor && matchesSearch
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-400 to-blue-500 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold">Hospital System</h2>
          <p className="text-sm text-blue-100 mt-1">Panel Médico</p>
        </div>

        <nav className="flex-1 px-3">
          <Link
            href="/dashboard/medico"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white mb-2 hover:bg-white/20 transition-colors"
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
          </Link>

          <Link
            href="/dashboard/medico"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white mb-2 hover:bg-white/20 transition-colors"
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
          </Link>

          <Link
            href="/dashboard/medico"
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
          </Link>

          <Link
            href="/dashboard/medico"
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
          </Link>
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
        <div className="mb-6">
          <Link
            href="/dashboard/medico"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Gestión de Habitaciones</h1>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total habitaciones</p>
            <p className="text-3xl font-bold text-blue-600">{roomStats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Ocupadas</p>
            <p className="text-3xl font-bold text-red-600">{roomStats.occupied}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Disponibles</p>
            <p className="text-3xl font-bold text-green-600">{roomStats.available}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Mantenimiento</p>
            <p className="text-3xl font-bold text-yellow-600">{roomStats.maintenance}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por número de habitación o paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedFloor(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedFloor === null ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Todos
              </button>
              {[1, 2, 3, 4].map((floor) => (
                <button
                  key={floor}
                  onClick={() => setSelectedFloor(floor)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFloor === floor ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Piso {floor}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map((room) => (
            <div
              key={room.number}
              className={`border-2 rounded-xl p-5 transition-all hover:shadow-md ${
                room.status === "Ocupada"
                  ? "border-red-200 bg-red-50"
                  : room.status === "Disponible"
                    ? "border-green-200 bg-green-50"
                    : "border-yellow-200 bg-yellow-50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-xl text-gray-900">Hab. {room.number}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    room.status === "Ocupada"
                      ? "bg-red-200 text-red-800"
                      : room.status === "Disponible"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                  }`}
                >
                  {room.status}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Piso:</span> {room.floor}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Cama:</span> {room.bed}
                </p>
                {room.patient && (
                  <>
                    <p className="text-gray-900 font-medium mt-3">
                      <span className="text-gray-600 font-normal">Paciente:</span> {room.patient}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Médico:</span> {room.doctor}
                    </p>
                  </>
                )}
              </div>
              {room.status === "Disponible" && (
                <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Asignar paciente
                </button>
              )}
              {room.status === "Ocupada" && (
                <button className="w-full mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                  Ver detalles
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
