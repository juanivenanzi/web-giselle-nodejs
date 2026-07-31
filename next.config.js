/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  // ✅ Configuración para permitir orígenes en desarrollo
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '192.168.100.253', // ✅ Tu IP local (la que estás usando)
    // Puedes añadir más IPs o dominios si los necesitas
  ],
  // Configuración para imágenes locales
  // Las imágenes en /public/images no necesitan configuración especial
};

module.exports = nextConfig;