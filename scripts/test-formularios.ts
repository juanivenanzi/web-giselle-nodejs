import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function testFormularios() {
  try {
    console.log("🔍 Probando conexión a Google Sheets...");

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

    console.log(`📊 Spreadsheet ID: ${spreadsheetId}`);

    // Verificar hojas
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetsList =
      metadata.data.sheets?.map((s) => s.properties?.title) || [];
    console.log("📋 Hojas disponibles:", sheetsList);

    // Verificar hoja Voluntarios
    if (sheetsList.includes("Voluntarios")) {
      console.log('✅ Hoja "Voluntarios" encontrada');

      // Probar escritura en Voluntarios
      const testData = [
        [
          new Date().toLocaleDateString("es-AR"),
          new Date().toLocaleTimeString("es-AR"),
          "Test Usuario",
          "test@example.com",
          "123456789",
          "Mensaje de prueba",
        ],
      ];

      const result = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Voluntarios!A:F",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: testData },
      });

      console.log("✅ Datos escritos en Voluntarios:", result.data);
    } else {
      console.log('❌ Hoja "Voluntarios" NO encontrada');
    }

    // Verificar hoja Contactos
    if (sheetsList.includes("Contactos")) {
      console.log('✅ Hoja "Contactos" encontrada');

      // Probar escritura en Contactos
      const testData = [
        [
          new Date().toLocaleDateString("es-AR"),
          new Date().toLocaleTimeString("es-AR"),
          "Test Contacto",
          "contacto@example.com",
          "987654321",
          "Consulta general",
          "Mensaje de prueba de contacto",
        ],
      ];

      const result = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Contactos!A:G",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: { values: testData },
      });

      console.log("✅ Datos escritos en Contactos:", result.data);
    } else {
      console.log('❌ Hoja "Contactos" NO encontrada');
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testFormularios();
