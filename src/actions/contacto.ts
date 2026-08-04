// src/actions/contacto.ts
"use server";

import { z } from "zod";
import { contactoSchema, type ContactoState } from "@/lib/validaciones";
import { appendRow } from "@/lib/sheets-utils";

export type { ContactoState };

export async function enviarContacto(
  prevState: ContactoState,
  formData: FormData,
): Promise<ContactoState> {
  try {
    // Validar entorno
    if (
      process.env.NODE_ENV === "production" &&
      !process.env.GOOGLE_SHEETS_FORMULARIOS_ID
    ) {
      console.error(
        "❌ GOOGLE_SHEETS_FORMULARIOS_ID no configurado en producción",
      );
      return {
        success: false,
        message: "Error de configuración. Contacta al administrador.",
      };
    }

    // 1. Honeypot
    if (formData.get("website")) {
      return { success: true, message: "Gracias por tu interés" };
    }

    // 2. Extraer datos
    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      telefono: formData.get("telefono")?.toString().trim() ?? "",
      asunto: formData.get("asunto")?.toString().trim() ?? "",
      mensaje: formData.get("mensaje")?.toString().trim() ?? "",
      timestamp: formData.get("timestamp")?.toString() ?? "",
    };

    // 3. Validación Zod
    let validatedData: z.infer<typeof contactoSchema>;
    try {
      validatedData = contactoSchema.parse(rawData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0]?.toString() ?? "general";
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });
        return {
          success: false,
          errors,
          message: "Por favor, corrige los campos marcados",
        };
      }
      throw err;
    }

    // 4. Verificar timestamp (anti-spam básico)
    const now = Date.now();
    if (rawData.timestamp) {
      const sentAt = parseInt(rawData.timestamp, 10);
      if (isNaN(sentAt)) {
        return { success: false, message: "Intento de envío inválido." };
      }
      // No puede ser futuro ni tener más de 5 minutos de diferencia
      if (sentAt > now || now - sentAt > 300000) {
        return {
          success: false,
          message: "La solicitud expiró. Recargá la página.",
        };
      }
      // Debe haber al menos 3 segundos desde que se generó
      if (now - sentAt < 3000) {
        return {
          success: false,
          message: "Esperá unos segundos antes de enviar.",
        };
      }
    }

    // 5. Guardar en Google Sheets
    const fecha = new Date().toLocaleDateString("es-AR");
    const hora = new Date().toLocaleTimeString("es-AR");
    await appendRow("Contactos", [
      fecha,
      hora,
      validatedData.nombre,
      validatedData.email,
      validatedData.telefono ?? "",
      validatedData.asunto,
      validatedData.mensaje,
      "Pendiente",
    ]);

    return {
      success: true,
      message: "¡Tu mensaje fue enviado correctamente!",
    };
  } catch (error) {
    console.error("Error en enviarContacto:", error);
    return {
      success: false,
      message: "Error al procesar el formulario. Intentá nuevamente.",
    };
  }
}
