// src/components/Footer.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MODO_ACTUAL, TIPO_MODO } from "@/config/modo";

export default function Footer() {
  const [modo, setModo] = useState(MODO_ACTUAL);

  useEffect(() => {
    const modoActual = MODO_ACTUAL;
    setModo(modoActual);

    const observerModo = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || MODO_ACTUAL;
      setModo(nuevoModo);
    });
    observerModo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-modo"],
    });

    return () => {
      observerModo.disconnect();
    };
  }, []);

  const getLogoPath = () => {
    return modo === TIPO_MODO.CAMPANIA
      ? "/images/leon-amarillo.png"
      : "/images/sol-amarillo.png";
  };

  return (
    <footer className="footer">
      <div className="max-w-300 mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
        <p
          className="text-[11px] leading-snug text-center md:text-left"
          style={{ color: "var(--color-blanco-suave, #f8f9fa)" }}
        >
          © 2026 Giselle Miravete. Todos los derechos reservados.
          <br className="hidden md:block" />
          Santo Tomé, Santa Fe, Argentina.
        </p>
        <div className="h-12 md:h-14 flex items-center overflow-hidden">
          <Image
            src={getLogoPath()}
            alt={modo === TIPO_MODO.CAMPANIA ? "León - Campaña" : "Sol - Institucional"}
            width={56}
            height={56}
            className="h-14 md:h-15 object-contain opacity-80 md:opacity-80 -my-2 md:-my-4"
            style={{ width: "auto", height: "56px" }}
          />
        </div>
      </div>
    </footer>
  );
}