"use client";

import { useEffect, useState } from "react";
import { propuestas } from "@/data/propuestas";

export default function PropuestasPage() {
  const [modo, setModo] = useState("institucional");

  useEffect(() => {
    const modoGuardado = localStorage.getItem("gm-modo") || "institucional";
    setModo(modoGuardado);

    const observer = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || "institucional";
      setModo(nuevoModo);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-modo"],
    });
    return () => observer.disconnect();
  }, []);

  // ✅ Si no está en modo campaña, mostrar mensaje
  if (modo !== "campania") {
    return (
      <section
        className="pt-36 pb-25 px-4 sm:px-8"
        style={{ backgroundColor: "var(--color-fondo)" }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1
            className="font-head text-4xl lg:text-5xl font-semibold"
            style={{ color: "var(--color-texto)" }}
          >
            Propuestas
          </h1>
          <p
            className="mt-4 text-lg"
            style={{ color: "var(--color-texto-sec)" }}
          >
            Esta sección solo está disponible en modo campaña.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="pt-36 pb-25 px-4 sm:px-8"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            Propuestas
          </div>
          <h1
            className="font-head text-4xl lg:text-5xl font-semibold"
            style={{ color: "var(--color-texto)" }}
          >
            Nuestras propuestas para Santo Tomé
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: "var(--color-texto-sec)" }}
          >
            Conocé nuestras propuestas organizadas por pilares.
          </p>
        </div>

        <div className="space-y-12">
          {["transparencia", "libertad", "territorio", "orden"].map((pilar) => {
            const propuestasPilar = propuestas.filter(
              (p) => p.pilar === pilar
            );
            if (propuestasPilar.length === 0) return null;
            return (
              <div key={pilar}>
                <h2
                  className="font-head text-2xl lg:text-3xl font-semibold mb-4 capitalize"
                  style={{ color: "var(--color-texto)" }}
                >
                  {pilar}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propuestasPilar.map((propuesta, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border"
                      style={{
                        backgroundColor: "var(--color-fondo-alt)",
                        borderColor: "var(--color-borde)",
                      }}
                    >
                      <img
                        src={propuesta.imagen}
                        alt={propuesta.titulo}
                        className="w-full h-48 object-cover rounded-lg mb-3"
                      />
                      <h3
                        className="font-head text-lg font-semibold"
                        style={{ color: "var(--color-texto)" }}
                      >
                        {propuesta.titulo}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: "var(--color-texto-sec)" }}
                      >
                        {propuesta.descripcion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}