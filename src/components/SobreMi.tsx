"use client";

import { useEffect } from "react";

export default function SobreMi() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
        <div className="reveal relative max-w-105 mx-auto lg:mx-0">
          <img
            src="/images/sobre-mi.webp"
            alt="Giselle Miravete - Concejal Santo Tomé"
            className="w-full aspect-3/4 object-cover rounded-3xl shadow-2xl"
          />
          <div
            className="absolute -bottom-4 -right-4 w-44 h-44 rounded-3xl -z-10 t-modo"
            style={{ border: "3px solid var(--color-destacado)", opacity: 0.6 }}
          ></div>
        </div>
        <div className="text-center lg:text-left">
          <div className="reveal mb-6">
            {/* ✅ PILL "SOBRE MÍ" - Sin cambios */}
            <div className="reveal pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3">
              Sobre Mí
            </div>
            {/* ✅ TÍTULO - Se adapta a light/dark mode */}
            <h2
              className="font-head text-4xl lg:text-5xl font-semibold leading-tight"
              style={{ color: "var(--color-texto)" }}
            >
              Compromiso con
              <br />
              nuestra ciudad
            </h2>
          </div>

          {/* ✅ PRIMER PÁRRAFO */}
          <p
            className="reveal reveal-delay-1 leading-relaxed mb-3.5 font-medium"
            style={{
              color: "color-mix(in srgb, var(--color-texto) 85%, transparent)",
            }}
          >
            Santotomesina por adopción hace más de 30 años, mamá de Lautaro y
            Micaela y abuela de dos hermosas nietas. Técnica en Saneamiento
            Ambiental, control bromatológico y tecnología de los alimentos;
            Postgrado en sistemas de control de calidad y auditorías.
            Profesional convencida de que la política transformadora se
            construye desde el territorio, escuchando a cada vecino.
          </p>

          {/* ✅ SEGUNDO PÁRRAFO - Mismo color que el primero */}
          <p
            className="reveal reveal-delay-2 leading-relaxed mb-3.5 font-medium"
            style={{
              color: "color-mix(in srgb, var(--color-texto) 85%, transparent)",
            }}
          >
            Como concejal, mi labor se centra en legislar con responsabilidad,
            fiscalizar con transparencia y ser la voz de todos los
            Santotomesinos en el Honorable Concejo Municipal.
          </p>
        </div>
      </div>
    </section>
  );
}