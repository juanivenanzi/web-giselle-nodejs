#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Setup automático para Next.js + Tailwind CSS + TypeScript + Google Sheets API
Proyecto: Giselle Miravete - Concejal de Santo Tomé
"""

import os
import subprocess
import sys
import shutil
from pathlib import Path

# ============================================================
# CONFIGURACIÓN
# ============================================================

PROJECT_NAME = "giselle-miravete"
PROJECT_DIR = Path(__file__).parent.absolute()

# ============================================================
# FUNCIONES DE AYUDA
# ============================================================

def run_command(cmd, cwd=None):
    print(f"\n🔄 Ejecutando: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd, text=True)
    if result.returncode != 0:
        print(f"⚠️  El comando tuvo un error (código {result.returncode})")
        return False
    return True

def create_file(filepath, content):
    filepath = PROJECT_DIR / filepath
    filepath.parent.mkdir(parents=True, exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"✅ Creado: {filepath}")

def copy_env_file():
    old_env = Path("E:/giselle/web-giselle1 (2)/.env")
    new_env = PROJECT_DIR / ".env"
    if old_env.exists():
        shutil.copy2(old_env, new_env)
        print(f"✅ .env copiado desde: {old_env}")
        return True
    else:
        print(f"⚠️  No se encontró .env")
        create_file(".env", """# Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="giselle-gestion-sa@giselle-miravete-web.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1cb4H4nc5Y9LRCmrtO80tlo4iR7ocmEbMcs-s5SL7TPQ"
