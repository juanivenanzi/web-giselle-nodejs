import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Ruta al archivo JSON generado
    const jsonPath = path.join(process.cwd(), "src", "data", "gestion.json");

    // Verificar si el archivo existe
    if (!fs.existsSync(jsonPath)) {
      return NextResponse.json(
        { error: "Archivo de datos no encontrado" },
        { status: 404 },
      );
    }

    // Leer y parsear el archivo JSON
    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(jsonData);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API /gestion:", error);
    return NextResponse.json(
      { error: "Error al cargar los datos" },
      { status: 500 },
    );
  }
}
