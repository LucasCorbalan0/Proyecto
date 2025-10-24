import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import FacilitiesShowcase from "@/components/instalaciones-page/facilities-showcase"

export default function InstalacionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Nuestras Instalaciones</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contamos con instalaciones de última generación diseñadas para brindar el mejor cuidado y comodidad a
              nuestros pacientes
            </p>
          </div>
          <FacilitiesShowcase />
        </div>
      </main>
      <Footer />
    </div>
  )
}
