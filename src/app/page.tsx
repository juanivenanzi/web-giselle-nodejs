// src/app/page.tsx
"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Equipo from "@/components/Equipo";
import Pilares from "@/components/Pilares";
import Voluntariado from "@/components/Voluntariado";
import Contacto from "@/components/Contacto";
import { MODO_ACTUAL } from "@/config/modo";

export default function Home() {
  useEffect(() => {
    // ✅ Forzar modo desde configuración
    document.documentElement.setAttribute("data-modo", MODO_ACTUAL);
    document.documentElement.setAttribute("data-tema", "claro");
    localStorage.setItem("gm-modo", MODO_ACTUAL);
    localStorage.setItem("gm-tema", "claro");
  }, []);

  return (
    <>
      <Hero />
      <SobreMi />
      <Equipo />
      <Pilares />
      <Voluntariado />
      <Contacto />
    </>
  );
}