import Image from "next/image"

const facilities = [
  {
    title: "Sala de Espera Principal",
    description:
      "Amplia y confortable sala de espera con asientos ergonómicos, iluminación natural y sistema de entretenimiento. Diseñada para proporcionar un ambiente relajante mientras espera su consulta.",
    features: ["Capacidad para 50 personas", "WiFi gratuito", "Cafetería integrada", "Zona de juegos infantil"],
    image: "/modern-hospital-waiting-room-with-comfortable-seating.jpg",
  },
  {
    title: "Habitaciones Privadas",
    description:
      "Habitaciones individuales completamente equipadas con tecnología médica avanzada y comodidades hoteleras. Cada habitación cuenta con baño privado, televisión y espacio para acompañantes.",
    features: [
      "Camas eléctricas ajustables",
      "Baño privado con ducha",
      "Sistema de llamado de enfermería",
      "Sofá cama para acompañante",
    ],
    image: "/modern-private-hospital-room-with-medical-equipment.jpg",
  },
  {
    title: "Laboratorio Clínico",
    description:
      "Laboratorio equipado con tecnología de punta para análisis clínicos, microbiología y patología. Procesamos más de 500 pruebas diarias con resultados rápidos y precisos.",
    features: [
      "Equipos automatizados de última generación",
      "Resultados en 24-48 horas",
      "Certificación internacional",
      "Personal altamente capacitado",
    ],
    image: "/modern-clinical-laboratory-with-advanced-equipment.jpg",
  },
  {
    title: "Sala de Quirófano",
    description:
      "Quirófanos equipados con tecnología quirúrgica de última generación, sistemas de ventilación especializados y equipos de monitoreo avanzado para garantizar la seguridad del paciente.",
    features: [
      "6 quirófanos especializados",
      "Sistema de aire estéril HEPA",
      "Equipos de laparoscopía HD",
      "Monitoreo continuo de signos vitales",
    ],
    image: "/modern-operating-room-with-surgical-equipment.jpg",
  },
  {
    title: "Área de Emergencias",
    description:
      "Departamento de emergencias disponible 24/7 con personal médico especializado y equipamiento para atención inmediata. Diseñado para respuesta rápida y eficiente en situaciones críticas.",
    features: [
      "Atención 24/7",
      "10 cubículos de atención",
      "Sala de trauma equipada",
      "Ambulancias con soporte vital avanzado",
    ],
    image: "/modern-emergency-room-with-medical-staff.jpg",
  },
  {
    title: "Unidad de Cuidados Intensivos",
    description:
      "UCI equipada con tecnología de monitoreo continuo, ventiladores mecánicos de última generación y personal médico especializado disponible las 24 horas del día.",
    features: [
      "20 camas de cuidados intensivos",
      "Monitoreo continuo multiparamétrico",
      "Ventiladores mecánicos avanzados",
      "Relación enfermera-paciente 1:2",
    ],
    image: "/modern-intensive-care-unit-with-monitoring-equipment.jpg",
  },
  {
    title: "Centro de Diagnóstico por Imagen",
    description:
      "Centro equipado con resonancia magnética, tomografía computarizada, rayos X digitales y ultrasonido de alta resolución. Tecnología de imagen de última generación para diagnósticos precisos.",
    features: ["Resonancia magnética 3 Tesla", "Tomógrafo de 128 cortes", "Rayos X digitales", "Ecografía 4D"],
    image: "/modern-radiology-room-with-mri-machine.jpg",
  },
  {
    title: "Farmacia Hospitalaria",
    description:
      "Farmacia completamente surtida con medicamentos de alta calidad y personal farmacéutico disponible para consultas. Sistema automatizado de dispensación para mayor seguridad.",
    features: [
      "Más de 3,000 medicamentos disponibles",
      "Sistema de dispensación automatizado",
      "Farmacéuticos certificados",
      "Servicio de entrega a habitaciones",
    ],
    image: "/modern-hospital-pharmacy-with-medication-shelves.jpg",
  },
]

export default function FacilitiesShowcase() {
  return (
    <div className="space-y-24">
      {facilities.map((facility, index) => (
        <div
          key={index}
          className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-12 items-center`}
        >
          <div className="w-full lg:w-1/2">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image src={facility.image || "/placeholder.svg"} alt={facility.title} fill className="object-cover" />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-foreground">{facility.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{facility.description}</p>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Características principales:</h3>
              <ul className="space-y-2">
                {facility.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
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
