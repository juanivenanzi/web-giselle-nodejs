"use client";

import { useEffect } from "react";

export default function Pilares() {
  const pilares = [
    {
      icono: "fa-balance-scale",
      titulo: "Transparencia",
      descripcion:
        "Rendir cuentas, fiscalizar y garantizar que cada recurso de los santotomesinos sea utilizado con responsabilidad.",
    },
    {
      icono: "fa-chain-broken",
      titulo: "Libertad",
      descripcion:
        "La prioridad es un municipio que deje de poner trabas a quienes producen y regeneran la economía para nuestra sociedad.",
    },
    {
      icono: "fa-map-marked-alt",
      titulo: "Territorio",
      descripcion:
        "Creemos en una ciudad participativa donde el vecino es el motor para la creación de los proyectos de nuestra ciudad.",
    },
    {
      icono: "fa-tree-city",
      titulo: "Orden",
      descripcion:
        "Santo Tomé necesita planificación, desburocratización y previsibilidad.",
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
      className="py-28 px-8 t-modo"
      id="pilares"
      style={{ backgroundColor: "var(--color-primario-dark)" }}
    >
      <div className="max-w-300 mx-auto">
        <div className="reveal text-center mb-14">
          <div className="reveal pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            Valores
          </div>
          <h2 className="font-head text-white text-4xl lg:text-5xl font-semibold">
            En qué creo
          </h2>
          <p className="text-white/85 max-w-130 mx-auto mt-3">
            Los que me guían cada decisión en el Concejo Municipal.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilares.map((p, i) => (
            <div
              key={i}
              className={`pilar-card reveal text-center p-10 rounded-2xl border t-modo transition-all duration-300 hover:-translate-y-1 ${i === 1 ? "reveal-delay-1" : i === 2 ? "reveal-delay-2" : i === 3 ? "reveal-delay-3" : ""}`}
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primario-dark) 90%, white)",
                borderColor:
                  "color-mix(in srgb, var(--color-destacado) 55%, transparent)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl grid place-items-center mx-auto mb-5 text-xl text-white t-modo"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-destacado-fondo) 70%, transparent)",
                }}
              >
                <i className={`fas ${p.icono}`}></i>
              </div>
              <h3 className="font-head text-white text-lg font-semibold mb-2.5">
                {p.titulo}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                {p.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
