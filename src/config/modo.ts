// src/config/modo.ts
// 🔧 CAMBIA ESTE VALOR PARA CAMBIAR EL MODO
// Opciones: "institucional" | "campania"
export const MODO_ACTUAL = "campania";

// ✅ Funciones de utilidad (sin comparaciones problemáticas)
export const esModoCampania = (modo: string) => modo === "campania";
export const esModoInstitucional = (modo: string) => modo === "institucional";

// ✅ Constantes para usar en los componentes
export const TIPO_MODO = {
  INSTITUCIONAL: "institucional",
  CAMPANIA: "campania"
} as const;

export type TipoModo = typeof TIPO_MODO[keyof typeof TIPO_MODO];