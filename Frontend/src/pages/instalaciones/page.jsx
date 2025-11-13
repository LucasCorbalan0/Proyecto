export default function InstalacionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/30">
      <main className="flex-1">
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 drop-shadow-lg">Nuestras Instalaciones</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}>
              Contamos con instalaciones de última generación diseñadas para brindar el mejor cuidado y comodidad a
              nuestros pacientes
            </p>
          </div>
          
          {/* Contenido de instalaciones */}
          <div className="space-y-12">
            {/* Instalación 1: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/modern-hospital-lobby-with-natural-light.jpg" 
                  alt="Lobby del Hospital" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🏛️ Lobby Principal
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-slate-600 text-xl mt-1">▸</span>
                  <span>Amplio lobby con luz natural y espacios cómodos para la espera de pacientes y familiares. Contamos con áreas de recepción modernas, asientos ergonómicos, servicios de información y orientación, además de sistemas de climatización de última generación para garantizar el confort de todos nuestros visitantes.</span>
                </p>
              </div>
            </div>

            {/* Instalación 2: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🏥 Quirófanos
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-slate-600 text-xl mt-1">▸</span>
                  <span>Quirófanos equipados con la más avanzada tecnología quirúrgica y sistemas de esterilización de alta precisión. Disponemos de 8 quirófanos completamente equipados con sistemas de monitoreo intraoperatorio, iluminación quirúrgica LED, mesas de operaciones robotizadas y sistemas de anestesia computarizados. Cada sala cumple con los más altos estándares internacionales de seguridad y asepsia.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/modern-operating-room-with-surgical-equipment.jpg" 
                  alt="Quirófano Moderno" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
            </div>

            {/* Instalación 3: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/modern-intensive-care-unit-with-monitoring-equipment.jpg" 
                  alt="Unidad de Cuidados Intensivos" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🚑 UCI
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-slate-600 text-xl mt-1">▸</span>
                  <span>Unidad de Cuidados Intensivos con monitoreo continuo 24/7 y equipos de soporte vital de última generación. Contamos con 20 camas UCI equipadas con monitores cardíacos avanzados, ventiladores mecánicos de alta tecnología, sistemas de diálisis, bombas de infusión inteligentes y personal especializado en cuidados críticos disponible en todo momento para garantizar la recuperación óptima de nuestros pacientes.</span>
                </p>
              </div>
            </div>

            {/* Instalación 4: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🚨 Emergencias
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-slate-600 text-xl mt-1">▸</span>
                  <span>Sala de emergencias preparada para atender casos críticos las 24 horas del día, los 365 días del año. Contamos con equipo médico especializado, áreas de estabilización, salas de trauma, laboratorio express y servicio de tomografía inmediata. Nuestro equipo de médicos de emergencia está disponible constantemente para brindar atención rápida y efectiva ante cualquier situación de urgencia.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/modern-emergency-room-with-medical-staff.jpg" 
                  alt="Sala de Emergencias" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
            </div>

            {/* Instalación 5: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/modern-clinical-laboratory-with-advanced-equipment.jpg" 
                  alt="Laboratorio Clínico" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🧪 Laboratorio
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-slate-600 text-xl mt-1">▸</span>
                  <span>Laboratorio clínico con equipos de última generación para análisis precisos y rápidos. Realizamos más de 50 tipos diferentes de análisis clínicos, bioquímicos y microbiológicos. Contamos con analizadores automatizados, sistemas de extracción de ADN, equipos de hematología avanzados y personal técnico certificado. Los resultados están disponibles en tiempo real a través de nuestro portal online seguro.</span>
                </p>
              </div>
            </div>

            {/* Instalación 6: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🩻 Radiología
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-slate-600 text-xl mt-1">▸</span>
                  <span>Departamento de radiología con equipos de resonancia magnética 3T y tomografía computarizada multislice de última generación. Ofrecemos servicios de radiografía digital, ultrasonografía, resonancia magnética, tomografía, angiografía y procedimientos intervencionistas. Nuestros radiólogos especializados proporcionan reportes detallados en el plazo de 24 horas, con opción de informes urgentes para casos críticos.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/modern-radiology-room-with-mri-machine.jpg" 
                  alt="Sala de Radiología" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
