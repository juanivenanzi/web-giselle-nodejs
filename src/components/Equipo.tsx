"use client";

import { useEffect } from "react";

export default function Equipo() {
  const miembros = [
    {
      nombre: "Nombre Apellido",
      rol: "Cargo o rol",
      descripcion: "Breve descripción de su rol o trayectoria.",
    },
    {
      nombre: "Nombre Apellido",
      rol: "Cargo o rol",
      descripcion: "Breve descripción de su rol o trayectoria.",
    },
    {
      nombre: "Nombre Apellido",
      rol: "Cargo o rol",
      descripcion: "Breve descripción de su rol o trayectoria.",
    },
    {
      nombre: "Nombre Apellido",
      rol: "Cargo o rol",
      descripcion: "Breve descripción de su rol o trayectoria.",
    },
  ];

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
      className="py-25 px-8 t-modo"
      id="equipo"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-primario) 7%, var(--color-fondo))",
      }}
    >
      <div className="max-w-300 mx-auto">
        <div className="reveal text-center mb-14">
          <div className="reveal pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3">
            Equipo
          </div>
          <h2 className="font-head text-(--color-texto) text-4xl lg:text-5xl font-semibold">
            Quiénes trabajan conmigo
          </h2>
          <p
            className="reveal reveal-delay-1 leading-relaxed mb-3.5 font-medium mt-3"
            style={{
              color: "color-mix(in srgb, var(--color-texto) 85%, transparent)",
            }}
          >
            Profesionales comprometidos con Santo Tomé.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {miembros.map((m, i) => (
            <div
              key={i}
              className={`reveal text-center group ${i === 1 ? "reveal-delay-1" : i === 2 ? "reveal-delay-2" : i === 3 ? "reveal-delay-3" : ""}`}
            >
              <div
                className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-[3px] foto-equipo t-modo transition-all duration-300 group-hover:shadow-[0_6px_0_0_var(--color-destacado)]"
                style={{ borderColor: "var(--color-borde)" }}
              >
                <div className="w-full h-full flex items-center justify-center bg-(--color-fondo-alt) text-(--color-texto-sec) text-4xl font-head">
                  {m.nombre
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              </div>
              <h3 className="font-head text-(--color-texto) text-lg font-semibold mb-0.5">
                {m.nombre}
              </h3>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: "var(--color-destacado)" }}
              >
                {m.rol}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color:
                    "color-mix(in srgb, var(--color-texto-sec) 90%, transparent)",
                }}
              >
                {m.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
