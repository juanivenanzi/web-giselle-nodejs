// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { AppProvider } from "@/context/AppContext";
import "@/lib/fontawesome"; // ← Carga estática de estilos de Font Awesome

// Configuración de fuentes con next/font (auto-hospedadas, sin FOUC)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-serif",
});

export const metadata: Metadata = {
  title: "La Libertad Avanza — Santo Tomé",
  description:
    "Sitio oficial de Giselle Miravete, Concejal de Santo Tomé, Santa Fe.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${dmSerif.variable}`}>
      <head>{/* No se necesitan links externos de fuentes ni de Font Awesome */}</head>
      <body className={`${inter.className} font-body bg-(--color-fondo) text-(--color-texto)`}>
        <a href="#inicio" className="skip-link">
          Saltar al contenido
        </a>
        <AppProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}