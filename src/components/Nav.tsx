"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Nav() {
  const [tema, setTema] = useState("claro");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const temaGuardado = localStorage.getItem("gm-tema") || "claro";
    setTema(temaGuardado);
    document.documentElement.setAttribute("data-tema", temaGuardado);

    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTema = () => {
    const nuevo = tema === "claro" ? "oscuro" : "claro";
    setTema(nuevo);
    localStorage.setItem("gm-tema", nuevo);
    document.documentElement.setAttribute("data-tema", nuevo);
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-18 flex items-center justify-between px-8 t-modo ${scrolled ? "scrolled" : ""}`}
        style={{
          backgroundColor: "var(--color-nav)",
          backdropFilter: "blur(16px)",
          borderBottom:
            "1px solid color-mix(in srgb, var(--color-texto) 35%, transparent)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 h-9 w-auto transition-colors duration-50"
          aria-label="Inicio"
        >
          {/* Logo según tema */}
          <img
            src={
              tema === "oscuro"
                ? "/images/aguila-blanca.png"
                : "/images/aguila-negro.png"
            }
            alt=""
            aria-hidden="true"
            className="h-12 w-auto"
          />
          <div className="h-8 w-0.75 bg-current opacity-60"></div>
          <img
            src={
              tema === "oscuro"
                ? "/images/texto_blanco.png"
                : "/images/texto_negro.png"
            }
            alt=""
            aria-hidden="true"
            className="h-8 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium t-modo transition-colors"
            style={{ color: "var(--color-texto)" }}
          >
            Inicio
          </Link>
          <Link
            href="/#sobre-mi"
            className="text-sm font-medium t-modo transition-colors"
            style={{ color: "var(--color-texto)" }}
          >
            Sobre Mí
          </Link>
          <Link
            href="/proyectos"
            className="text-sm font-medium t-modo transition-colors"
            style={{ color: "var(--color-texto)" }}
          >
            Proyectos
          </Link>
          <Link
            href="/mapa"
            className="text-sm font-medium t-modo transition-colors"
            style={{ color: "var(--color-texto)" }}
          >
            Mapa
          </Link>
          <Link
            href="/#contacto"
            className="text-sm font-medium t-modo transition-colors"
            style={{ color: "var(--color-texto)" }}
          >
            Contacto
          </Link>
          {/* Botón de tema con sol/luna y hover */}
          <button
            onClick={toggleTema}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_0_3px_var(--color-destacado)]"
            aria-label="Cambiar tema claro/oscuro"
            style={{ color: "var(--color-texto)" }}
          >
            <i
              className={`fas ${tema === "oscuro" ? "fa-sun" : "fa-moon"} text-sm`}
            ></i>
          </button>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTema}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-[0_0_0_3px_var(--color-destacado)]"
            aria-label="Cambiar tema claro/oscuro"
            style={{ color: "var(--color-texto)" }}
          >
            <i
              className={`fas ${tema === "oscuro" ? "fa-sun" : "fa-moon"} text-sm`}
            ></i>
          </button>
          <button
            onClick={toggleMobile}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Abrir menú"
            aria-expanded="false"
            aria-controls="mobileMenu"
          >
            <span
              className={`hamburger-line block w-6 h-0.5 transition-all duration-300 origin-center ${mobileOpen ? "line1" : ""}`}
              style={{ backgroundColor: "var(--color-texto)" }}
            ></span>
            <span
              className={`hamburger-line block w-6 h-0.5 transition-all duration-300 ${mobileOpen ? "line2" : ""}`}
              style={{ backgroundColor: "var(--color-texto)" }}
            ></span>
            <span
              className={`hamburger-line block w-6 h-0.5 transition-all duration-300 origin-center ${mobileOpen ? "line3" : ""}`}
              style={{ backgroundColor: "var(--color-texto)" }}
            ></span>
          </button>
        </div>
      </nav>
      <div
        className={`fixed top-18 left-0 right-0 z-40 overflow-hidden transition-all duration-300 ease-in-out shadow-lg ${mobileOpen ? "max-h-100" : "max-h-0"}`}
        style={{
          backgroundColor: "var(--color-fondo)",
          borderBottom: "1px solid var(--color-borde)",
        }}
      >
        <div className="flex flex-col items-center py-4 gap-1">
          <Link
            href="/"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            style={{ color: "var(--color-texto)" }}
            onClick={toggleMobile}
          >
            Inicio
          </Link>
          <Link
            href="/#sobre-mi"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            style={{ color: "var(--color-texto)" }}
            onClick={toggleMobile}
          >
            Sobre Mí
          </Link>
          <Link
            href="/proyectos"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            style={{ color: "var(--color-texto)" }}
            onClick={toggleMobile}
          >
            Proyectos
          </Link>
          <Link
            href="/mapa"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            style={{ color: "var(--color-texto)" }}
            onClick={toggleMobile}
          >
            Mapa
          </Link>
          <Link
            href="/#contacto"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            style={{ color: "var(--color-texto)" }}
            onClick={toggleMobile}
          >
            Contacto
          </Link>
        </div>
      </div>
    </>
  );
}
