"use server";

import { z } from "zod";
import { google } from "googleapis";

// --- Esquema de validación mejorado ---
const voluntarioSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre es requerido (mínimo 2 caracteres)")
    .max(100, "Nombre demasiado largo")
    .regex(
      /^[a-zA-ZáéíóúñÑüÜ\s]+$/,
      "El nombre solo puede contener letras y espacios",
    ), // ✅ Validación específica
  email: z.string().email("Email inválido. Usá formato: nombre@dominio.com"),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^(?:(?:\(?(?:0?11|0?[1-9][0-9]{2})\)?[\s-]?)?(?:15)?[\s-]?[0-9]{7,8}|[0-9]{7,10})$/.test(
          val.replace(/\s/g, ""),
        ),
      "Teléfono inválido. Usá formato: 11 1234-5678 o similar",
    ),
  mensaje: z
    .string()
    .max(500, "El mensaje no puede superar los 500 caracteres")
    .optional()
    .refine(
      (val) =>
        !val ||
        !/(http[s]?:\/\/|www\.|gana\s+dinero|oferta\s+limitada|click\s+aquí|visita\s+mi\s+sitio)/i.test(
          val,
        ),
      "El mensaje contiene contenido sospechoso. Por favor, revisá tu texto.",
    ),
  timestamp: z.string().optional(),
});

// ✅ Tipo inferido del esquema (EXPORTADO)
export type VoluntarioData = z.infer<typeof voluntarioSchema>;

// --- Tipo de respuesta (EXPORTADO) ---
export type VoluntarioState = {
  errors?: Partial<Record<keyof VoluntarioData, string[]>>;
  message?: string;
  success?: boolean;
};

// --- Función para formatear columnas ---
async function autoResizeColumns(
  sheets: any,
  spreadsheetId: string,
  sheetName: string,
  columnCount: number,
) {
  try {
    const sheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges: [`${sheetName}!A1`],
      includeGridData: false,
    });

    const sheetId = sheetMetadata.data.sheets?.[0]?.properties?.sheetId;
    if (!sheetId) {
      console.warn(`No se pudo obtener el ID de la hoja ${sheetName}`);
      return;
    }

    const requests = [];
    for (let i = 0; i < columnCount; i++) {
      requests.push({
        autoResizeDimensions: {
          dimensions: {
            sheetId: sheetId,
            dimension: "COLUMNS",
            startIndex: i,
            endIndex: i + 1,
          },
        },
      });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });

    console.log(`✅ Columnas de "${sheetName}" ajustadas automáticamente`);
  } catch (error) {
    console.error(`Error ajustando columnas de "${sheetName}":`, error);
  }
}

// --- Función para guardar en Google Sheets (Voluntarios) ---
async function saveVoluntarioToSheets(data: VoluntarioData) {
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

    const now = new Date();
    const fecha = now.toLocaleDateString("es-AR");
    const hora = now.toLocaleTimeString("es-AR");

    // 1. Escribir los datos (con columna de estado)
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Voluntarios!A:G",
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
            "Pendiente", // Estado inicial
          ],
        ],
      },
    });

    if (!response.data) {
      throw new Error("No se recibió respuesta de Google Sheets");
    }

    // 2. Ajustar automáticamente el ancho de las columnas (7 columnas: A-G)
    await autoResizeColumns(sheets, spreadsheetId, "Voluntarios", 7);

    console.log(
      "✅ Datos de voluntario guardados en Google Sheets:",
      response.data,
    );
    return response.data;
  } catch (error) {
    console.error("Error guardando voluntario en Google Sheets:", error);
    throw new Error(
      `Error al guardar en Google Sheets: ${error instanceof Error ? error.message : "Error desconocido"}`,
    );
  }
}

// --- Server Action (EXPORTADA) ---
export async function enviarVoluntario(
  prevState: VoluntarioState,
  formData: FormData,
): Promise<VoluntarioState> {
  try {
    // 1. Validar honeypot (anti-spam)
    const website = formData.get("website");
    if (website) {
      return {
        success: true,
        message: "Gracias por tu interés",
      };
    }

    // 2. Extraer datos
    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      telefono: formData.get("telefono")?.toString().trim() || "",
      mensaje: formData.get("mensaje")?.toString().trim() || "",
      timestamp: formData.get("timestamp")?.toString() || "",
    };

    // 3. Validar con Zod
    let validatedData: VoluntarioData;
    try {
      validatedData = voluntarioSchema.parse(rawData);
    } catch (parseError) {
      if (parseError instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        parseError.issues.forEach((issue) => {
          const path = issue.path[0]?.toString() || "general";
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });
        return {
          success: false,
          errors,
          message: "Por favor, corrige los campos marcados",
        };
      }
      throw parseError;
    }

    // 4. Verificar timestamp (anti-spam, mínimo 3 segundos)
    if (rawData.timestamp) {
      const elapsed = Date.now() - parseInt(rawData.timestamp);
      if (elapsed < 3000) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return {
          success: false,
          message: "Por favor, espera unos segundos antes de enviar",
        };
      }
    }

    // 5. Guardar en Google Sheets
    await saveVoluntarioToSheets(validatedData);

    return {
      success: true,
      message: "¡Tus datos fueron enviados correctamente!",
    };
  } catch (error) {
    console.error("Error en enviarVoluntario:", error);

    if (error instanceof Error && error.message.includes("Google Sheets")) {
      return {
        success: false,
        message: "Error al conectar con el servidor. Intentá nuevamente.",
      };
    }

    return {
      success: false,
      message: "Error al procesar el formulario. Intentá nuevamente.",
    };
  }
}
