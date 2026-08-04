// src/components/Hero.tsx
"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Hero() {
  const { modo } = useApp();
  const esCampania = modo === "campania";

  const heroBg = esCampania
    ? "/images/hero-bg-campana.webp"
    : "/images/hero-bg-institucional.webp";

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-30 pb-28"
      id="inicio"
    >
      <div
        className="absolute inset-0 scale-105 hero-bg"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
      <div
        className="absolute inset-0 t-modo"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-primario) 88%, transparent)",
        }}
      ></div>
      <div className="relative z-10 max-w-300 mx-auto px-6 pt-36 pb-20 text-center sm:text-left">
        <h1
          className="font-head leading-[1.05] mb-2"
          style={{
            fontSize: "clamp(2.8rem, 6.5vw, 5rem)",
            color: "#ffffff",
          }}
        >
          Giselle
          <br />
          <span className="t-modo" style={{ color: "var(--color-destacado)" }}>
            Miravete
          </span>
        </h1>

        <p
          className="font-head italic mb-5"
          style={{
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            color: "#e8eaed",
          }}
          id="heroRol"
        >
          {esCampania ? "Candidata a Intendente" : "Concejal de Santo Tomé"}
        </p>

        <p
          className="max-w-140 leading-relaxed mb-9"
          style={{
            fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
            color: "#d1d5db",
          }}
          id="heroDesc"
        >
          {esCampania
            ? "Santo Tomé merece más. Juntos podemos construir la ciudad que soñamos. ¡Sumate!"
            : "Trabajando con compromiso por una comunidad más justa, segura y con oportunidades para todos los vecinos."}
        </p>

        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Link
            href={esCampania ? "/propuestas" : "/proyectos"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-lg t-modo hover:scale-105 hover:shadow-2xl transition-all"
            style={{
              backgroundColor: "#4a8db7",
              color: "#ffffff",
            }}
          >
            {esCampania ? "Mis propuestas" : "Ver mi gestión"}
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold border-2 t-modo hover:scale-105 hover:shadow-lg transition-all"
            style={{
              color: "#1a1a2e",
              borderColor: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
          >
            Contactame
          </Link>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span
          className="text-[0.65rem] tracking-widest uppercase"
          style={{ color: "#9ca3af" }}
        >
          Bajá
        </span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="text-sm animate-float"
          style={{ color: "#9ca3af" }}
        />
      </div>
    </section>
  );
}
