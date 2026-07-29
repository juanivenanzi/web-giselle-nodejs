"use server";

import { z } from "zod";
import { google } from "googleapis";

// Esquema de validación con Zod
const voluntarioSchema = z.object({
  nombre: z.string().min(2, "Nombre muy corto").max(100, "Nombre muy largo"),
  email: z.string().email("Email inválido"),
  telefono: z.string().optional().refine(
    (val) => !val || /^[\d\s\-+()]{7,20}$/.test(val),
    "Teléfono inválido"
  ),
  mensaje: z.string().max(500, "Mensaje muy largo").optional(),
  timestamp: z.string().optional(),
});

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

    // 3. Validar con Zod
    const validatedData = voluntarioSchema.parse(rawData);

    // 4. Verificar timestamp (anti-spam, mínimo 2 segundos)
    if (rawData.timestamp) {
      const elapsed = Date.now() - parseInt(rawData.timestamp);
      if (elapsed < 2000) {
        // Muy rápido, posible bot
        await new Promise(resolve => setTimeout(resolve, 1000)); // Hacer esperar
        return { success: false, error: "Por favor, esperá unos segundos" };
      }
    }

    // 5. Guardar en Google Sheets
    await saveToGoogleSheets(validatedData);

    return { success: true };
  } catch (error) {
    // Manejo específico para errores de Zod
    if (error instanceof z.ZodError) {
      // CORRECCIÓN: usar error.errors (ZodError tiene propiedad 'errors')
      const mensajes = error.errors.map((err: z.ZodIssue) => err.message).join(", ");
      return { 
        success: false, 
        error: `Datos inválidos: ${mensajes}`
      };
    }
    
    // Log para debugging (sin exponer al usuario)
    console.error("Error en submitVoluntario:", error);
    
    return { 
      success: false, 
      error: "Error al procesar el formulario. Intentá nuevamente." 
    };
  }
}

// Función para guardar en Google Sheets
async function saveToGoogleSheets(data: {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje?: string;
}) {
  // Validar que las variables de entorno existan
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_FORMULARIOS_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error("Configuración de Google Sheets incompleta");
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  
  // Obtener fecha actual para el registro
  const now = new Date();
  const fecha = now.toLocaleDateString("es-AR");
  const hora = now.toLocaleTimeString("es-AR");

  try {
    // Escribir en la hoja
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Voluntarios!A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [[
          fecha,
          hora,
          data.nombre,
          data.email,
          data.telefono || "",
          data.mensaje || ""
        ]],
      },
    });
  } catch (error) {
    console.error("Error guardando en Google Sheets:", error);
    throw new Error("No se pudo guardar en la base de datos");
  }
}