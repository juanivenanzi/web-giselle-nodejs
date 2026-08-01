// src/context/AppContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { MODO_ACTUAL } from "@/config/modo";

type AppContextType = {
  modo: string;
  setModo: (modo: string) => void;
  tema: string;
  setTema: (tema: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [modo, setModoState] = useState(MODO_ACTUAL);
  const [tema, setTemaState] = useState("claro");

  useEffect(() => {
    // ✅ El modo es fijo por configuración de build (src/config/modo.ts)
    const modoActual = MODO_ACTUAL;

    // ✅ FIX: antes esto SIEMPRE seteaba "claro", ignorando lo que el
    // usuario había elegido en una visita anterior. Ahora se respeta
    // localStorage, igual que hace Nav.tsx al alternar el tema.
    const temaGuardado = localStorage.getItem("gm-tema") || "claro";

    // Establecer en DOM
    document.documentElement.setAttribute("data-modo", modoActual);
    document.documentElement.setAttribute("data-tema", temaGuardado);

    // Guardar en localStorage (por si acaso)
    localStorage.setItem("gm-modo", modoActual);
    localStorage.setItem("gm-tema", temaGuardado);

    // Actualizar estado
    setModoState(modoActual);
    setTemaState(temaGuardado);
  }, []);

  const setModo = (nuevoModo: string) => {
    setModoState(nuevoModo);
    localStorage.setItem("gm-modo", nuevoModo);
    document.documentElement.setAttribute("data-modo", nuevoModo);
    // ✅ Recargar para asegurar que todos los componentes se actualicen
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const setTema = (nuevoTema: string) => {
    setTemaState(nuevoTema);
    localStorage.setItem("gm-tema", nuevoTema);
    document.documentElement.setAttribute("data-tema", nuevoTema);
  };

  return (
    <AppContext.Provider value={{ modo, setModo, tema, setTema }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}