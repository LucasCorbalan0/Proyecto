import { useState } from "react"
import { Toaster } from 'react-hot-toast'

// Importar componentes
import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"

// Importar secciones
import { InicioContent } from "./sections/InicioContent"
import { BuscarMedicosContent } from "./sections/BuscarMedicosContent"
import { ConsultasContent } from "./sections/ConsultasContent"
import { RecetasContent } from "./sections/RecetasContent"
import { EstudiosContent } from "./sections/EstudiosContent"
import { CuentaContent } from "./sections/CuentaContent"
import { FacturacionContent } from "./sections/FacturacionContent"

export default function PacienteDashboard() {
  const [activeSection, setActiveSection] = useState("inicio")

  const renderContent = () => {
    switch (activeSection) {
      case "inicio":
        return <InicioContent />
      case "buscar-medicos":
        return <BuscarMedicosContent />
      case "historia-clinica":
        return <ConsultasContent />
      case "recetas":
        return <RecetasContent />
      case "estudios":
        return <EstudiosContent />
      case "cuenta":
        return <CuentaContent />
      case "facturacion":
        return <FacturacionContent />
      default:
        return <InicioContent />
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
