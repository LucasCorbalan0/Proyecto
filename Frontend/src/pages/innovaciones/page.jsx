export default function InnovacionesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/30">
      <main className="flex-1">
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 drop-shadow-lg">
              Innovaciones Tecnológicas
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}>
              Descubre las últimas innovaciones y tecnologías de vanguardia que implementamos para brindar la mejor
              atención médica
            </p>
          </div>
          
          {/* Contenido de innovaciones */}
          <div className="space-y-12">
            {/* Innovación 1: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/ai-medical-diagnosis-system.jpg" 
                  alt="Sistema de Diagnóstico con IA" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🤖 Inteligencia Artificial
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-blue-500 text-xl mt-1">▸</span>
                  <span>Sistemas de diagnóstico asistido por IA para mayor precisión en el análisis médico. Nuestros algoritmos avanzados procesan miles de casos clínicos para proporcionar recomendaciones precisas. Implementamos machine learning de última generación para detectar anomalías que podrían pasar desapercibidas, mejorando significativamente la exactitud diagnóstica en un 95% de los casos.</span>
                </p>
              </div>
            </div>

            {/* Innovación 2: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🦾 Cirugía Robótica
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-purple-500 text-xl mt-1">▸</span>
                  <span>Tecnología robótica de última generación para cirugías mínimamente invasivas. Mayor precisión, menor tiempo de recuperación y cicatrices más pequeñas. Utilizamos sistemas robóticos da Vinci que permiten realizar procedimientos complejos a través de pequeñas incisiones, con visión 3D de alta definición y movimientos de milimétrica precisión, reduciendo el trauma quirúrgico en un 40%.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/robotic-surgery-system.jpg" 
                  alt="Sistema de Cirugía Robótica" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
            </div>

            {/* Innovación 3: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/telemedicine-virtual-consultation.jpg" 
                  alt="Telemedicina" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  📱 Telemedicina
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-green-500 text-xl mt-1">▸</span>
                  <span>Consultas virtuales y monitoreo remoto para atención médica a distancia. Acceso a especialistas desde la comodidad de tu hogar con la máxima seguridad. Nuestros especialistas realizan videoconsultas de alta definición con encriptación end-to-end, permitiendo evaluación clínica completa, prescripción digital y seguimiento continuo sin necesidad de desplazamientos.</span>
                </p>
              </div>
            </div>

            {/* Innovación 4: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🔐 Blockchain Médico
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-orange-500 text-xl mt-1">▸</span>
                  <span>Registros médicos seguros y descentralizados utilizando tecnología blockchain. Protección máxima de datos y acceso controlado a tu información clínica. Implementamos sistema blockchain inmutable que garantiza trazabilidad completa de todos los registros médicos, permitiendo que los pacientes controlen quién accede a su información y cuando.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/blockchain-medical-records.jpg" 
                  alt="Registros Médicos Blockchain" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
            </div>

            {/* Innovación 5: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/iot-medical-devices-network.jpg" 
                  alt="Dispositivos IoT Médicos" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  ⌚ IoT Médico
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-yellow-500 text-xl mt-1">▸</span>
                  <span>Red de dispositivos médicos conectados para monitoreo continuo y análisis de datos. Seguimiento en tiempo real de tu salud con dispositivos wearables. Contamos con sensores inteligentes integrados que monitorizan frecuencia cardíaca, presión arterial, saturación de oxígeno y glucosa, enviando datos en tiempo real a nuestras plataformas de análisis para alertas preventivas.</span>
                </p>
              </div>
            </div>

            {/* Innovación 6: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🖨️ Impresión 3D
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-pink-500 text-xl mt-1">▸</span>
                  <span>Impresión 3D de prótesis personalizadas y modelos anatómicos para cirugía. Diseños personalizados que se adaptan perfectamente a cada paciente. Nuestros equipos de impresión 3D crean réplicas exactas de órganos y estructuras anatómicas del paciente, permitiendo a los cirujanos planificar el procedimiento con precisión milimétrica antes de entrar al quirófano.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/3d-printing-organs-prosthetics.jpg" 
                  alt="Impresión 3D Médica" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
            </div>

            {/* Innovación 7: Imagen izquierda, texto derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="group">
                <img 
                  src="/virtual-reality-rehabilitation.jpg" 
                  alt="Realidad Virtual en Rehabilitación" 
                  className="w-full h-72 object-cover rounded-xl shadow-2xl group-hover:shadow-black/50 group-hover:shadow-2xl transition-all duration-300 border border-black/20"
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🥽 Realidad Virtual
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-indigo-500 text-xl mt-1">▸</span>
                  <span>Terapias de rehabilitación inmersivas utilizando realidad virtual. Experiencias interactivas que aceleran la recuperación y el bienestar del paciente. Los pacientes se sumergen en entornos virtuales personalizados que hacen los ejercicios de rehabilitación más motivadores, resultando en una recuperación 30% más rápida y mayor cumplimiento terapéutico.</span>
                </p>
              </div>
            </div>

            {/* Innovación 8: Texto izquierda, imagen derecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-black drop-shadow-sm">
                  🔬 Nanotecnología
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed drop-shadow-sm flex items-start gap-3">
                  <span className="text-cyan-500 text-xl mt-1">▸</span>
                  <span>Tratamientos médicos a nivel molecular utilizando nanotecnología avanzada. Medicinas dirigidas que actúan específicamente donde se necesitan. Utilizamos nanopartículas de oro y plata con fármacos específicos que pueden atravesar barreras biológicas y atacar células enfermas con precisión quirúrgica, minimizando efectos secundarios en tejidos sanos.</span>
                </p>
              </div>
              <div className="group">
                <img 
                  src="/nanotechnology-medical-treatment.jpg" 
                  alt="Nanotecnología Médica" 
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
