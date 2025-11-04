// src/components/header.jsx
"use client"

import { useState } from "react"
import { Link } from "react-router-dom";

// 1. Importamos los modales (los que no usan la carpeta 'ui')
import LoginModal from "./LoginModal.jsx";
import RegistroModal from "./RegistroModal.jsx";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // 2. Estado para controlar qué modal está abierto
  const [modalOpen, setModalOpen] = useState(null); // 'login', 'register', o null

  // 3. Funciones para controlar los modales
  const openLogin = () => setModalOpen('login');
  const closeModal = () => setModalOpen(null); // Cierra cualquier modal
  const switchToRegister = () => setModalOpen('register');
  const switchToLogin = () => setModalOpen('login');

  return (
    <> {/* Usamos un Fragment para que los modales puedan ser hermanos del header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"
                  />
                </svg>
              </div>
              <span className="text-xl font-semibold text-gray-900">MediCare Hospital</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Inicio
              </Link>
              <Link to="/medicos" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Médicos
              </Link>
              <Link
                to="/instalaciones"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Instalaciones
              </Link>
              <Link
                to="/innovaciones"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Innovaciones
              </Link>
              
              {/* 4. Botón que abre el modal de login */}
              <button
                onClick={openLogin}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Iniciar Sesión
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/medicos"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Médicos
              </Link>
              <Link
                to="/instalaciones"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Instalaciones
              </Link>
              <Link
                to="/innovaciones"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Innovaciones
              </Link>
              
              {/* 5. Botón móvil que abre el modal de login */}
              <button
                onClick={() => {
                  openLogin();
                  setIsMenuOpen(false);
                }}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors text-left"
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* --- 6. RENDERIZA LOS MODALES AQUÍ --- */}
      {/* Le pasamos "onClose" a los modales. Esta es la corrección clave.
      */}
      <LoginModal 
        open={modalOpen === 'login'}
        onClose={closeModal} 
        onSwitchToRegister={switchToRegister}
      />
      
      <RegistroModal 
        open={modalOpen === 'register'}
        onClose={closeModal} 
        onSwitchToLogin={switchToLogin}
      />
    </>
  )
}