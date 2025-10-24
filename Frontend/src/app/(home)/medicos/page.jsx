import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import DoctorsGrid from "@/components/medicos-page/doctors-grid"

export default function MedicosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <DoctorsGrid />
      </main>
      <Footer />
    </div>
  )
}
