#!/usr/bin/env node
import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const RANGE = process.env.GOOGLE_SHEETS_RANGE || "Gestion!A:G";
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

async function fetchAndProcessData() {
  console.log("📊 Iniciando fetch de datos de gestión...");

  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error("❌ Faltan variables de entorno");
    return;
  }

  try {
    const cleanPrivateKey = PRIVATE_KEY.replace(/\\n/g, "\n")
      .replace(/^"|"$/g, "")
      .trim();

    console.log("🔑 Conectando a Google Sheets...");

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL.trim(),
        private_key: cleanPrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    console.log(`📤 Leyendo datos de: ${SPREADSHEET_ID}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID.trim(),
      range: RANGE,
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {
      console.warn("⚠️ No se encontraron datos en el Excel");
      return;
    }

    console.log(`📥 Encontradas ${rows.length - 1} filas de datos`);

    const data = rows
      .slice(1)
      .filter(
        (row) => row.length > 0 && row.some((cell) => cell?.toString().trim()),
      )
      .map((row) => ({
        fecha: row[0]?.toString().trim() || "",
        año: parseInt(row[1]) || 0,
        tipo: row[2]?.toString().trim().toLowerCase() || "sin-tipo",
        titulo: row[3]?.toString().trim() || "Sin título",
        descripcion: row[4]?.toString().trim() || "",
        estado: row[5]?.toString().trim().toLowerCase() || "sin-estado",
        enlacePdf: row[6]?.toString().trim() || undefined,
      }))
      .filter((item) => item.año > 0 && item.titulo !== "Sin título")
      .sort((a, b) => b.año - a.año || b.fecha.localeCompare(a.fecha));

    const dataDir = path.join(process.cwd(), "src", "data");
    await fs.mkdir(dataDir, { recursive: true });

    const jsonPath = path.join(dataDir, "gestion.json");
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    console.log(`✅ ${data.length} proyectos guardados en ${jsonPath}`);

    const metaPath = path.join(dataDir, "gestion-meta.json");
    await fs.writeFile(
      metaPath,
      JSON.stringify(
        {
          lastUpdate: new Date().toISOString(),
          count: data.length,
          source: SPREADSHEET_ID,
          version: "1.0.0",
        },
        null,
        2,
      ),
    );
    console.log(`✅ Metadata guardada en ${metaPath}`);
    console.log(`📊 Total de proyectos: ${data.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
    if (error instanceof Error) {
      console.error("Detalles:", error.message);
    }
  }
}

fetchAndProcessData();
