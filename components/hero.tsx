export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/VideoHome/a.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Overlay oscuro para mejorar la legibilidad del texto */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif font-light text-white leading-tight text-balance">
            Cuidado de salud excepcional para ti y tu familia
          </h1>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Brindamos servicios médicos de clase mundial con tecnología de vanguardia y un equipo de profesionales
            dedicados a tu bienestar.
          </p>
        </div>
      </div>
    </section>
  )
}
