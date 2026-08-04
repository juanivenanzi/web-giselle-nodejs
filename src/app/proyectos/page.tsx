// src/app/proyectos/page.tsx
import fs from "fs";
import path from "path";
import ProyectosClient from "@/components/ProyectosClient";
import type { GestionItem } from "@/lib/types";

async function getProyectos(): Promise<GestionItem[]> {
  try {
    const jsonPath = path.join(process.cwd(), "src", "data", "gestion.json");
    if (!fs.existsSync(jsonPath)) {
      return [];
    }
    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const data: GestionItem[] = JSON.parse(jsonData);
    return data;
  } catch (error) {
    console.error("Error leyendo gestion.json:", error);
    return [];
  }
}

export default async function ProyectosPage() {
  const proyectos = await getProyectos();

  return <ProyectosClient proyectosIniciales={proyectos} />;
}