export default function About() {
  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground leading-tight">
              Más de 30 años cuidando tu salud
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Somos un hospital líder en atención médica integral, comprometidos con la excelencia y la innovación en
              cada tratamiento.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nuestro equipo de profesionales altamente capacitados trabaja con dedicación para ofrecer el mejor cuidado
              posible, utilizando tecnología de vanguardia y un enfoque centrado en el paciente.
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Médicos Especialistas</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Pacientes Atendidos</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfacción</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src="/medical-team-of-doctors-and-nurses.jpg" alt="Equipo médico" className="w-full h-[500px] object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm">Atención Continua</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
