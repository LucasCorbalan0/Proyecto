export default function InnovacionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Innovaciones Tecnológicas</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Descubre las últimas innovaciones y tecnologías de vanguardia que implementamos para brindar la mejor
              atención médica
            </p>
          </div>
          
          {/* Contenido de innovaciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/ai-medical-diagnosis-system.jpg" 
                alt="Sistema de Diagnóstico con IA" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Inteligencia Artificial</h3>
                <p className="text-muted-foreground">
                  Sistemas de diagnóstico asistido por IA para mayor precisión en el análisis médico.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/robotic-surgery-system.jpg" 
                alt="Sistema de Cirugía Robótica" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Cirugía Robótica</h3>
                <p className="text-muted-foreground">
                  Tecnología robótica de última generación para cirugías mínimamente invasivas.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/telemedicine-virtual-consultation.jpg" 
                alt="Telemedicina" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Telemedicina</h3>
                <p className="text-muted-foreground">
                  Consultas virtuales y monitoreo remoto para atención médica a distancia.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/blockchain-medical-records.jpg" 
                alt="Registros Médicos Blockchain" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Blockchain Médico</h3>
                <p className="text-muted-foreground">
                  Registros médicos seguros y descentralizados utilizando tecnología blockchain.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/iot-medical-devices-network.jpg" 
                alt="Dispositivos IoT Médicos" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">IoT Médico</h3>
                <p className="text-muted-foreground">
                  Red de dispositivos médicos conectados para monitoreo continuo y análisis de datos.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/3d-printing-organs-prosthetics.jpg" 
                alt="Impresión 3D Médica" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Impresión 3D</h3>
                <p className="text-muted-foreground">
                  Impresión 3D de prótesis personalizadas y modelos anatómicos para cirugía.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/virtual-reality-rehabilitation.jpg" 
                alt="Realidad Virtual en Rehabilitación" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Realidad Virtual</h3>
                <p className="text-muted-foreground">
                  Terapias de rehabilitación inmersivas utilizando realidad virtual.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <img 
                src="/nanotechnology-medical-treatment.jpg" 
                alt="Nanotecnología Médica" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Nanotecnología</h3>
                <p className="text-muted-foreground">
                  Tratamientos médicos a nivel molecular utilizando nanotecnología avanzada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
