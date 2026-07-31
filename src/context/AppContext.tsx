"use client";

import { createContext, useContext, useState, useEffect } from "react";

type AppContextType = {
  modo: string;
  setModo: (modo: string) => void;
  tema: string;
  setTema: (tema: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [modo, setModoState] = useState("institucional");
  const [tema, setTemaState] = useState("claro");

  // Cargar estado inicial desde localStorage
  useEffect(() => {
    const modoGuardado = localStorage.getItem("gm-modo") || "institucional";
    const temaGuardado = localStorage.getItem("gm-tema") || "claro";
    setModoState(modoGuardado);
    setTemaState(temaGuardado);
    document.documentElement.setAttribute("data-modo", modoGuardado);
    document.documentElement.setAttribute("data-tema", temaGuardado);
  }, []);

  // Sincronizar cambios con el DOM y localStorage
  const setModo = (nuevoModo: string) => {
    setModoState(nuevoModo);
    localStorage.setItem("gm-modo", nuevoModo);
    document.documentElement.setAttribute("data-modo", nuevoModo);
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