GOOGLE_SHEETS_RANGE="Gestion!A:G"
""")
        return False

# ============================================================
# CREACIÓN DE ARCHIVOS
# ============================================================

def create_package_json():
    create_file("package.json", """{
  "name": "giselle-miravete",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "fetch-data": "tsx scripts/fetch-gestion-data.ts",
    "update-data": "tsx scripts/update-gestion-data.ts"
  },
  "dependencies": {
    "next": "15.1.4",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "googleapis": "^173.0.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "typescript": "^5.0.0",
    "tsx": "^4.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "15.1.4"
  }
}""")

def create_tsconfig():
    create_file("tsconfig.json", """{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./src/*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}""")

def create_tailwind_config():
    create_file("tailwind.config.js", """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: {} },
  plugins: [],
}""")

def create_postcss_config():
    create_file("postcss.config.js", """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}""")

def create_next_config():
    create_file("next.config.js", """/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['picsum.photos'] },
}
module.exports = nextConfig""")

def create_gitignore():
    create_file(".gitignore", """.env
.env.local
node_modules/
.next/
.vercel/
out/
dist/
*.log
.DS_Store
Thumbs.db
""")

def create_env_example():
    create_file(".env.example", """# Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASC...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL="giselle-gestion-sa@giselle-miravete-web.iam.gserviceaccount.com"
GOOGLE_SHEETS_SPREADSHEET_ID="1cb4H4nc5Y9LRCmrtO80tlo4iR7ocmEbMcs-s5SL7TPQ"
GOOGLE_SHEETS_RANGE="Gestion!A:G"
""")

def create_global_css():
    create_file("src/app/globals.css", """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-primario: #1e3a5f;
  --color-primario-dark: #0f2744;
  --color-destacado: #74acdf;
  --color-fondo: #ffffff;
  --color-fondo-alt: #f8f9fa;
  --color-texto: #1a1a2e;
  --color-texto-sec: #374151;
  --color-borde: #cbd5e1;
}

[data-tema="oscuro"] {
  --color-fondo: #0f172a;
  --color-fondo-alt: #1e293b;
  --color-texto: #f1f5f9;
  --color-texto-sec: #cbd5e1;
  --color-borde: #475569;
}

.t-modo {
  transition: background-color 0.6s ease, color 0.6s ease, border-color 0.6s ease;
}
.font-head { font-family: "DM Serif Display", Georgia, serif; }
.font-body { font-family: "Inter", system-ui, sans-serif; }

html { scroll-behavior: smooth; }
body {
  background-color: var(--color-fondo);
  color: var(--color-texto);
  font-family: "Inter", system-ui, sans-serif;
}

.skip-link {
  position: absolute;
  top: -100%; left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background-color: var(--color-primario);
  color: #ffffff;
  z-index: 9999;
  transition: top 0.2s ease;
}
.skip-link:focus { top: 0; }

.pill-magica {
  background-color: var(--color-texto);
  color: #ffffff;
}
html[data-tema="oscuro"] .pill-magica {
  background-color: #ffffff;
  color: #000000;
}

.filtros-container {
  display: flex; flex-direction: column; gap: 0.75rem;
  margin-bottom: 1.5rem; padding: 1.5rem;
  background-color: var(--color-fondo-alt);
  border-radius: 1rem; border: 1px solid var(--color-borde);
}
.filtro-grupo {
  display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; padding: 0.25rem 0;
}
.filtro-grupo + .filtro-grupo {
  border-top: 1px solid var(--color-borde); padding-top: 0.75rem;
}
.filtro-label {
  font-family: "Inter", sans-serif; font-size: 0.8rem; font-weight: 700;
  color: var(--color-texto); min-width: 70px;
}
.filtro-opciones { display: flex; flex-wrap: wrap; gap: 0.3rem; }
.filtro-btn {
  font-family: "Inter", sans-serif; font-size: 0.75rem; font-weight: 600;
  padding: 0.3rem 0.8rem; border-radius: 9999px;
  border: 2px solid var(--color-borde);
  background-color: transparent; color: var(--color-texto-sec);
  cursor: pointer; transition: all 0.2s ease;
}
.filtro-btn:hover {
  border-color: var(--color-destacado); color: var(--color-texto);
}
.filtro-btn.active {
  border-color: var(--color-primario);
  background-color: var(--color-primario);
  color: #ffffff;
}
html[data-tema="oscuro"] .filtro-btn.active {
  border-color: var(--color-destacado);
  background-color: var(--color-destacado);
  color: #000000;
}

.contador-resultados {
  font-family: "Inter", sans-serif; font-size: 1rem; font-weight: 400;
  color: var(--color-texto-sec);
  text-align: center; padding: 0.5rem 0 1.5rem 0; margin-top: 0.25rem;
}
.contador-resultados strong { color: var(--color-texto); font-weight: 700; }

.gestion-card {
  background-color: var(--color-fondo-alt);
  border-radius: 1rem; padding: 1.5rem;
  border: 2px solid var(--color-borde);
  transition: all 0.3s ease;
  display: flex; flex-direction: column;
}
.gestion-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-destacado);
  box-shadow: 0 6px 0 0 var(--color-destacado);
}
.gestion-card .cabecera {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 0.5rem; gap: 0.5rem; flex-wrap: nowrap;
}
.gestion-card .tipo {
  font-family: "Inter", sans-serif; font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  background-color: var(--color-primario); color: #ffffff;
  padding: 0.15rem 0.6rem; border-radius: 9999px;
  white-space: nowrap; flex-shrink: 0;
}
.gestion-card .estado {
  font-family: "Inter", sans-serif; font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em;
  padding: 0.15rem 0.7rem; border-radius: 9999px;
  display: inline-flex; align-items: center; gap: 0.3rem;
  border: none !important; white-space: nowrap; flex-shrink: 0;
}
.gestion-card .fecha {
  font-family: "Inter", sans-serif; font-size: 0.85rem; font-weight: 700;
  color: var(--color-texto); margin-bottom: 0.5rem;
  display: flex; align-items: center; gap: 0.4rem;
}
.gestion-card .titulo {
  font-family: "DM Serif Display", Georgia, serif;
  font-size: 1.2rem; font-weight: 600;
  margin-bottom: 0.5rem; color: var(--color-texto);
}
.gestion-card .descripcion {
  font-family: "Inter", sans-serif; font-size: 0.9rem; font-weight: 500;
  color: var(--color-texto-sec); line-height: 1.625;
  flex: 1; min-height: 1.5rem;
}
.gestion-card .btn-expediente {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.5rem 1.2rem; border-radius: 9999px;
  background-color: var(--color-texto); color: #ffffff;
  font-family: "Inter", sans-serif; font-size: 0.8rem; font-weight: 600;
  margin-top: 1rem; border: none; cursor: pointer;
  transition: all 0.2s ease; width: fit-content;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  text-decoration: none;
}
.gestion-card .btn-expediente:hover {
  transform: scale(1.04);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.15);
}
html[data-tema="oscuro"] .gestion-card .btn-expediente {
  background-color: #ffffff; color: #000000;
}

.estado-aprobada { background-color: #16a34a !important; color: #ffffff !important; border: none !important; }
.estado-no-aprobada { background-color: #dc2626 !important; color: #ffffff !important; border: none !important; }
.estado-en-tratamiento { background-color: #ca8a04 !important; color: #ffffff !important; border: none !important; }
.estado-en-comision { background-color: #2563eb !important; color: #ffffff !important; border: none !important; }
.estado-vetada { background-color: #7c3aed !important; color: #ffffff !important; border: none !important; }

.red-social { transition: all 0.25s ease; }
.red-social:hover {
  background-color: var(--color-texto) !important;
  color: var(--color-fondo) !important;
  border-color: var(--color-texto) !important;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .grid-tarjetas { grid-template-columns: 1fr; }
  .filtros-container { padding: 0.75rem; gap: 0.5rem; }
  .filtro-grupo { flex-direction: column; align-items: stretch; gap: 0.25rem; padding: 0.4rem 0; }
  .filtro-grupo + .filtro-grupo { padding-top: 0.4rem; }
  .filtro-label { min-width: auto; font-size: 0.7rem; }
  .filtro-opciones { gap: 0.25rem; }
  .filtro-btn { font-size: 0.65rem; padding: 0.3rem 0.6rem; flex: 1 0 auto; }
  .gestion-card { padding: 1rem; }
  .gestion-card .titulo { font-size: 1rem; }
  .gestion-card .descripcion { font-size: 0.85rem; }
  .gestion-card .btn-expediente { font-size: 0.75rem; padding: 0.4rem 1rem; }
}""")

def create_layout():
    create_file("src/app/layout.tsx", """import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'La Libertad Avanza — Santo Tomé',
  description: 'Sitio oficial de Giselle Miravete, Concejal de Santo Tomé, Santa Fe.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-modo="institucional" data-tema="claro">
      <body className={`${inter.className} bg-(--color-fondo) text-(--color-texto)`}>
        <a href="#inicio" className="skip-link">Saltar al contenido</a>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}""")

def create_page():
    create_file("src/app/page.tsx", """import Hero from '@/components/Hero'
import SobreMi from '@/components/SobreMi'
import Equipo from '@/components/Equipo'
import Pilares from '@/components/Pilares'
import Voluntariado from '@/components/Voluntariado'
import Contacto from '@/components/Contacto'

export default function Home() {
  return (
    <>
      <Hero />
      <SobreMi />
      <Equipo />
      <Pilares />
      <Voluntariado />
      <Contacto />
    </>
  )
}""")

def create_proyectos_page():
    create_file("src/app/proyectos/page.tsx", """'use client'

import { useState, useEffect } from 'react'

type GestionItem = {
  fecha: string; año: number; tipo: string; titulo: string;
  descripcion: string; estado: string; enlacePdf?: string;
}

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<GestionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState({ anio: 'todos', tipo: 'todos', estado: 'todos' })

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await fetch('/api/gestion')
        const data = await res.json()
        setProyectos(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [])

  const tipos = [...new Set(proyectos.map(p => p.tipo))].filter(t => t !== 'sin-tipo')
  const estados = [...new Set(proyectos.map(p => p.estado))].filter(e => e !== 'sin-estado')
  const años = [...new Set(proyectos.map(p => p.año))].filter(a => a > 0).sort((a,b) => b-a)

  const filtrados = proyectos.filter(p => {
    const matchAnio = filtro.anio === 'todos' || p.año === Number(filtro.anio)
    const matchTipo = filtro.tipo === 'todos' || p.tipo === filtro.tipo
    const matchEstado = filtro.estado === 'todos' || p.estado === filtro.estado
    return matchAnio && matchTipo && matchEstado
  })

  return (
    <section className="pt-36 pb-25 px-8 t-modo" style={{ backgroundColor: 'var(--color-fondo)' }}>
      <div className="max-w-300 mx-auto">
        <div className="text-center mb-14">
          <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-[0.1em] uppercase mb-3">Gestión</div>
          <h1 className="font-head text-4xl lg:text-5xl font-semibold" style={{ color: 'var(--color-texto)' }}>Mi trabajo en el Concejo</h1>
          <p className="text-(--color-texto-sec) max-w-xl mx-auto mt-3">Probá combinar los filtros para encontrar lo que buscás.</p>
        </div>

        <div className="filtros-container">
          <div className="filtro-grupo">
            <span className="filtro-label"><i className="fas fa-calendar-alt"></i> Año</span>
            <div className="filtro-opciones">
              <button className={`filtro-btn ${filtro.anio === 'todos' ? 'active' : ''}`} onClick={() => setFiltro({...filtro, anio: 'todos'})}>Todos</button>
              {años.map(a => <button key={a} className={`filtro-btn ${filtro.anio === String(a) ? 'active' : ''}`} onClick={() => setFiltro({...filtro, anio: String(a)})}>{a}</button>)}
            </div>
          </div>
          <div className="filtro-grupo">
            <span className="filtro-label"><i className="fas fa-folder-open"></i> Tipo</span>
            <div className="filtro-opciones">
              <button className={`filtro-btn ${filtro.tipo === 'todos' ? 'active' : ''}`} onClick={() => setFiltro({...filtro, tipo: 'todos'})}>Todos</button>
              {tipos.map(t => <button key={t} className={`filtro-btn ${filtro.tipo === t ? 'active' : ''}`} onClick={() => setFiltro({...filtro, tipo: t})}>{t}</button>)}
            </div>
          </div>
          <div className="filtro-grupo">
            <span className="filtro-label"><i className="fas fa-tag"></i> Estado</span>
            <div className="filtro-opciones">
              <button className={`filtro-btn ${filtro.estado === 'todos' ? 'active' : ''}`} onClick={() => setFiltro({...filtro, estado: 'todos'})}>Todos</button>
              {estados.map(e => <button key={e} className={`filtro-btn ${filtro.estado === e ? 'active' : ''}`} onClick={() => setFiltro({...filtro, estado: e})}>{e}</button>)}
            </div>
          </div>
        </div>

        <div className="contador-resultados"><i className="fas fa-file-alt"></i> <strong>{filtrados.length}</strong> proyectos encontrados</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtrados.map((item, i) => (
            <article key={i} className="gestion-card" style={{ backgroundColor: 'var(--color-fondo-alt)', borderColor: 'var(--color-borde)' }}>
              <div className="cabecera">
                <span className="tipo">{item.tipo}</span>
                <span className={`estado estado-${item.estado}`}><i className="fas fa-check text-white text-[1rem]"></i> {item.estado}</span>
              </div>
              <div className="fecha"><i className="fas fa-calendar-day text-xs"></i> {item.fecha}</div>
              <div className="titulo">{item.titulo}</div>
              <div className="descripcion">{item.descripcion}</div>
              {item.enlacePdf && item.enlacePdf !== '' && item.enlacePdf !== '#' && (
                <a href={item.enlacePdf} target="_blank" rel="noopener noreferrer" className="btn-expediente"><i className="fas fa-file-pdf"></i> Ver expediente</a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}""")

def create_api_route():
    create_file("src/app/api/gestion/route.ts", """import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const RANGE = process.env.GOOGLE_SHEETS_RANGE || 'Gestion!A:G'
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY

export async function GET() {
  try {
    if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
      return NextResponse.json({ error: 'Faltan variables de entorno' }, { status: 500 })
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\n/g, '\\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    })

    const rows = response.data.values || []
    if (rows.length < 2) {
      return NextResponse.json({ error: 'No hay datos' }, { status: 404 })
    }

    const data = rows.slice(1)
      .filter(row => row.length > 0 && row.some(cell => cell?.toString().trim()))
      .map(row => ({
        fecha: row[0]?.toString().trim() || '',
        año: parseInt(row[1]) || 0,
        tipo: row[2]?.toString().trim().toLowerCase() || 'sin-tipo',
        titulo: row[3]?.toString().trim() || 'Sin título',
        descripcion: row[4]?.toString().trim() || '',
        estado: row[5]?.toString().trim().toLowerCase() || 'sin-estado',
        enlacePdf: row[6]?.toString().trim() || undefined,
      }))
      .filter(item => item.año > 0 && item.titulo !== 'Sin título')
      .sort((a, b) => b.año - a.año || b.fecha.localeCompare(a.fecha))

    return NextResponse.json(data, {
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })

  } catch (error) {
    console.error('❌ Error en API:', error)
    return NextResponse.json({ error: 'Error obteniendo datos' }, { status: 500 })
  }
}""")

def create_component_nav():
    create_file("src/components/Nav.tsx", """'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
  const [tema, setTema] = useState('claro')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const temaGuardado = localStorage.getItem('gm-tema') || 'claro'
    setTema(temaGuardado)
    document.documentElement.setAttribute('data-tema', temaGuardado)
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTema = () => {
    const nuevo = tema === 'claro' ? 'oscuro' : 'claro'
    setTema(nuevo)
    localStorage.setItem('gm-tema', nuevo)
    document.documentElement.setAttribute('data-tema', nuevo)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-18 flex items-center justify-between px-8 t-modo ${scrolled ? 'scrolled' : ''}`}
      style={{ backgroundColor: 'var(--color-nav)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-borde)' }}>
      <Link href="/" className="flex items-center gap-2 h-9 w-auto">
        <Image src="/images/aguila-blanca.png" alt="Logo" width={48} height={48} className="h-12 w-auto" />
        <div className="h-8 w-[3px] bg-current opacity-60"></div>
        <Image src="/images/texto_blanco.png" alt="Giselle Miravete" width={120} height={32} className="h-8 w-auto" />
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-sm font-medium t-modo transition-colors" style={{ color: 'var(--color-texto)' }}>Inicio</Link>
        <Link href="/#sobre-mi" className="text-sm font-medium t-modo transition-colors" style={{ color: 'var(--color-texto)' }}>Sobre Mí</Link>
        <Link href="/proyectos" className="text-sm font-medium t-modo transition-colors" style={{ color: 'var(--color-texto)' }}>Proyectos</Link>
        <Link href="/mapa" className="text-sm font-medium t-modo transition-colors" style={{ color: 'var(--color-texto)' }}>Mapa</Link>
        <Link href="/#contacto" className="text-sm font-medium t-modo transition-colors" style={{ color: 'var(--color-texto)' }}>Contacto</Link>
        <button onClick={toggleTema} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ color: 'var(--color-texto)' }}>
          <i className={`fas ${tema === 'oscuro' ? 'fa-sun' : 'fa-moon'} text-sm`}></i>
        </button>
      </div>
    </nav>
  )
}""")

def create_component_footer():
    create_file("src/components/Footer.tsx", """import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="t-modo px-8 py-4" style={{ backgroundColor: 'var(--color-primario-dark)' }}>
      <div className="max-w-300 mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
        <p className="text-white/60 text-[11px] leading-snug text-center md:text-left">
          © 2026 Giselle Miravete. Todos los derechos reservados.<br className="hidden md:block" />
          Santo Tomé, Santa Fe, Argentina.
        </p>
        <div className="h-12 md:h-14 flex items-center overflow-hidden">
          <Image src="/images/aguila-blanca.png" alt="La Libertad Avanza" width={56} height={56} className="h-14 md:h-15 object-contain opacity-60 md:opacity-70 -my-2 md:-my-4" />
        </div>
      </div>
    </footer>
  )
}""")

def create_component_hero():
    create_file("src/components/Hero.tsx", """'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-30 pb-28" id="inicio">
      <div className="absolute inset-0 scale-105 hero-bg" style={{ backgroundImage: 'url(/images/hero-bg-institucional.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div className="absolute inset-0 t-modo" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primario) 88%, transparent)' }}></div>
      <div className="relative z-10 max-w-300 mx-auto px-6 pt-36 pb-20 text-center sm:text-left">
        <h1 className="font-head text-white leading-[1.05] mb-2" style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)' }}>
          Giselle<br /><span className="t-modo" style={{ color: 'var(--color-destacado)' }}>Miravete</span>
        </h1>
        <p className="font-head text-white/85 italic mb-5" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)' }}>Concejal de Santo Tomé</p>
        <p className="text-white/80 max-w-140 leading-relaxed mb-9" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}>
          Trabajando por una ciudad productiva, eficiente, segura donde emprender no sea un desafío.
        </p>
        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
          <Link href="/proyectos" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white shadow-md t-modo hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'color-mix(in srgb, var(--color-destacado-fondo) 70%, transparent)' }}>
            <i className="fas fa-clipboard-list"></i> Ver mi gestión
          </Link>
          <Link href="#contacto" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white border-2 border-white/60 t-modo hover:border-white/90 hover:scale-105 hover:shadow-lg transition-all">
            <i className="fas fa-envelope"></i> Contactame
          </Link>
        </div>
      </div>
    </section>
  )
}""")

def create_component_sobre_mi():
    create_file("src/components/SobreMi.tsx", """export default function SobreMi() {
  return (
    <section className="py-28 px-8 relative overflow-hidden" id="sobre-mi" style={{ background: 'linear-gradient(to bottom, transparent, var(--color-fondo-alt))' }}>
      <div className="max-w-300 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative max-w-[420px] mx-auto lg:mx-0">
          <img src="/images/sobre-mi.webp" alt="Giselle Miravete" className="w-full aspect-[3/4] object-cover rounded-3xl shadow-2xl" />
          <div className="absolute -bottom-4 -right-4 w-44 h-44 rounded-3xl -z-10 t-modo" style={{ border: '3px solid var(--color-destacado)', opacity: 0.6 }}></div>
        </div>
        <div className="text-center lg:text-left">
          <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-[0.1em] uppercase mb-3">Sobre Mí</div>
          <h2 className="font-head text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: 'var(--color-texto)' }}>Compromiso con<br />nuestra ciudad</h2>
          <p className="leading-relaxed mb-3.5 font-medium mt-3" style={{ color: 'var(--color-texto-sec)' }}>
            Santotomesina por adopción hace más de 30 años, mamá de Lautaro y Micaela y abuela de dos hermosas nietas. Técnica en Saneamiento Ambiental, control bromatológico y tecnología de los alimentos; Postgrado en sistemas de control de calidad y auditorías. Profesional convencida de que la política transformadora se construye desde el territorio, escuchando a cada vecino.
          </p>
          <p className="leading-relaxed font-medium" style={{ color: 'var(--color-texto-sec)' }}>
            Como concejal, mi labor se centra en legislar con responsabilidad, fiscalizar con transparencia y ser la voz de todos los Santotomesinos en el Honorable Concejo Municipal.
          </p>
        </div>
      </div>
    </section>
  )
}""")

def create_component_equipo():
    create_file("src/components/Equipo.tsx", """export default function Equipo() {
  const miembros = [
    { nombre: 'Nombre Apellido', rol: 'Cargo o rol', descripcion: 'Breve descripción de su rol o trayectoria.' },
    { nombre: 'Nombre Apellido', rol: 'Cargo o rol', descripcion: 'Breve descripción de su rol o trayectoria.' },
    { nombre: 'Nombre Apellido', rol: 'Cargo o rol', descripcion: 'Breve descripción de su rol o trayectoria.' },
    { nombre: 'Nombre Apellido', rol: 'Cargo o rol', descripcion: 'Breve descripción de su rol o trayectoria.' },
  ]
  return (
    <section className="py-28 px-8 t-modo" id="equipo" style={{ backgroundColor: 'var(--color-fondo-alt)' }}>
      <div className="max-w-300 mx-auto text-center mb-14">
        <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-[0.1em] uppercase mb-3">Equipo</div>
        <h2 className="font-head text-4xl lg:text-5xl font-semibold" style={{ color: 'var(--color-texto)' }}>Quiénes trabajan conmigo</h2>
        <p className="leading-relaxed mt-3 font-medium" style={{ color: 'var(--color-texto-sec)' }}>Profesionales comprometidos con Santo Tomé.</p>
      </div>
      <div className="max-w-300 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {miembros.map((m, i) => (
          <div key={i} className="text-center group">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-[3px] transition-all duration-300 group-hover:shadow-[0_6px_0_0_var(--color-destacado)]" style={{ borderColor: 'var(--color-borde)' }}>
              <img src="/images/equipo-placeholder.webp" alt={m.nombre} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-head text-lg font-semibold mb-0.5" style={{ color: 'var(--color-texto)' }}>{m.nombre}</h3>
            <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-destacado)' }}>{m.rol}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-texto-sec)' }}>{m.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  )
}""")

def create_component_pilares():
    create_file("src/components/Pilares.tsx", """export default function Pilares() {
  const pilares = [
    { icono: 'fa-balance-scale', titulo: 'Transparencia', descripcion: 'Rendir cuentas, fiscalizar y garantizar que cada recurso de los santotomesinos sea utilizado con responsabilidad.' },
    { icono: 'fa-chain-broken', titulo: 'Libertad', descripcion: 'La prioridad es un municipio que deje de poner trabas a quienes producen y regeneran la economía para nuestra sociedad.' },
    { icono: 'fa-map-marked-alt', titulo: 'Territorio', descripcion: 'Creemos en una ciudad participativa donde el vecino es el motor para la creación de los proyectos de nuestra ciudad.' },
    { icono: 'fa-tree-city', titulo: 'Orden', descripcion: 'Santo Tomé necesita planificación, desburocratización y previsibilidad.' },
  ]
  return (
    <section className="py-28 px-8 t-modo" id="pilares" style={{ backgroundColor: 'var(--color-primario-dark)' }}>
      <div className="max-w-300 mx-auto text-center mb-14">
        <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-[0.1em] uppercase mb-3">Valores</div>
        <h2 className="font-head text-white text-4xl lg:text-5xl font-semibold">En qué creo</h2>
        <p className="text-white/85 max-w-[520px] mx-auto mt-3">Los que me guían cada decisión en el Concejo Municipal.</p>
      </div>
      <div className="max-w-300 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pilares.map((p, i) => (
          <div key={i} className="pilar-card text-center p-10 rounded-2xl border t-modo transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primario-dark) 90%, white)', borderColor: 'color-mix(in srgb, var(--color-destacado) 55%, transparent)' }}>
            <div className="w-14 h-14 rounded-xl grid place-items-center mx-auto mb-5 text-xl text-white t-modo" style={{ backgroundColor: 'color-mix(in srgb, var(--color-destacado-fondo) 70%, transparent)' }}>
              <i className={`fas ${p.icono}`}></i>
            </div>
            <h3 className="font-head text-white text-lg font-semibold mb-2.5">{p.titulo}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{p.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  )
}""")

def create_component_voluntariado():
    create_file("src/components/Voluntariado.tsx", """'use client'

import { useState } from 'react'

export default function Voluntariado() {
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      setMensaje('✅ ¡Gracias por sumarte!')
      setTimeout(() => setMensaje(''), 3000)
    }, 1500)
  }

  return (
    <section className="py-28 px-8 t-modo" id="voluntariado" style={{ backgroundColor: 'var(--color-fondo)' }}>
      <div className="max-w-300 mx-auto text-center mb-14">
        <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-[0.1em] uppercase mb-3">Voluntariado</div>
        <h2 className="font-head text-4xl lg:text-5xl font-semibold" style={{ color: 'var(--color-texto)' }}>Sumá tu voz</h2>
        <p className="leading-relaxed font-medium mt-3" style={{ color: 'var(--color-texto-sec)' }}>Tu participación hace la diferencia. Dejá tus datos y nos contactamos.</p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre completo *" required className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }} />
          <input type="email" placeholder="Email *" required className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }} />
        </div>
        <input type="tel" placeholder="Teléfono" className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }} />
        <textarea placeholder="¿En qué actividad te gustaría participar?" rows={4} className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none resize-y min-h-[100px]" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }}></textarea>
        <button type="submit" disabled={enviando} className="btn-enviar inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl mx-auto" style={{ backgroundColor: 'var(--color-texto)', color: '#ffffff' }}>
          <i className="fas fa-hand-holding-heart"></i> {enviando ? 'Enviando...' : 'Quiero ser voluntario/a'}
        </button>
        {mensaje && <p className="text-center text-sm font-medium" style={{ color: 'var(--color-destacado)' }}>{mensaje}</p>}
      </form>
    </section>
  )
}""")

def create_component_contacto():
    create_file("src/components/Contacto.tsx", """'use client'

import { useState } from 'react'

export default function Contacto() {
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      setMensaje('✅ ¡Mensaje enviado!')
      setTimeout(() => setMensaje(''), 3000)
    }, 1500)
  }

  return (
    <section className="py-28 px-8 t-modo" id="contacto" style={{ backgroundColor: 'var(--color-fondo-alt)' }}>
      <div className="max-w-300 mx-auto text-center mb-14">
        <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-[0.1em] uppercase mb-3">Contacto</div>
        <h2 className="font-head text-4xl lg:text-5xl font-semibold" style={{ color: 'var(--color-texto)' }}>Escribime</h2>
        <p className="leading-relaxed font-medium mt-3" style={{ color: 'var(--color-texto-sec)' }}>Tu opinión es fundamental. No dudes en comunicarte.</p>
      </div>
      <div className="max-w-300 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="text-center lg:text-left">
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-texto)' }}>Mis redes sociales</h3>
          <div className="flex gap-3 justify-center lg:justify-start">
            {['facebook-f', 'instagram', 'x-twitter', 'threads', 'youtube'].map((red, i) => (
              <a key={i} href="#" className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300" style={{ backgroundColor: 'var(--color-fondo)', border: '2px solid var(--color-borde)', color: 'var(--color-texto)' }}>
                <i className={`fab fa-${red}`}></i>
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Nombre completo *" required className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }} />
            <input type="email" placeholder="Email *" required className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="tel" placeholder="Teléfono" className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }} />
            <select className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }}>
              <option value="">Asunto</option>
              <option value="consulta">Consulta general</option>
              <option value="propuesta">Propuesta</option>
              <option value="reclamo">Reclamo</option>
              <option value="voluntariado">Quiero ser voluntario/a</option>
            </select>
          </div>
          <textarea placeholder="Mensaje *" required rows={5} className="py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none resize-y min-h-[120px]" style={{ backgroundColor: 'var(--color-fondo)', borderColor: 'var(--color-borde)', color: 'var(--color-texto)' }}></textarea>
          <button type="submit" disabled={enviando} className="btn-enviar inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl" style={{ backgroundColor: 'var(--color-texto)', color: '#ffffff' }}>
            <i className="fas fa-paper-plane"></i> {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
          {mensaje && <p className="text-center text-sm font-medium" style={{ color: 'var(--color-destacado)' }}>{mensaje}</p>}
        </form>
      </div>
    </section>
  )
}""")

def create_scripts_fetch_data():
    create_file("scripts/fetch-gestion-data.ts", """#!/usr/bin/env node
import { google } from 'googleapis'
import fs from 'fs/promises'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
const RANGE = process.env.GOOGLE_SHEETS_RANGE || 'Gestion!A:G'
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY

async function fetchAndProcessData() {
  console.log('📊 Iniciando fetch de datos de gestión...')
  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error('❌ Faltan variables de entorno')
    return
  }
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY.replace(/\\\\n/g, '\\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    const sheets = google.sheets({ version: 'v4', auth })
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    })
    const rows = response.data.values || []
    if (rows.length < 2) {
      console.warn('⚠️ No se encontraron datos en el Excel')
      return
    }
    const data = rows.slice(1)
      .filter(row => row.length > 0 && row.some(cell => cell?.toString().trim()))
      .map(row => ({
        fecha: row[0]?.toString().trim() || '',
        año: parseInt(row[1]) || 0,
        tipo: row[2]?.toString().trim().toLowerCase() || 'sin-tipo',
        titulo: row[3]?.toString().trim() || 'Sin título',
        descripcion: row[4]?.toString().trim() || '',
        estado: row[5]?.toString().trim().toLowerCase() || 'sin-estado',
        enlacePdf: row[6]?.toString().trim() || undefined,
      }))
      .filter(item => item.año > 0 && item.titulo !== 'Sin título')
      .sort((a, b) => b.año - a.año || b.fecha.localeCompare(a.fecha))
    const dataDir = path.join(process.cwd(), 'src', 'data')
    await fs.mkdir(dataDir, { recursive: true })
    await fs.writeFile(path.join(dataDir, 'gestion.json'), JSON.stringify(data, null, 2))
    await fs.writeFile(path.join(dataDir, 'gestion-meta.json'), JSON.stringify({
      lastUpdate: new Date().toISOString(),
      count: data.length,
      source: SPREADSHEET_ID,
      version: '1.0.0',
    }, null, 2))
    console.log(`✅ ${data.length} proyectos guardados`)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
fetchAndProcessData()""")

def create_scripts_update_data():
    create_file("scripts/update-gestion-data.ts", """#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)
async function updateGestionData() {
  console.log('🔄 Iniciando actualización de datos...')
  console.log(`📅 ${new Date().toISOString()}`)
  try {
    const { stdout, stderr } = await execAsync('npm run fetch-data')
    if (stderr) console.error('❌ Error:', stderr)
    console.log(stdout)
    console.log('✅ Datos actualizados exitosamente')
  } catch (error) {
    console.error('❌ Error actualizando datos:', error)
  }
}
updateGestionData()""")

# ============================================================
# EJECUCIÓN PRINCIPAL
# ============================================================

def main():
    print("""
╔══════════════════════════════════════════════════════════════════╗
║  🚀 SETUP: Giselle Miravete - Next.js + Tailwind CSS           ║
║  📁 Carpeta: web-giselle-nodejs                                ║
║  📅 Fecha: 2026                                               ║
╚══════════════════════════════════════════════════════════════════╝
    """)

    print(f"📁 Directorio del proyecto: {PROJECT_DIR}")

    # Crear estructura de carpetas
    print("\n📂 Creando estructura de carpetas...")
    (PROJECT_DIR / "src/app/api/gestion").mkdir(parents=True, exist_ok=True)
    (PROJECT_DIR / "src/components").mkdir(parents=True, exist_ok=True)
    (PROJECT_DIR / "src/data").mkdir(parents=True, exist_ok=True)
    (PROJECT_DIR / "scripts").mkdir(parents=True, exist_ok=True)
    (PROJECT_DIR / "public/images").mkdir(parents=True, exist_ok=True)

    # Crear archivos
    print("\n📄 Creando archivos de configuración...")
    create_package_json()
    create_tsconfig()
    create_tailwind_config()
    create_postcss_config()
    create_next_config()
    create_gitignore()
    create_env_example()
    copy_env_file()

    print("\n📄 Creando archivos de la aplicación...")
    create_global_css()
    create_layout()
    create_page()
    create_proyectos_page()
    create_api_route()

    print("\n📄 Creando componentes...")
    create_component_nav()
    create_component_footer()
    create_component_hero()
    create_component_sobre_mi()
    create_component_equipo()
    create_component_pilares()
    create_component_voluntariado()
    create_component_contacto()

    print("\n📄 Creando scripts...")
    create_scripts_fetch_data()
    create_scripts_update_data()

    # Instalar dependencias
    print("\n📦 Instalando dependencias...")
    print("⏳ Esto puede tomar unos minutos...")
    run_command("npm install", PROJECT_DIR)

    print("\n✅ ¡Setup completado!")
    print("""
╔══════════════════════════════════════════════════════════════════╗
║  🎉 PROYECTO LISTO                                             ║
║                                                                 ║
║  Comandos útiles:                                              ║
║    npm run dev     → Iniciar servidor de desarrollo            ║
║    npm run build   → Construir para producción                 ║
║    npm run fetch-data → Obtener datos del Excel               ║
║                                                                 ║
║  🔑 No olvides configurar tu .env con las credenciales         ║
║  📄 Revisa .env.example para las variables necesarias          ║
╚══════════════════════════════════════════════════════════════════╝
    """)

if __name__ == "__main__":
    main()