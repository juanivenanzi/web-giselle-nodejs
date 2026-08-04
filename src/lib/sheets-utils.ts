// src/lib/sheets-utils.ts
import { google, sheets_v4 } from "googleapis";

/**
 * Ajusta el ancho de todas las columnas de una hoja de cálculo.
 */
export async function autoResizeColumns(
  sheets: sheets_v4.Sheets,
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
    if (sheetId == null) {
      console.warn(`No se pudo obtener el ID de la hoja ${sheetName}`);
      return;
    }

    const requests = Array.from({ length: columnCount }, (_, i) => ({
      autoResizeDimensions: {
        dimensions: {
          sheetId: sheetId,
          dimension: "COLUMNS" as const,
          startIndex: i,
          endIndex: i + 1,
        },
      },
    }));

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });

    console.log(`✅ Columnas de "${sheetName}" ajustadas automáticamente`);
  } catch (error) {
    console.error(`Error ajustando columnas de "${sheetName}":`, error);
  }
}

/**
 * Crea un cliente autenticado de Google Sheets.
 */
function getAuthClient() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );
  return new google.auth.JWT({
    email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/**
 * Escribe una fila en la hoja especificada, añadiendo comilla simple
 * a los valores para evitar inyección de fórmulas.
 */
export async function appendRow(
  sheetName: string,
  values: (string | number | undefined)[],
) {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_FORMULARIOS_ID;

  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEETS_FORMULARIOS_ID no configurado");
  }

  // Prevenir inyección de fórmulas prefijando con '
  const safeValues = values.map((val) => {
    if (typeof val === "string" && val.length > 0) {
      return `'${val}`;
    }
    return val;
  });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [safeValues],
    },
  });

  if (!response.data) {
    throw new Error("No se recibió respuesta de Google Sheets");
  }

  await autoResizeColumns(sheets, spreadsheetId, sheetName, safeValues.length);

  console.log(`✅ Datos guardados en hoja "${sheetName}":`, response.data);
  return response.data;
}
