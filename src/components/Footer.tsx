"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Footer() {
  const [tema, setTema] = useState("claro");
  const [modo, setModo] = useState("institucional");

  useEffect(() => {
    // Obtener tema guardado
    const temaGuardado = localStorage.getItem("gm-tema") || "claro";
    setTema(temaGuardado);

    // Obtener modo guardado
    const modoGuardado = localStorage.getItem("gm-modo") || "institucional";
    setModo(modoGuardado);

    // Observar cambios en el tema
    const observerTema = new MutationObserver(() => {
      const nuevoTema =
        document.documentElement.getAttribute("data-tema") || "claro";
      setTema(nuevoTema);
    });
    observerTema.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-tema"],
    });

    // Observar cambios en el modo
    const observerModo = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || "institucional";
      setModo(nuevoModo);
    });
    observerModo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-modo"],
    });

    return () => {
      observerTema.disconnect();
      observerModo.disconnect();
    };
  }, []);

  // Determinar la imagen según modo y tema
  const getLogoPath = () => {
    if (modo === "campania") {
      // Modo campaña: siempre león (independiente del tema)
      return "/images/leon-amarillo.png";
    } else {
      // Modo institucional: sol (independiente del tema)
      return "/images/sol-amarillo.png";
    }
  };

  return (
    <footer className="footer">
      <div className="max-w-300 mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
        <p className="text-white/60 text-[11px] leading-snug text-center md:text-left">
          © 2026 Giselle Miravete. Todos los derechos reservados.
          <br className="hidden md:block" />
          Santo Tomé, Santa Fe, Argentina.
        </p>
        <div className="h-12 md:h-14 flex items-center overflow-hidden">
          <Image
            src={getLogoPath()}
            alt={modo === "campania" ? "León - Campaña" : "Sol - Institucional"}
            width={56}
            height={56}
            className="h-14 md:h-15 object-contain opacity-60 md:opacity-70 -my-2 md:-my-4"
          />
        </div>
      </div>
    </footer>
  );
}
