"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";

export default function Nav() {
  const { tema, setTema } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [modoLocal, setModoLocal] = useState("institucional");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const modoActual =
      document.documentElement.getAttribute("data-modo") || "institucional";
    setModoLocal(modoActual);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    const observer = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || "institucional";
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
      {/* ✅ NAV CON COLOR ELEGIDO */}
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
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="nav-link">
            Inicio
          </Link>
          <Link href="/#sobre-mi" className="nav-link">
            Sobre Mí
          </Link>

          {modoLocal === "campania" ? (
            <>
              <Link href="/proyectos" className="nav-link">
                Proyectos
              </Link>
              <Link href="/propuestas" className="nav-link">
                Propuestas
              </Link>
            </>
          ) : (
            <Link href="/proyectos" className="nav-link">
              Proyectos
            </Link>
          )}

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

          {modoLocal === "campania" ? (
            <>
              <Link
                href="/proyectos"
                className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Proyectos
              </Link>
              <Link
                href="/propuestas"
                className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Propuestas
              </Link>
            </>
          ) : (
            <Link
              href="/proyectos"
              className="mobile-link w-full text-center py-3 text-sm font-medium rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Proyectos
            </Link>
          )}

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
