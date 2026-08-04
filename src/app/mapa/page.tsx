import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function MapaPage() {
  return (
    <main
      className="pt-36 pb-20 px-8"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p
            className="text-xl max-w-2xl mx-auto font-medium"
            style={{ color: "var(--color-texto)" }}
          >
            Conocé los servicios, las obras y los puntos de interés más
            importantes de Santo Tomé.
          </p>
          <p
            className="text-sm max-w-xl mx-auto mt-3"
            style={{ color: "var(--color-texto-sec)" }}
          >
            Actualizado permanentemente por el equipo de Giselle Miravete.
          </p>
        </div>
        <div
          className="w-full overflow-hidden rounded-2xl shadow-2xl border"
          style={{ borderColor: "var(--color-borde)" }}
        >
          <iframe
            src="https://www.google.com/maps/d/u/0/embed?mid=1AiIR7TWamqonDCPndiN-UXhQxkFqbA8&ehbc=2E312F&noprof=1&ll=-31.6627,-60.7653&z=13"
            width="100%"
            height="600"
            className="border-0"
            allowFullScreen
            loading="lazy"
          />
        </div>
        <div
          className="text-center mt-10 pt-6 border-t"
          style={{ borderColor: "var(--color-borde)" }}
        >
          <p className="text-base" style={{ color: "var(--color-texto)" }}>
            ¿Querés sugerir un punto de interés o reportar algo?
            <a
              href="/#contacto"
              className="inline-flex items-center gap-1 font-semibold hover:underline ml-1"
              style={{ color: "var(--color-destacado)" }}
            >
              Contactanos{" "}
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}