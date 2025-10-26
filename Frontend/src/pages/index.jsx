import Header from "@/components/shared/header"
import Hero from "@/components/home/hero"
import Services from "@/components/home/services"
import About from "@/components/home/about"
import Departments from "@/components/home/departments"
import Contact from "@/components/home/contact"
import Footer from "@/components/shared/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Departments />
      <Contact />
      <Footer />
    </main>
  )
}
