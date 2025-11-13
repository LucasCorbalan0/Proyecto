export default function DoctorsGrid() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Carlos Mendoza",
      specialty: "Cardiología",
      image: "/professional-male-cardiologist-doctor.jpg",
      description:
        "Especialista en cardiología con más de 15 años de experiencia. Graduado de la Universidad Nacional con especialización en Harvard Medical School. Experto en enfermedades cardiovasculares, arritmias y procedimientos de cateterismo cardíaco.",
      education: "Harvard Medical School",
      experience: "15 años",
    },
    {
      id: 2,
      name: "Dra. María González",
      specialty: "Pediatría",
      image: "/professional-female-pediatrician-doctor.jpg",
      description:
        "Pediatra certificada con amplia experiencia en el cuidado infantil. Especializada en desarrollo infantil, vacunación y enfermedades pediátricas comunes. Reconocida por su trato cálido y profesional con los niños y sus familias.",
      education: "Universidad de Buenos Aires",
      experience: "12 años",
    },
    {
      id: 3,
      name: "Dr. Roberto Silva",
      specialty: "Neurología",
      image: "/professional-male-neurologist-doctor.jpg",
      description:
        "Neurólogo especializado en trastornos del sistema nervioso. Experto en el diagnóstico y tratamiento de epilepsia, migrañas, esclerosis múltiple y enfermedades neurodegenerativas. Miembro activo de la Sociedad Internacional de Neurología.",
      education: "Johns Hopkins University",
      experience: "18 años",
    },
    {
      id: 4,
      name: "Dra. Ana Martínez",
      specialty: "Ginecología",
      image: "/professional-female-gynecologist-doctor.jpg",
      description:
        "Ginecóloga y obstetra con dedicación al cuidado integral de la mujer. Especializada en embarazos de alto riesgo, cirugía ginecológica mínimamente invasiva y medicina reproductiva. Comprometida con la salud femenina en todas las etapas de la vida.",
      education: "Universidad Complutense de Madrid",
      experience: "14 años",
    },
    {
      id: 5,
      name: "Dr. Luis Ramírez",
      specialty: "Traumatología",
      image: "/professional-male-orthopedic-surgeon-doctor.jpg",
      description:
        "Traumatólogo y cirujano ortopédico especializado en lesiones deportivas y cirugía reconstructiva. Experto en artroscopia, reemplazo de articulaciones y tratamiento de fracturas complejas. Médico oficial de equipos deportivos profesionales.",
      education: "Stanford University",
      experience: "16 años",
    },
    {
      id: 6,
      name: "Dra. Patricia Herrera",
      specialty: "Dermatología",
      image: "/professional-female-dermatologist-doctor.jpg",
      description:
        "Dermatóloga certificada especializada en enfermedades de la piel, tratamientos estéticos y cirugía dermatológica. Experta en el diagnóstico y tratamiento de cáncer de piel, acné, psoriasis y procedimientos láser. Pionera en técnicas de rejuvenecimiento facial.",
      education: "Universidad de Barcelona",
      experience: "11 años",
    },
    {
      id: 7,
      name: "Dr. Fernando López",
      specialty: "Oncología",
      image: "/professional-male-oncologist-doctor.jpg",
      description:
        "Oncólogo médico dedicado al tratamiento integral del cáncer. Especializado en quimioterapia, inmunoterapia y terapias dirigidas. Comprometido con la investigación clínica y el desarrollo de nuevos tratamientos oncológicos para mejorar la calidad de vida de los pacientes.",
      education: "Memorial Sloan Kettering Cancer Center",
      experience: "20 años",
    },
    {
      id: 8,
      name: "Dra. Isabel Torres",
      specialty: "Psiquiatría",
      image: "/professional-female-psychiatrist-doctor.jpg",
      description:
        "Psiquiatra especializada en salud mental y trastornos del comportamiento. Experta en el tratamiento de depresión, ansiedad, trastorno bipolar y esquizofrenia. Enfoque integral que combina psicoterapia y tratamiento farmacológico personalizado.",
      education: "Yale School of Medicine",
      experience: "13 años",
    },
    {
      id: 9,
      name: "Dr. Miguel Sánchez",
      specialty: "Neumología",
      image: "/professional-male-orthopedic-surgeon-doctor.jpg",
      description:
        "Neumólogo especializado en enfermedades del sistema respiratorio. Experto en asma, EPOC, fibrosis pulmonar y enfermedades pulmonares intersticiales. Certificado en medicina crítica y cuidados respiratorios avanzados.",
      education: "Pontificia Universidad Católica",
      experience: "17 años",
    },
  ]

  return (
    <section className="py-12 px-6 bg-transparent">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 drop-shadow-lg">Nuestro Equipo Médico</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" style={{textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'}}>
            Contamos con un equipo de profesionales altamente calificados y comprometidos con tu salud. Cada uno de
            nuestros médicos cuenta con amplia experiencia y formación internacional.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
            >
              {/* Doctor Image */}
              <div className="relative h-80 overflow-hidden bg-muted">
                <img
                  src={doctor.image || "/placeholder.svg"}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Doctor Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-1">{doctor.name}</h3>
                  <p className="text-blue-600 font-semibold text-lg">{doctor.specialty}</p>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm">{doctor.description}</p>

                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <span className="text-muted-foreground">{doctor.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                      />
                    </svg>
                    <span className="text-muted-foreground">{doctor.experience} de experiencia</span>
                  </div>
                </div>

                <button className="w-full mt-4 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Agendar Cita
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
