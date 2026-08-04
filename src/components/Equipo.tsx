// src/components/Equipo.tsx
import AnimateOnScroll from "./AnimateOnScroll";

const miembros = [
  {
    nombre: "Nombre Apellido",
    rol: "Cargo o rol",
    descripcion: "Breve descripción de su rol o trayectoria.",
  },
  {
    nombre: "Nombre Apellido",
    rol: "Cargo o rol",
    descripcion: "Breve descripción de su rol o trayectoria.",
  },
  {
    nombre: "Nombre Apellido",
    rol: "Cargo o rol",
    descripcion: "Breve descripción de su rol o trayectoria.",
  },
  {
    nombre: "Nombre Apellido",
    rol: "Cargo o rol",
    descripcion: "Breve descripción de su rol o trayectoria.",
  },
];

export default function Equipo() {
  return (
    <section
      className="py-25 px-8 t-modo"
      id="equipo"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-primario) 7%, var(--color-fondo))",
      }}
    >
      <div className="max-w-300 mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-3">
              Equipo
            </div>
            <h2
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "var(--color-texto)" }}
            >
              Quiénes trabajan conmigo
            </h2>
            <p
              className="leading-relaxed mb-3.5 font-medium mt-3"
              style={{
                color:
                  "color-mix(in srgb, var(--color-texto) 75%, transparent)",
              }}
            >
              Profesionales comprometidos con Santo Tomé.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {miembros.map((m, i) => (
            <AnimateOnScroll
              key={i}
              className={
                i === 1
                  ? "reveal-delay-1"
                  : i === 2
                  ? "reveal-delay-2"
                  : i === 3
                  ? "reveal-delay-3"
                  : ""
              }
            >
              <div className="text-center group">
                <div
                  className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-[3px] foto-equipo t-modo transition-all duration-300 group-hover:border-(--color-destacado)"
                  style={{ borderColor: "var(--color-borde)" }}
                >
                  <div className="w-full h-full flex items-center justify-center bg-(--color-fondo-alt) text-(--color-texto-sec) text-4xl font-head">
                    {m.nombre
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <h3
                  className="font-head text-lg font-semibold mb-0.5"
                  style={{
                    color:
                      "color-mix(in srgb, var(--color-texto) 85%, transparent)",
                  }}
                >
                  {m.nombre}
                </h3>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: "var(--color-rol)" }}
                >
                  {m.rol}
                </p>
                <p
                  className="text-sm leading-relaxed font-medium"
                  style={{
                    color:
                      "color-mix(in srgb, var(--color-texto) 75%, transparent)",
                  }}
                >
                  {m.descripcion}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}