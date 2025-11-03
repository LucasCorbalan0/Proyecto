export default function Departments() {
  const departments = [
    {
      name: "Cardiología",
      image: "/cardiology-equipment.png",
      description: "Cuidado integral del corazón",
      details: {
        intro: "Centro especializado en salud cardiovascular con más de 20 años de experiencia.",
        services: [
          "Ecocardiogramas y pruebas de esfuerzo",
          "Cateterismo cardíaco y angioplastias",
          "Cirugía cardiovascular de alta complejidad",
          "Rehabilitación cardíaca personalizada",
        ],
        footer: "Equipo certificado disponible 24/7 para emergencias cardíacas.",
      },
    },
    {
      name: "Pediatría",
      image: "/pediatric-care-children-hospital.jpg",
      description: "Atención especializada para niños",
      details: {
        intro: "Cuidado médico integral desde recién nacidos hasta adolescentes de 18 años.",
        services: [
          "Control de niño sano y vacunación completa",
          "Atención de enfermedades agudas y crónicas",
          "Desarrollo infantil y nutrición pediátrica",
          "Urgencias pediátricas las 24 horas",
        ],
        footer: "Ambiente amigable diseñado especialmente para niños.",
      },
    },
    {
      name: "Neurología",
      image: "/neurology-brain-scan.png",
      description: "Tratamiento del sistema nervioso",
      details: {
        intro: "Diagnóstico y tratamiento de trastornos neurológicos con tecnología avanzada.",
        services: [
          "Resonancia magnética y tomografía cerebral",
          "Tratamiento de epilepsia y migrañas",
          "Atención de accidentes cerebrovasculares",
          "Terapia para enfermedades neurodegenerativas",
        ],
        footer: "Unidad de neurología con monitoreo continuo disponible.",
      },
    },
    {
      name: "Oncología",
      image: "/oncology-cancer-treatment.jpg",
      description: "Tratamiento avanzado del cáncer",
      details: {
        intro: "Centro oncológico integral con enfoque multidisciplinario y humanizado.",
        services: [
          "Quimioterapia y radioterapia de precisión",
          "Cirugía oncológica mínimamente invasiva",
          "Inmunoterapia y tratamientos innovadores",
          "Apoyo psicológico y cuidados paliativos",
        ],
        footer: "Acompañamiento integral durante todo el proceso de tratamiento.",
      },
    },
    {
      name: "Traumatología",
      image: "/orthopedic-surgery.jpg",
      description: "Cirugía ortopédica especializada",
      details: {
        intro: "Especialistas en lesiones musculoesqueléticas y cirugía reconstructiva.",
        services: [
          "Tratamiento de fracturas y luxaciones",
          "Reemplazo de articulaciones (cadera, rodilla)",
          "Cirugía de columna vertebral",
          "Rehabilitación física y terapia ocupacional",
        ],
        footer: "Centro de rehabilitación con equipamiento de última generación.",
      },
    },
    {
      name: "Ginecología",
      image: "/gynecology-womens-health.jpg",
      description: "Salud integral de la mujer",
      details: {
        intro: "Atención completa en todas las etapas de la vida de la mujer.",
        services: [
          "Control prenatal y parto humanizado",
          "Cirugía ginecológica laparoscópica",
          "Tratamiento de fertilidad y reproducción",
          "Menopausia y salud hormonal",
        ],
        footer: "Equipo femenino especializado en un ambiente de confianza.",
      },
    },
  ]

  return (
    <section id="departments" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground">Departamentos Especializados</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Contamos con departamentos equipados con la mejor tecnología médica
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <div key={index} className="group h-[400px] [perspective:1000px]">
              <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front of card */}
                <div className="absolute inset-0 [backface-visibility:hidden]">
                  <div className="relative h-full overflow-hidden rounded-2xl shadow-md">
                    <div className="h-full overflow-hidden">
                      <img
                        src={dept.image || "/placeholder.svg"}
                        alt={dept.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/50 to-transparent flex flex-col justify-end p-6">
                      <h3 className="text-2xl font-semibold text-background mb-2">{dept.name}</h3>
                      <p className="text-background/90 text-sm">{dept.description}</p>
                    </div>
                  </div>
                </div>

                {/* Back of card - Added more detailed and better organized text */}
                <div className="absolute inset-0 h-full w-full rounded-2xl bg-primary p-6 text-primary-foreground [transform:rotateY(180deg)] [backface-visibility:hidden] shadow-xl overflow-y-auto">
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl font-bold mb-3 border-b border-primary-foreground/20 pb-2">{dept.name}</h3>

                    <p className="text-sm leading-relaxed mb-4 opacity-95">{dept.details.intro}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2 uppercase tracking-wide">Servicios:</h4>
                      <ul className="space-y-2">
                        {dept.details.services.map((service, idx) => (
                          <li key={idx} className="text-sm flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="leading-tight">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-auto pt-4 border-t border-primary-foreground/20">
                      <p className="text-xs opacity-90 italic">{dept.details.footer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
