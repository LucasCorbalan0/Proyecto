import DoctorsGrid from "@/components/doctors-grid.jsx";
export default function MedicosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900/30 flex flex-col">
      <main className="flex-1 w-full">
        <div className="container mx-auto px-6 pt-16">
          <DoctorsGrid />
        </div>
      </main>
    </div>
  )
}
