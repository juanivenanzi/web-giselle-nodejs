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
