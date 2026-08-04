// src/actions/voluntario.ts
"use server";

import { z } from "zod";
import { voluntarioSchema, type VoluntarioState } from "@/lib/validaciones";
import { appendRow } from "@/lib/sheets-utils";

export type { VoluntarioState };

export async function enviarVoluntario(
  prevState: VoluntarioState,
  formData: FormData,
): Promise<VoluntarioState> {
  try {
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

    // Honeypot
    if (formData.get("website")) {
      return { success: true, message: "Gracias por tu interés" };
    }

    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      telefono: formData.get("telefono")?.toString().trim() ?? "",
      mensaje: formData.get("mensaje")?.toString().trim() ?? "",
      timestamp: formData.get("timestamp")?.toString() ?? "",
    };

    let validatedData: z.infer<typeof voluntarioSchema>;
    try {
      validatedData = voluntarioSchema.parse(rawData);
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

    // Validación temporal
    const now = Date.now();
    if (rawData.timestamp) {
      const sentAt = parseInt(rawData.timestamp, 10);
      if (isNaN(sentAt)) {
        return { success: false, message: "Intento de envío inválido." };
      }
      if (sentAt > now || now - sentAt > 300000) {
        return {
          success: false,
          message: "La solicitud expiró. Recargá la página.",
        };
      }
      if (now - sentAt < 3000) {
        return {
          success: false,
          message: "Esperá unos segundos antes de enviar.",
        };
      }
    }

    const fecha = new Date().toLocaleDateString("es-AR");
    const hora = new Date().toLocaleTimeString("es-AR");
    await appendRow("Voluntarios", [
      fecha,
      hora,
      validatedData.nombre,
      validatedData.email,
      validatedData.telefono ?? "",
      validatedData.mensaje ?? "",
      "Pendiente",
    ]);

    return {
      success: true,
      message: "¡Tus datos fueron enviados correctamente!",
    };
  } catch (error) {
    console.error("Error en enviarVoluntario:", error);
    return {
      success: false,
      message: "Error al procesar el formulario. Intentá nuevamente.",
    };
  }
}
