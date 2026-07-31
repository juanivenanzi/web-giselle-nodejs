// src/config/modo.ts
// 🔧 CAMBIA ESTE VALOR PARA CAMBIAR EL MODO
// Opciones: "institucional" | "campania"
export const MODO_ACTUAL = "campania";

// ✅ Constantes para usar en los componentes (sin comparaciones problemáticas)
export const TIPO_MODO = {
  INSTITUCIONAL: "institucional",
  CAMPANIA: "campania"
} as const;

export type TipoModo = typeof TIPO_MODO[keyof typeof TIPO_MODO];