import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
    <html lang="es" data-modo="institucional" data-tema="claro">
      <head>
        {/* FontAwesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.className} font-body bg-(--color-fondo) text-(--color-texto)`}
      >
        <a href="#inicio" className="skip-link">
          Saltar al contenido
        </a>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
