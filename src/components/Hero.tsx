"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
  const [modo, setModo] = useState("institucional");
  const [heroBg, setHeroBg] = useState("/images/hero-bg-institucional.webp");

  useEffect(() => {
    const modoGuardado = localStorage.getItem("gm-modo") || "institucional";
    setModo(modoGuardado);
    setHeroBg(
      modoGuardado === "institucional"
        ? "/images/hero-bg-institucional.webp"
        : "/images/hero-bg-campana.webp",
    );

    const observer = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || "institucional";
      setModo(nuevoModo);
      setHeroBg(
        nuevoModo === "institucional"
          ? "/images/hero-bg-institucional.webp"
          : "/images/hero-bg-campana.webp",
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-modo"],
    });
    return () => observer.disconnect();
  }, []);

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
          className="font-head text-white leading-[1.05] mb-2"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 5rem)" }}
        >
          Giselle
          <br />
          <span className="t-modo" style={{ color: "var(--color-destacado)" }}>
            Miravete
          </span>
        </h1>
        <p
          className="font-head text-white/85 italic mb-5"
          style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)" }}
          id="heroRol"
        >
          {modo === "institucional"
            ? "Concejal de Santo Tomé"
            : "Candidata a Intendente"}
        </p>
        <p
          className="text-white/80 max-w-140 leading-relaxed mb-9"
          style={{ fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}
          id="heroDesc"
        >
          {modo === "institucional"
            ? "Trabajando con compromiso por una comunidad más justa, segura y con oportunidades para todos los vecinos."
            : "Santo Tomé merece más. Juntos podemos construir la ciudad que soñamos. ¡Sumate!"}
        </p>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Link
            href="/proyectos"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white shadow-lg t-modo hover:scale-105 hover:shadow-2xl transition-all"
            style={{ backgroundColor: "var(--color-destacado-fondo)" }}
          >
            {modo === "institucional" ? "Ver mi gestión" : "Mis propuestas"}
          </Link>
          <Link
            href="#contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white border-2 border-white/60 t-modo hover:border-white/90 hover:scale-105 hover:shadow-lg transition-all"
          >
            Contactame
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/60">
        <a
          href="https://www.microsoft.com/es-es/accessible-windows/accessibility-in-windows-11-22-05-30"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/60 text-[0.65rem] tracking-widest uppercase hover:text-white/90 transition-colors inline-flex items-center justify-center gap-1.5"
        >
          <i className="fas fa-universal-access text-[0.65rem]"></i>
          ¿Te cuesta leer esto? Probá "Alto contraste" en tu sistema.
        </a>
        <span className="text-[0.65rem] tracking-widest uppercase">Bajá</span>
        <i className="fas fa-chevron-down text-sm animate-float"></i>
      </div>
    </section>
  );
}
