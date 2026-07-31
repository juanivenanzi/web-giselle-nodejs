// src/context/AppContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { MODO_ACTUAL, TIPO_MODO } from "@/config/modo";

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
    // ✅ Forzar modo y tema desde la configuración
    const modoActual = MODO_ACTUAL;
    const temaActual = "claro";
    
    // Establecer en DOM
    document.documentElement.setAttribute("data-modo", modoActual);
    document.documentElement.setAttribute("data-tema", temaActual);
    
    // Guardar en localStorage (por si acaso)
    localStorage.setItem("gm-modo", modoActual);
    localStorage.setItem("gm-tema", temaActual);
    
    // Actualizar estado
    setModoState(modoActual);
    setTemaState(temaActual);
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