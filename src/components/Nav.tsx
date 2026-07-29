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

    const handleScroll = () => {
      // Solo aplicar scroll en modo oscuro
      if (tema === "oscuro") {
        setScrolled(window.scrollY > 60);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tema]);

  const toggleTema = () => {
    const nuevo = tema === "claro" ? "oscuro" : "claro";
    setTema(nuevo);
    localStorage.setItem("gm-tema", nuevo);
    document.documentElement.setAttribute("data-tema", nuevo);
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <nav className={`nav-container ${scrolled ? "scrolled" : ""}`}>
        <Link
          href="/"
          className="flex items-center gap-2 h-9 w-auto transition-colors duration-50"
          aria-label="Inicio"
        >
          <Image
            src={
              tema === "oscuro"
                ? "/images/aguila-blanca.png"
                : "/images/aguila-negro.png"
            }
            alt=""
            width={48}
            height={48}
            className="h-12 w-auto"
            priority
          />
          <div className="h-8 w-0.75 bg-current opacity-60"></div>
          <Image
            src={
              tema === "oscuro"
                ? "/images/texto_blanco.png"
                : "/images/texto_negro.png"
            }
            alt=""
            width={120}
            height={32}
            className="h-8 w-auto"
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="nav-link">
            Inicio
          </Link>
          <Link href="/#sobre-mi" className="nav-link">
            Sobre Mí
          </Link>
          <Link href="/proyectos" className="nav-link">
            Proyectos
          </Link>
          <Link href="/mapa" className="nav-link">
            Mapa
          </Link>
          <Link href="/#contacto" className="nav-link">
            Contacto
          </Link>
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
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        style={{
          backgroundColor: "var(--color-fondo)",
          borderBottom: "1px solid var(--color-borde)",
        }}
      >
        <div className="flex flex-col items-center py-4 gap-1">
          <Link
            href="/"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Inicio
          </Link>
          <Link
            href="/#sobre-mi"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Sobre Mí
          </Link>
          <Link
            href="/proyectos"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Proyectos
          </Link>
          <Link
            href="/mapa"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Mapa
          </Link>
          <Link
            href="/#contacto"
            className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
            onClick={() => setMobileOpen(false)}
          >
            Contacto
          </Link>
        </div>
      </div>
    </>
  );
}
