import Header from "@/components/header"
import Footer from "@/components/footer"
import DoctorsGrid from "@/components/doctors-grid"

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
