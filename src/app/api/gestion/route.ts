import { NextResponse } from "next/server";
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const RANGE = process.env.GOOGLE_SHEETS_RANGE || "Gestion!A:G";
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY;

export async function GET() {
  try {
    if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Faltan variables de entorno" },
        { status: 500 },
      );
    }

    const cleanPrivateKey = PRIVATE_KEY.replace(/\\n/g, "\n")
      .replace(/^"|"$/g, "")
      .trim();

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL.trim(),
        private_key: cleanPrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID.trim(),
      range: RANGE,
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {
      return NextResponse.json(
        { error: "No hay datos disponibles" },
        { status: 404 },
      );
    }

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

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("❌ Error en API:", error);
    return NextResponse.json(
      { error: "Error obteniendo datos" },
      { status: 500 },
    );
  }
}
