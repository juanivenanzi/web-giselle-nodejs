// src/lib/types.ts
export interface GestionItem {
  fecha: string;
  año: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  estado: string;
  enlacePdf?: string;
}

export interface GestionMeta {
  lastUpdate: string;
  count: number;
  source: string;
  version: string;
}

export type GestionEstado =
  | "aprobada"
  | "en-tratamiento"
  | "no-aprobada"
  | "en-comision"
  | "vetada"
  | "sin-estado";

export type GestionTipo =
  | "ordenanza"
  | "declaracion"
  | "pedido-informes"
  | "notas-reclamo"
  | "proyectos-comunicacion"
  | "proyectos-resolucion"
  | "resolucion"
  | "comunicacion"
  | "sin-tipo";

// ✅ Constantes exportadas para reutilizar
export const TIPO_LABEL: Record<string, string> = {
  ordenanza: "Ordenanza",
  declaracion: "Declaración",
  "pedido-informes": "Pedido de informes",
  "notas-reclamo": "Nota de reclamo",
  "proyectos-comunicacion": "Proyecto de Comunicación",
  "proyectos-resolucion": "Proyecto de Resolución",
  resolucion: "Resolución",
  comunicacion: "Comunicación",
};

export const ESTADO_LABEL: Record<string, string> = {
  aprobada: "Aprobada",
  "en-tratamiento": "En tratamiento",
  "no-aprobada": "No aprobada",
  "en-comision": "En comisión",
  vetada: "Vetada",
};

export const ESTADO_ICONO: Record<string, string> = {
  aprobada: "fa-check",
  "en-tratamiento": "fa-clock",
  "no-aprobada": "fa-xmark",
  "en-comision": "fa-people-arrows",
  vetada: "fa-ban",
};

export const ESTADO_CLASES: Record<string, string> = {
  aprobada: "bg-green-600 text-white font-bold",
  "en-tratamiento": "bg-yellow-600 text-white font-bold",
  "no-aprobada": "bg-red-600 text-white font-bold",
  "en-comision": "bg-blue-600 text-white font-bold",
  vetada: "bg-purple-600 text-white font-bold",
};