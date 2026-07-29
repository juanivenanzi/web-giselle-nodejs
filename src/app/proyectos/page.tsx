"use client";

import { useState, useEffect } from "react";

type GestionItem = {
  fecha: string;
  año: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  estado: string;
  enlacePdf?: string;
};

const tipoLabel: Record<string, string> = {
  ordenanza: "Ordenanza",
  declaracion: "Declaración",
  "pedido-informes": "Pedido de informes",
  "notas-reclamo": "Nota de reclamo",
  "proyectos-comunicacion": "Proyecto de Comunicación",
  "proyectos-resolucion": "Proyecto de Resolución",
  resolucion: "Resolución",
  comunicacion: "Comunicación",
};

const estadoLabel: Record<string, string> = {
  aprobada: "Aprobada",
  "en-tratamiento": "En tratamiento",
  "no-aprobada": "No aprobada",
  "en-comision": "En comisión",
  vetada: "Vetada",
};

const estadoIcono: Record<string, string> = {
  aprobada: "fa-check",
  "en-tratamiento": "fa-clock",
  "no-aprobada": "fa-xmark",
  "en-comision": "fa-people-arrows",
  vetada: "fa-ban",
};

function TarjetaGestion({ item }: { item: GestionItem }) {
  const tieneEnlace =
    item.enlacePdf && item.enlacePdf !== "" && item.enlacePdf !== "#";
  const estadoClass = `estado-${item.estado}`;
  const icono = estadoIcono[item.estado] || "fa-circle-question";

  return (
    <article
      className="gestion-card"
      style={{
        backgroundColor: "var(--color-fondo-alt)",
        borderColor: "var(--color-borde)",
      }}
    >
      <div className="cabecera">
        <span className="tipo">{tipoLabel[item.tipo] || item.tipo}</span>
        <span className={`estado ${estadoClass}`}>
          <i className={`fas ${icono} text-white text-[0.75rem]`}></i>
          {estadoLabel[item.estado] || item.estado}
        </span>
      </div>
      <div className="fecha">
        <i className="fas fa-calendar-day"></i> {item.fecha}
      </div>
      <div className="titulo">{item.titulo}</div>
      <div className="descripcion">{item.descripcion}</div>
      {tieneEnlace && (
        <a
          href={item.enlacePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-expediente"
        >
          <i className="fas fa-file-pdf"></i> Ver expediente
        </a>
      )}
    </article>
  );
}

function Filtros({ filtro, setFiltro, años, tipos, estados }: any) {
  return (
    <div className="filtros-vertical">
      <div className="filtro-fila">
        <div className="label-guia">
          <span className="numero-paso">1</span>
          <i className="fas fa-calendar-alt"></i> Año
          <span
            className="tooltip-ayuda"
            title="Elegí un año para empezar a filtrar"
          >
            ⓘ ¿Qué año te interesa?
          </span>
        </div>
        <div className="opciones">
          <span
            className={`pastilla-color tipo-todos ${filtro.anio === "todos" ? "activa" : ""}`}
            onClick={() => setFiltro({ ...filtro, anio: "todos" })}
          >
            Todos
          </span>
          {años.map((a: number) => (
            <span
              key={a}
              className={`pastilla-color anio-pastilla ${filtro.anio === String(a) ? "activa" : ""}`}
              onClick={() => setFiltro({ ...filtro, anio: String(a) })}
            >
              {a}
            </span>
          ))}
        </div>
      </div>
      <div className="filtro-fila">
        <div className="label-guia">
          <span className="numero-paso">2</span>
          <i className="fas fa-folder-open"></i> Tipo
          <span
            className="tooltip-ayuda"
            title="Filtrá por el tipo de gestión que te interesa"
          >
            ⓘ ¿Qué tipo de proyecto?
          </span>
        </div>
        <div className="opciones">
          <span
            className={`pastilla-color tipo-todos ${filtro.tipo === "todos" ? "activa" : ""}`}
            onClick={() => setFiltro({ ...filtro, tipo: "todos" })}
          >
            Todos
          </span>
          {tipos.map((t: string) => (
            <span
              key={t}
              className={`pastilla-color ${filtro.tipo === t ? "activa" : ""}`}
              onClick={() => setFiltro({ ...filtro, tipo: t })}
            >
              {tipoLabel[t] || t}
            </span>
          ))}
        </div>
      </div>
      <div className="filtro-fila">
        <div className="label-guia">
          <span className="numero-paso">3</span>
          <i className="fas fa-tag"></i> Estado
          <span
            className="tooltip-ayuda"
            title="Seleccioná el estado actual del proyecto"
          >
            ⓘ ¿En qué estado está?
          </span>
        </div>
        <div className="opciones">
          <span
            className={`pastilla-color tipo-todos ${filtro.estado === "todos" ? "activa" : ""}`}
            onClick={() => setFiltro({ ...filtro, estado: "todos" })}
          >
            Todos
          </span>
          {estados.map((e: string) => (
            <span
              key={e}
              className={`pastilla-color ${filtro.estado === e ? "activa" : ""}`}
              onClick={() => setFiltro({ ...filtro, estado: e })}
            >
              {estadoLabel[e] || e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<GestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    anio: "todos",
    tipo: "todos",
    estado: "todos",
  });

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await fetch("/api/gestion");
        const data = await res.json();
        setProyectos(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  const tipos = [...new Set(proyectos.map((p) => p.tipo))].filter(
    (t) => t !== "sin-tipo",
  );
  const estados = [...new Set(proyectos.map((p) => p.estado))].filter(
    (e) => e !== "sin-estado",
  );
  const años = [...new Set(proyectos.map((p) => p.año))]
    .filter((a) => a > 0)
    .sort((a, b) => b - a);

  const filtrados = proyectos.filter((p) => {
    const matchAnio = filtro.anio === "todos" || p.año === Number(filtro.anio);
    const matchTipo = filtro.tipo === "todos" || p.tipo === filtro.tipo;
    const matchEstado = filtro.estado === "todos" || p.estado === filtro.estado;
    return matchAnio && matchTipo && matchEstado;
  });

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: "var(--color-fondo)" }}
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4" style={{ color: "var(--color-texto)" }}>
            Cargando proyectos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="pt-36 pb-25 px-8 t-modo"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div className="max-w-300 mx-auto">
        <div className="contenido-institucional">
          <div className="text-center mb-14">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Gestión
            </div>
            <h1
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "var(--color-texto)" }}
            >
              Mi trabajo en el Concejo
            </h1>
            <p className="mensaje-bienvenida">
              <span>
                <strong>Probá combinar</strong> los filtros para encontrar lo
                que buscás.
              </span>
            </p>
          </div>
          <Filtros
            filtro={filtro}
            setFiltro={setFiltro}
            años={años}
            tipos={tipos}
            estados={estados}
          />
          <div className="contador-resultados">
            <i className="fas fa-file-alt"></i>{" "}
            <strong>{filtrados.length}</strong> proyectos encontrados
          </div>
          <div className="grid-tarjetas">
            {filtrados.map((item, i) => (
              <TarjetaGestion key={i} item={item} />
            ))}
          </div>
        </div>
        <div className="contenido-campaña">
          <div className="text-center mb-14">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Propuestas
            </div>
            <h1
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "var(--color-texto)" }}
            >
              Nuestro trabajo para Santo Tomé
            </h1>
            <p className="mensaje-bienvenida">
              <span>
                <strong>Conocé nuestras propuestas</strong> para Santo Tomé.
              </span>
            </p>
          </div>
          <div className="grid-tarjetas">
            <article
              className="gestion-card"
              style={{
                backgroundColor: "var(--color-fondo-alt)",
                borderColor: "var(--color-borde)",
              }}
            >
              <div className="cabecera">
                <span
                  className="tipo"
                  style={{
                    backgroundColor: "var(--color-destacado)",
                    color: "#000000",
                  }}
                >
                  Transparencia
                </span>
                <span className="estado estado-aprobada">
                  <i className="fas fa-check text-white text-[0.75rem]"></i>{" "}
                  Activa
                </span>
              </div>
              <div className="fecha">
                <i className="fas fa-calendar-day"></i> 2025
              </div>
              <div className="titulo">Municipio transparente</div>
              <div className="descripcion">
                Acceso total a los gastos públicos y contrataciones a través de
                una plataforma digital.
              </div>
            </article>
            <article
              className="gestion-card"
              style={{
                backgroundColor: "var(--color-fondo-alt)",
                borderColor: "var(--color-borde)",
              }}
            >
              <div className="cabecera">
                <span
                  className="tipo"
                  style={{
                    backgroundColor: "var(--color-destacado)",
                    color: "#000000",
                  }}
                >
                  Libertad
                </span>
                <span className="estado estado-aprobada">
                  <i className="fas fa-check text-white text-[0.75rem]"></i>{" "}
                  Activa
                </span>
              </div>
              <div className="fecha">
                <i className="fas fa-calendar-day"></i> 2025
              </div>
              <div className="titulo">Menos impuestos, más desarrollo</div>
              <div className="descripcion">
                Reducción de tasas municipales para pequeños comerciantes y
                emprendedores.
              </div>
            </article>
            <article
              className="gestion-card"
              style={{
                backgroundColor: "var(--color-fondo-alt)",
                borderColor: "var(--color-borde)",
              }}
            >
              <div className="cabecera">
                <span
                  className="tipo"
                  style={{
                    backgroundColor: "var(--color-destacado)",
                    color: "#000000",
                  }}
                >
                  Territorio
                </span>
                <span className="estado estado-aprobada">
                  <i className="fas fa-check text-white text-[0.75rem]"></i>{" "}
                  Activa
                </span>
              </div>
              <div className="fecha">
                <i className="fas fa-calendar-day"></i> 2025
              </div>
              <div className="titulo">Santo Tomé participativo</div>
              <div className="descripcion">
                Presupuesto participativo donde los vecinos deciden en qué se
                invierten los recursos.
              </div>
            </article>
            <article
              className="gestion-card"
              style={{
                backgroundColor: "var(--color-fondo-alt)",
                borderColor: "var(--color-borde)",
              }}
            >
              <div className="cabecera">
                <span
                  className="tipo"
                  style={{
                    backgroundColor: "var(--color-destacado)",
                    color: "#000000",
                  }}
                >
                  Orden
                </span>
                <span className="estado estado-aprobada">
                  <i className="fas fa-check text-white text-[0.75rem]"></i>{" "}
                  Activa
                </span>
              </div>
              <div className="fecha">
                <i className="fas fa-calendar-day"></i> 2025
              </div>
              <div className="titulo">Plan de ordenamiento urbano</div>
              <div className="descripcion">
                Desarrollo planificado con ordenanzas claras y previsibles para
                el crecimiento de la ciudad.
              </div>
            </article>
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <a
            href="/"
            className="btn-enviar inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <i className="fas fa-arrow-left"></i> <span>Volver al inicio</span>
          </a>
        </div>
      </div>
    </section>
  );
}
