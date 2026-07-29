"use server";

import { z } from "zod";
import { google } from "googleapis";

// Esquema de validación con Zod
const voluntarioSchema = z.object({
  nombre: z.string().min(2, "Nombre muy corto").max(100, "Nombre muy largo"),
  email: z.string().email("Email inválido"),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]{7,20}$/.test(val),
      "Teléfono inválido",
    ),
  mensaje: z.string().max(500, "Mensaje muy largo").optional(),
  timestamp: z.string().optional(),
});

// Tipo inferido del esquema
type VoluntarioData = z.infer<typeof voluntarioSchema>;

export async function submitVoluntario(formData: FormData) {
  try {
    // 1. Validar honeypot (anti-spam)
    const website = formData.get("website");
    if (website) {
      // Es un bot, devolvemos éxito falso pero no procesamos
      return { success: true, message: "Gracias por tu interés" };
    }

    // 2. Extraer y validar datos
    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      telefono: formData.get("telefono")?.toString().trim() || "",
      mensaje: formData.get("mensaje")?.toString().trim() || "",
      timestamp: formData.get("timestamp")?.toString() || "",
    };

    // 3. Validar con Zod (con manejo de errores tipado)
    let validatedData: VoluntarioData;
    try {
      validatedData = voluntarioSchema.parse(rawData);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        // ✅ Corrección: usar parseError.issues en lugar de errors
        const errorMessages = parseError.issues
          .map((issue) => issue.message)
          .join(", ");
        return {
          success: false,
          error: `Datos inválidos: ${errorMessages}`,
        };
      }
      throw parseError; // Re-lanzar si no es ZodError
    }

    // 4. Verificar timestamp (anti-spam, mínimo 2 segundos)
    if (rawData.timestamp) {
      const elapsed = Date.now() - parseInt(rawData.timestamp);
      if (elapsed < 2000) {
        // Muy rápido, posible bot
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Hacer esperar
        return {
          success: false,
          error: "Por favor, esperá unos segundos antes de enviar",
        };
      }
    }

    // 5. Guardar en Google Sheets
    await saveToGoogleSheets(validatedData);

    return { success: true, message: "¡Datos guardados correctamente!" };
  } catch (error) {
    // Log para debugging (sin exponer al usuario)
    console.error("Error en submitVoluntario:", error);

    // Si es un error conocido, devolver mensaje específico
    if (error instanceof Error) {
      // No exponer detalles internos, solo mensajes genéricos
      return {
        success: false,
        error: "Error al procesar el formulario. Intentá nuevamente.",
      };
    }

    return {
      success: false,
      error: "Error inesperado. Por favor, intentá más tarde.",
    };
  }
}

// Función para guardar en Google Sheets
async function saveToGoogleSheets(data: VoluntarioData) {
  try {
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const spreadsheetId = process.env.GOOGLE_SHEETS_FORMULARIOS_ID;

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEETS_FORMULARIOS_ID no configurado");
    }

    // Obtener fecha actual para el registro
    const now = new Date();
    const fecha = now.toLocaleDateString("es-AR");
    const hora = now.toLocaleTimeString("es-AR");

    // Intentar obtener metadatos de la hoja para verificar que existe
    try {
      await sheets.spreadsheets.get({
        spreadsheetId,
        ranges: ["Voluntarios!A1"],
        includeGridData: false,
      });
    } catch (sheetError) {
      console.error("Error verificando la hoja 'Voluntarios':", sheetError);
      throw new Error("La hoja 'Voluntarios' no existe o no es accesible");
    }

    // Escribir en la hoja
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Voluntarios!A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            fecha,
            hora,
            data.nombre,
            data.email,
            data.telefono || "",
            data.mensaje || "",
          ],
        ],
      },
    });

    if (!response.data) {
      throw new Error("No se recibió respuesta de Google Sheets");
    }

    console.log("✅ Datos guardados correctamente en Google Sheets");
    return response.data;
  } catch (error) {
    console.error("Error guardando en Google Sheets:", error);
    throw new Error(
      `Error al guardar en Google Sheets: ${error instanceof Error ? error.message : "Error desconocido"}`,
    );
  }
}
