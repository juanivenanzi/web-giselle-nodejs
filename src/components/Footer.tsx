"use client";

import Image from "next/image";
import { useApp } from "@/context/AppContext";

export default function Footer() {
  const { modo } = useApp();

  const logoSrc =
    modo === "campania"
      ? "/images/leon-amarillo.png"
      : "/images/sol-amarillo.png";

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
            src={logoSrc}
            alt={modo === "campania" ? "León - Campaña" : "Sol - Institucional"}
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
