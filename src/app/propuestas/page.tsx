"use client";

import { useMemo } from "react";
import { propuestas } from "@/data/propuestas";
import { useApp } from "@/context/AppContext";
import { TIPO_MODO } from "@/config/modo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBalanceScale,
  faChainBroken,
  faMapMarkedAlt,
  faTreeCity,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

const ICONOS_PILAR: Record<string, any> = {
  transparencia: faBalanceScale,
  libertad: faChainBroken,
  territorio: faMapMarkedAlt,
  orden: faTreeCity,
};

const COLORES_PILAR = {
  transparencia: "#3b82f6",
  libertad: "#8b5cf6",
  territorio: "#22c55e",
  orden: "#f59e0b",
} as const;

const NOMBRES_PILAR = {
  transparencia: "Transparencia",
  libertad: "Libertad",
  territorio: "Territorio",
  orden: "Orden",
} as const;

export default function PropuestasPage() {
  const { modo } = useApp();
  const esCampania = modo === TIPO_MODO.CAMPANIA;

  const propuestasPorPilar = useMemo(() => {
    return {
      transparencia: propuestas.filter((p) => p.pilar === "transparencia"),
      libertad: propuestas.filter((p) => p.pilar === "libertad"),
      territorio: propuestas.filter((p) => p.pilar === "territorio"),
      orden: propuestas.filter((p) => p.pilar === "orden"),
    };
  }, []);

  if (!esCampania) {
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
      className="pt-36 pb-25 px-4 sm:px-8 t-modo"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
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
            className="mt-3 text-base max-w-2xl mx-auto"
            style={{ color: "color-mix(in srgb, var(--color-texto) 85%, transparent)" }}
          >
            Conocé nuestras propuestas organizadas por pilares.
          </p>

          {/* Total de propuestas */}
          <div className="mt-6 pt-4 border-t-2 t-modo" style={{ borderColor: "var(--color-destacado)" }}>
            <p
              className="text-sm"
              style={{ color: "color-mix(in srgb, var(--color-texto) 85%, transparent)" }}
            >
              <FontAwesomeIcon icon={faLightbulb} className="mr-2" style={{ color: "var(--color-destacado)" }} />
              Total de propuestas:{" "}
              <strong style={{ color: "var(--color-texto)" }}>
                {propuestas.length}
              </strong>
            </p>
          </div>
        </div>

        {/* Tablero Kanban */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Object.entries(propuestasPorPilar).map(([pilar, propuestasPilar]) => {
            if (propuestasPilar.length === 0) return null;

            return (
              <div
                key={pilar}
                className="rounded-2xl p-4 flex flex-col t-modo"
                style={{
                  backgroundColor: "var(--color-fondo-alt)",
                  border: "2px solid var(--color-borde)",
                }}
              >
                {/* Cabecera de la columna */}
                <div
                  className="flex items-center gap-3 mb-4 pb-3 border-b-2 t-modo"
                  style={{ borderColor: "var(--color-borde)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor:
                        COLORES_PILAR[pilar as keyof typeof COLORES_PILAR],
                    }}
                  >
                    <FontAwesomeIcon
                      icon={ICONOS_PILAR[pilar]}
                      className="text-white text-sm"
                    />
                  </div>
                  <h2
                    className="font-head text-base font-semibold capitalize flex-1"
                    style={{ color: "var(--color-texto)" }}
                  >
                    {NOMBRES_PILAR[pilar as keyof typeof NOMBRES_PILAR]}
                  </h2>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: "var(--color-destacado)",
                      color: "#0f172a",
                      minWidth: "28px",
                      textAlign: "center",
                    }}
                  >
                    {propuestasPilar.length}
                  </span>
                </div>

                {/* Lista de propuestas */}
                <div className="space-y-3 flex-1">
                  {propuestasPilar.map((propuesta, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl border t-modo transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
                      style={{
                        backgroundColor: "var(--color-tarjeta, var(--color-fondo))",
                        borderColor: "var(--color-tarjeta-borde, var(--color-borde))",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className="text-xs font-bold mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--color-destacado)" }}
                        >
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <h3
                            className="font-head text-sm font-semibold"
                            style={{ color: "var(--color-texto)" }}
                          >
                            {propuesta.titulo}
                          </h3>
                          <p
                            className="text-xs mt-1 leading-relaxed"
                            style={{ color: "var(--color-texto-sec)" }}
                          >
                            {propuesta.descripcion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer de la columna */}
                <div className="mt-3 pt-2 text-center border-t t-modo" style={{ borderColor: "var(--color-borde)" }}>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-texto-sec)" }}
                  >
                    {propuestasPilar.length} propuesta{propuestasPilar.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}