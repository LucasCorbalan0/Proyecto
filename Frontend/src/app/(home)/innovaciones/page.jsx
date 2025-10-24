import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import InnovationsShowcase from "@/components/innovaciones-page/innovations-showcase"

export default function InnovacionesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Innovaciones Tecnológicas</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Descubre las últimas innovaciones y tecnologías de vanguardia que implementamos para brindar la mejor
              atención médica
            </p>
          </div>
          <InnovationsShowcase />
        </div>
      </main>
      <Footer />
    </div>
  )
}
