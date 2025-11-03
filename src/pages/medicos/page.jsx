import DoctorsGrid from "@/components/doctors-grid.jsx";
export default function MedicosPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-6 pt-24 pb-12">
        <DoctorsGrid />
      </main>
    </div>
  )
}
