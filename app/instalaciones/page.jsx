export default function InstalacionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Nuestras Instalaciones</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contamos con instalaciones de última generación diseñadas para brindar el mejor cuidado y comodidad a
              nuestros pacientes
            </p>
          </div>
          
          {/* Contenido de instalaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/modern-hospital-lobby-with-natural-light.jpg" 
                alt="Lobby del Hospital" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Lobby Principal</h3>
                <p className="text-muted-foreground">
                  Amplio lobby con luz natural y espacios cómodos para la espera de pacientes y familiares.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/modern-operating-room-with-surgical-equipment.jpg" 
                alt="Quirófano Moderno" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Quirófanos</h3>
                <p className="text-muted-foreground">
                  Quirófanos equipados con la más avanzada tecnología quirúrgica y sistemas de esterilización.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/modern-intensive-care-unit-with-monitoring-equipment.jpg" 
                alt="Unidad de Cuidados Intensivos" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">UCI</h3>
                <p className="text-muted-foreground">
                  Unidad de Cuidados Intensivos con monitoreo continuo y equipos de soporte vital.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/modern-emergency-room-with-medical-staff.jpg" 
                alt="Sala de Emergencias" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Emergencias</h3>
                <p className="text-muted-foreground">
                  Sala de emergencias preparada para atender casos críticos las 24 horas del día.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/modern-clinical-laboratory-with-advanced-equipment.jpg" 
                alt="Laboratorio Clínico" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Laboratorio</h3>
                <p className="text-muted-foreground">
                  Laboratorio clínico con equipos de última generación para análisis precisos y rápidos.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/modern-radiology-room-with-mri-machine.jpg" 
                alt="Sala de Radiología" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Radiología</h3>
                <p className="text-muted-foreground">
                  Departamento de radiología con equipos de resonancia magnética y tomografía computarizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
