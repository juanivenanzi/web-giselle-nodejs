// src/components/Nav.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { MODO_ACTUAL, TIPO_MODO } from "@/config/modo";

export default function Nav() {
  const { tema, setTema } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [modoLocal, setModoLocal] = useState(MODO_ACTUAL);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const modoActual =
      document.documentElement.getAttribute("data-modo") || MODO_ACTUAL;
    setModoLocal(modoActual);

    const observer = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || MODO_ACTUAL;
      setModoLocal(nuevoModo);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-modo"],
    });

    return () => observer.disconnect();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const handleScroll = () => {
      if (tema === "oscuro") {
        setScrolled(window.scrollY > 60);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tema, isMounted]);

  const toggleTema = () => {
    const nuevo = tema === "claro" ? "oscuro" : "claro";
    setTema(nuevo);
  };

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  // Determinar si mostrar Propuestas (comparación segura)
  const mostrarPropuestas = modoLocal === TIPO_MODO.CAMPANIA;

  // ✅ Lista única de opciones: institucional = 5, campaña = 6
  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/#sobre-mi", label: "Sobre Mí" },
    { href: "/proyectos", label: "Proyectos" },
    ...(mostrarPropuestas
      ? [{ href: "/propuestas", label: "Propuestas" }]
      : []),
    { href: "/mapa", label: "Mapa" },
    { href: "/#contacto", label: "Contacto" },
  ];

  if (!isMounted) {
    return (
      <nav className="nav-container">
        <div className="flex items-center gap-2 h-9 w-auto">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-8 w-0.75 bg-current opacity-60"></div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`nav-container ${scrolled ? "scrolled" : ""}`}
        style={{
          backgroundColor: "var(--color-fondo)",
          backdropFilter: "blur(16px)",
          borderBottom: "3px solid var(--color-destacado)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 h-9 w-auto transition-colors duration-50"
          aria-label="Inicio"
        >
          <Image
            src={
              tema === "oscuro"
                ? "/images/aguila-blanca.png"
                : "/images/aguila-negra.png"
            }
            alt="Giselle Miravete"
            width={40}
            height={40}
            className="h-9 w-auto"
            style={{ width: "auto", height: "36px" }}
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
            style={{ width: "auto", height: "32px" }}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}

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
            aria-expanded={mobileOpen ? "true" : "false"}
            aria-controls="mobileMenu"
          >
            <span
              className={`hamburger-line block w-6 h-0.5 transition-all duration-300 origin-center ${
                mobileOpen ? "line1" : ""
              }`}
              style={{ backgroundColor: "var(--color-texto)" }}
            ></span>
            <span
              className={`hamburger-line block w-6 h-0.5 transition-all duration-300 ${
                mobileOpen ? "line2" : ""
              }`}
              style={{ backgroundColor: "var(--color-texto)" }}
            ></span>
            <span
              className={`hamburger-line block w-6 h-0.5 transition-all duration-300 origin-center ${
                mobileOpen ? "line3" : ""
              }`}
              style={{ backgroundColor: "var(--color-texto)" }}
            ></span>
          </button>
        </div>
      </nav>

      <div
        id="mobileMenu"
        className={`mobile-menu ${mobileOpen ? "open" : ""}`}
        style={
          {
            backgroundColor: "var(--color-fondo)",
            borderBottom: "1px solid var(--color-borde)",
            // ✅ Le pasamos la cantidad real de opciones al CSS,
            // así el alto/tamaño se puede calcular con esta variable
            // en vez de un max-height fijo.
            "--nav-items": navLinks.length,
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col items-center py-4 gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}