import DoctorsGrid from "@/components/doctors-grid"

export default function MedicosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pt-20">
        <DoctorsGrid />
      </main>
    </div>
  )
}
