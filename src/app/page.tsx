// src/app/page.tsx
// ✅ FIX: se eliminó el useEffect que forzaba data-tema="claro" en cada
// montaje del Home. Eso pisaba la preferencia de tema oscuro del usuario
// cada vez que volvía a "/". El modo y el tema ya se inicializan una sola
// vez, correctamente, en AppContext (leyendo localStorage).
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Equipo from "@/components/Equipo";
import Pilares from "@/components/Pilares";
import Voluntariado from "@/components/Voluntariado";
import Contacto from "@/components/Contacto";

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
  );
}