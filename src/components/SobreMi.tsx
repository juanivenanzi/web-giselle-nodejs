// src/components/SobreMi.tsx
import AnimateOnScroll from "./AnimateOnScroll";

export default function SobreMi() {
  return (
    <section
      className="py-25 px-8 relative overflow-hidden"
      id="sobre-mi"
      style={{
        background:
          "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-texto) 3%, transparent))",
      }}
    >
      <div className="max-w-300 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <AnimateOnScroll>
          <div className="relative max-w-105 mx-auto lg:mx-0">
            <img
              src="/images/sobre-mi.webp"
              alt="Giselle Miravete - Concejal Santo Tomé"
              className="w-full aspect-3/4 object-cover rounded-3xl shadow-2xl"
            />
            <div
              className="absolute -bottom-4 -right-4 w-44 h-44 rounded-3xl -z-10 t-modo"
              style={{
                border: "3px solid var(--color-destacado)",
                opacity: 0.6,
              }}
            ></div>
          </div>
        </AnimateOnScroll>

        <div className="text-center lg:text-left">
          <AnimateOnScroll>
            <div className="mb-6">
              <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3">
                Sobre Mí
              </div>
              <h2
                className="font-head text-4xl lg:text-5xl font-semibold leading-tight"
                style={{ color: "var(--color-texto)" }}
              >
                Compromiso con
                <br />
                nuestra ciudad
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="reveal-delay-1">
            <p
              className="leading-relaxed mb-3.5 font-medium"
              style={{
                color:
                  "color-mix(in srgb, var(--color-texto) 85%, transparent)",
              }}
            >
              Santotomesina por adopción hace más de 30 años, mamá de Lautaro y
              Micaela y abuela de dos hermosas nietas. Técnica en Saneamiento
              Ambiental, control bromatológico y tecnología de los alimentos;
              Postgrado en sistemas de control de calidad y auditorías.
              Profesional convencida de que la política transformadora se
              construye desde el territorio, escuchando a cada vecino.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll className="reveal-delay-2">
            <p
              className="leading-relaxed mb-3.5 font-medium"
              style={{
                color:
                  "color-mix(in srgb, var(--color-texto) 85%, transparent)",
              }}
            >
              Como concejal, mi labor se centra en legislar con responsabilidad,
              fiscalizar con transparencia y ser la voz de todos los
              Santotomesinos en el Honorable Concejo Municipal.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}