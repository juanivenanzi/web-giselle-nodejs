// src/components/Pilares.tsx
import AnimateOnScroll from "./AnimateOnScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBalanceScale,
  faChainBroken,
  faMapMarkedAlt,
  faTreeCity,
} from "@fortawesome/free-solid-svg-icons";

const pilares = [
  {
    icon: faBalanceScale,
    titulo: "Transparencia",
    descripcion:
      "Rendir cuentas, fiscalizar y garantizar que cada recurso de los santotomesinos sea utilizado con responsabilidad.",
  },
  {
    icon: faChainBroken,
    titulo: "Libertad",
    descripcion:
      "La prioridad es un municipio que deje de poner trabas a quienes producen y regeneran la economía para nuestra sociedad.",
  },
  {
    icon: faMapMarkedAlt,
    titulo: "Territorio",
    descripcion:
      "Creemos en una ciudad participativa donde el vecino es el motor para la creación de los proyectos de nuestra ciudad.",
  },
  {
    icon: faTreeCity,
    titulo: "Orden",
    descripcion:
      "Santo Tomé necesita planificación, desburocratización y previsibilidad.",
  },
];

export default function Pilares() {
  return (
    <section
      className="py-28 px-8 t-modo"
      id="pilares"
      style={{ backgroundColor: "var(--color-primario-dark)" }}
    >
      <div className="max-w-300 mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Valores
            </div>
            <h2
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "#ffffff" }}
            >
              En qué creo
            </h2>
            <p
              className="max-w-130 mx-auto mt-3"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Los que me guían cada decisión en el Concejo Municipal.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pilares.map((p, i) => (
            <AnimateOnScroll
              key={i}
              className={`h-full ${i === 1 ? "reveal-delay-1" : i === 2 ? "reveal-delay-2" : i === 3 ? "reveal-delay-3" : ""}`}
            >
              <div
                className="pilar-card text-center p-10 rounded-2xl border-b-4 t-modo transition-all duration-300 hover:scale-105 hover:border-b-8 h-full flex flex-col"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primario-dark) 90%, white)",
                  borderColor:
                    "color-mix(in srgb, var(--color-destacado) 55%, transparent)",
                  borderBottomColor:
                    "color-mix(in srgb, var(--color-destacado) 80%, transparent)",
                }}
              >
                <div
                  className="mx-auto mb-5 text-3xl t-modo"
                  style={{ color: "var(--color-destacado)" }}
                >
                  <FontAwesomeIcon icon={p.icon} />
                </div>
                <h3
                  className="font-head text-lg font-semibold mb-2.5"
                  style={{ color: "#ffffff" }}
                >
                  {p.titulo}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  {p.descripcion}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}