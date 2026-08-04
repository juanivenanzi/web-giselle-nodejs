// src/lib/validaciones.ts
import { z } from "zod";

// Patrones reutilizables
export const PATRONES = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  telefono:
    /^(?:(?:\(?(?:0?11|0?[1-9][0-9]{2})\)?[\s-]?)?(?:15)?[\s-]?[0-9]{7,8}|[0-9]{7,10})$/,
  nombre: /^[a-zA-ZáéíóúñÑüÜ\s]+$/,
  spam: [
    /http[s]?:\/\//i,
    /www\./i,
    /gana\s+dinero/i,
    /oferta\s+limitada/i,
    /click\s+aquí/i,
    /visita\s+mi\s+sitio/i,
  ],
};

// Esquema de Contacto
export const contactoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre es requerido (mínimo 2 caracteres)")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .regex(PATRONES.nombre, "El nombre solo puede contener letras y espacios"),
  email: z.string().email("Email inválido. Usá formato: nombre@dominio.com"),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || PATRONES.telefono.test(val.replace(/\s/g, "")) || val === "",
      "Teléfono inválido. Usá formato: 11 1234-5678 o similar",
    ),
  asunto: z.string().min(1, "Debes seleccionar un asunto"),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede superar los 1000 caracteres")
    .refine(
      (val) => !PATRONES.spam.some((pattern) => pattern.test(val)),
      "El mensaje contiene contenido sospechoso. Por favor, revisá tu texto.",
    ),
  timestamp: z.string().optional(),
});

export type ContactoData = z.infer<typeof contactoSchema>;
export type ContactoState = {
  errors?: Partial<Record<keyof ContactoData, string[]>>;
  message?: string;
  success?: boolean;
};

// Esquema de Voluntario
export const voluntarioSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre es requerido (mínimo 2 caracteres)")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .regex(PATRONES.nombre, "El nombre solo puede contener letras y espacios"),
  email: z.string().email("Email inválido. Usá formato: nombre@dominio.com"),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || PATRONES.telefono.test(val.replace(/\s/g, "")) || val === "",
      "Teléfono inválido. Usá formato: 11 1234-5678 o similar",
    ),
  mensaje: z
    .string()
    .max(500, "El mensaje no puede superar los 500 caracteres")
    .optional()
    .refine(
      (val) => !val || !PATRONES.spam.some((pattern) => pattern.test(val)),
      "El mensaje contiene contenido sospechoso. Por favor, revisá tu texto.",
    ),
  timestamp: z.string().optional(),
});

export type VoluntarioData = z.infer<typeof voluntarioSchema>;
export type VoluntarioState = {
  errors?: Partial<Record<keyof VoluntarioData, string[]>>;
  message?: string;
  success?: boolean;
};
