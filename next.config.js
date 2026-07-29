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
  // Configuración para imágenes locales
  // Las imágenes en /public/images no necesitan configuración especial
};

module.exports = nextConfig;
