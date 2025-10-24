import Image from "next/image"

const innovations = [
  {
    title: "Inteligencia Artificial en Diagnóstico",
    description:
      "Implementamos sistemas de IA avanzados que asisten a nuestros médicos en el diagnóstico temprano de enfermedades. Estos sistemas analizan imágenes médicas, historiales clínicos y datos de laboratorio para detectar patrones que podrían pasar desapercibidos.",
    image: "/ai-medical-diagnosis-system.jpg",
    features: [
      "Detección temprana de cáncer con 98% de precisión",
      "Análisis predictivo de enfermedades cardiovasculares",
      "Interpretación automática de radiografías y resonancias",
      "Reducción del tiempo de diagnóstico en un 60%",
    ],
  },
  {
    title: "Cirugía Robótica de Precisión",
    description:
      "Nuestro sistema de cirugía robótica Da Vinci Xi permite realizar procedimientos mínimamente invasivos con una precisión milimétrica. Los cirujanos controlan brazos robóticos con movimientos 10 veces más precisos que la mano humana.",
    image: "/robotic-surgery-system.jpg",
    features: [
      "Incisiones más pequeñas y recuperación más rápida",
      "Visión 3D de alta definición para el cirujano",
      "Reducción del sangrado y dolor postoperatorio",
      "Menor riesgo de complicaciones quirúrgicas",
    ],
  },
  {
    title: "Telemedicina y Consultas Virtuales",
    description:
      "Plataforma de telemedicina de última generación que permite consultas médicas remotas con la misma calidad que una visita presencial. Incluye monitoreo en tiempo real de signos vitales y prescripción electrónica.",
    image: "/telemedicine-virtual-consultation.jpg",
    features: [
      "Consultas 24/7 desde cualquier dispositivo",
      "Integración con dispositivos wearables",
      "Historial médico electrónico unificado",
      "Recetas digitales enviadas directamente a farmacias",
    ],
  },
  {
    title: "Realidad Virtual para Rehabilitación",
    description:
      "Utilizamos tecnología de realidad virtual inmersiva para terapias de rehabilitación física y cognitiva. Los pacientes realizan ejercicios en entornos virtuales gamificados que aceleran su recuperación.",
    image: "/virtual-reality-rehabilitation.jpg",
    features: [
      "Terapias personalizadas según el progreso del paciente",
      "Reducción del dolor percibido durante ejercicios",
      "Motivación aumentada con elementos de juego",
      "Seguimiento preciso de movimientos y mejoras",
    ],
  },
  {
    title: "Blockchain para Historiales Médicos",
    description:
      "Sistema de gestión de historiales médicos basado en blockchain que garantiza la seguridad, privacidad y accesibilidad de los datos de los pacientes. Los registros son inmutables y están disponibles instantáneamente.",
    image: "/blockchain-medical-records.jpg",
    features: [
      "Seguridad máxima con encriptación de nivel militar",
      "Acceso instantáneo desde cualquier centro médico",
      "Control total del paciente sobre sus datos",
      "Prevención de fraudes y errores médicos",
    ],
  },
  {
    title: "Impresión 3D de Órganos y Prótesis",
    description:
      "Laboratorio de bioimpresión 3D que crea modelos anatómicos personalizados, prótesis a medida y tejidos biocompatibles. Esta tecnología revoluciona la planificación quirúrgica y los trasplantes.",
    image: "/3d-printing-organs-prosthetics.jpg",
    features: [
      "Prótesis personalizadas en 48 horas",
      "Modelos anatómicos para planificación quirúrgica",
      "Investigación en bioimpresión de tejidos",
      "Reducción de costos en dispositivos médicos",
    ],
  },
  {
    title: "Nanotecnología en Tratamientos",
    description:
      "Aplicamos nanotecnología médica para tratamientos dirigidos de cáncer y otras enfermedades. Nanopartículas inteligentes entregan medicamentos directamente a las células afectadas, minimizando efectos secundarios.",
    image: "/nanotechnology-medical-treatment.jpg",
    features: [
      "Tratamientos oncológicos más efectivos",
      "Reducción drástica de efectos secundarios",
      "Detección temprana de biomarcadores",
      "Terapias personalizadas a nivel molecular",
    ],
  },
  {
    title: "Internet de las Cosas Médico (IoMT)",
    description:
      "Red integrada de dispositivos médicos conectados que monitorean constantemente la salud de los pacientes. Desde camas inteligentes hasta monitores portátiles, todo está interconectado para una atención proactiva.",
    image: "/iot-medical-devices-network.jpg",
    features: [
      "Monitoreo continuo de signos vitales",
      "Alertas automáticas al personal médico",
      "Optimización del flujo de pacientes",
      "Predicción de emergencias antes de que ocurran",
    ],
  },
]

export default function InnovationsShowcase() {
  return (
    <div className="space-y-24">
      {innovations.map((innovation, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}
        >
          <div className="flex-1">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={innovation.image || "/placeholder.svg"}
                alt={innovation.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                Innovación #{index + 1}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{innovation.title}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{innovation.description}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">Beneficios Clave:</h3>
              <ul className="space-y-2">
                {innovation.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-6 h-6 text-primary flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
