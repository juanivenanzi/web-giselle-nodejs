"use client";

import { useState, useMemo, useCallback } from "react";
import type { GestionItem } from "@/lib/types";
import {
  TIPO_LABEL,
  ESTADO_LABEL,
  ESTADO_CLASES,
} from "@/lib/types";
import { useApp } from "@/context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faSearch, faFilePdf } from "@fortawesome/free-solid-svg-icons";

interface ProyectosClientProps {
  proyectosIniciales: GestionItem[];
}

export default function ProyectosClient({ proyectosIniciales }: ProyectosClientProps) {
  const { modo, tema } = useApp();
  const [vistaGrid, setVistaGrid] = useState(true);

  const [filtroAño, setFiltroAño] = useState("Todos");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const proyectos = proyectosIniciales;

  const años = useMemo(() => {
    return [
      "Todos",
      ...new Set(proyectos.map((p) => p.año).filter((a) => a > 0)),
    ].sort((a, b) =>
      a === "Todos" ? -1 : b === "Todos" ? 1 : Number(b) - Number(a)
    );
  }, [proyectos]);

  const tipos = useMemo(() => {
    return [
      "Todos",
      ...new Set(
        proyectos.map((p) => p.tipo).filter((t) => t && t !== "sin-tipo")
      ),
    ];
  }, [proyectos]);

  const estados = useMemo(() => {
    return [
      "Todos",
      ...new Set(
        proyectos.map((p) => p.estado).filter((e) => e && e !== "sin-estado")
      ),
    ];
  }, [proyectos]);

  const proyectosFiltrados = useMemo(() => {
    return proyectos.filter((proyecto) => {
      const matchAño =
        filtroAño === "Todos" || proyecto.año === Number(filtroAño);
      const matchTipo = filtroTipo === "Todos" || proyecto.tipo === filtroTipo;
      const matchEstado =
        filtroEstado === "Todos" || proyecto.estado === filtroEstado;
      const matchBusqueda =
        proyecto.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        proyecto.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      return matchAño && matchTipo && matchEstado && matchBusqueda;
    });
  }, [proyectos, filtroAño, filtroTipo, filtroEstado, busqueda]);

  const limpiarFiltros = useCallback(() => {
    setFiltroAño("Todos");
    setFiltroTipo("Todos");
    setFiltroEstado("Todos");
    setBusqueda("");
  }, []);

  const getEstadoBadge = (estado: string) => {
    return ESTADO_CLASES[estado] || "bg-gray-100 text-gray-600";
  };

  const getButtonStyles = (isActive: boolean) => {
    const isDark = tema === "oscuro";
    return {
      borderColor: isActive
        ? isDark
          ? "var(--color-destacado)"
          : "var(--color-primario)"
        : "var(--color-borde)",
      color: isActive
        ? isDark
          ? "var(--color-destacado)"
          : "var(--color-texto)"
        : "var(--color-texto-sec)",
      backgroundColor: isActive
        ? isDark
          ? "color-mix(in srgb, var(--color-destacado) 15%, var(--color-fondo-alt))"
          : "var(--color-fondo-alt)"
        : "transparent",
    };
  };

  return (
    <section
      className="pt-36 pb-25 px-4 sm:px-8 t-modo"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div className="max-w-7xl mx-auto">
        {modo === "institucional" ? (
          <div className="text-center mb-10">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Gestión
            </div>
            <h1
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "var(--color-texto)" }}
            >
              Mi trabajo en el Concejo
            </h1>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--color-texto-sec)" }}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              Probá combinar los filtros para encontrar lo que buscás.
            </p>
          </div>
        ) : (
          <div className="text-center mb-10">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Proyectos
            </div>
            <h1
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "var(--color-texto)" }}
            >
              Nuestro trabajo para Santo Tomé
            </h1>
            <p
              className="mt-3 text-base"
              style={{ color: "var(--color-texto-sec)" }}
            >
              Conocé nuestras propuestas para construir la ciudad que queremos.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <aside
            className="lg:w-72 shrink-0 p-4 rounded-xl"
            style={{
              backgroundColor: "var(--color-fondo-alt)",
              border: "1px solid var(--color-borde)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div className="flex flex-col lg:block">
              <h3
                className="font-semibold mb-4 text-sm hidden lg:block"
                style={{ color: "var(--color-texto)" }}
              >
                Filtros
              </h3>

              <div className="flex flex-wrap lg:flex-col gap-3 lg:gap-4">
                <div className="flex-1 min-w-30 lg:w-full">
                  <label
                    className="text-xs font-medium block"
                    style={{ color: "var(--color-texto)" }}
                  >
                    Buscar
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      placeholder="Título o descripción..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full p-2 pl-8 rounded-lg text-sm"
                      style={{
                        backgroundColor: "var(--color-fondo)",
                        border: "2px solid var(--color-borde)",
                        color: "var(--color-texto)",
                        outline: "none",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--color-primario)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "var(--color-borde)")
                      }
                    />
                    <FontAwesomeIcon
                      icon={faSearch}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs"
                      style={{ color: "var(--color-texto-sec)" }}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-20 lg:w-full">
                  <label
                    className="text-xs font-medium block"
                    style={{ color: "var(--color-texto)" }}
                  >
                    Año
                  </label>
                  <select
                    value={filtroAño}
                    onChange={(e) => setFiltroAño(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg text-sm appearance-none"
                    style={{
                      backgroundColor: "var(--color-fondo)",
                      border: "2px solid var(--color-borde)",
                      color: "var(--color-texto)",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent("#666")}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "32px",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-primario)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--color-borde)")
                    }
                  >
                    {años.map((año) => (
                      <option key={año} value={año}>
                        {año}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-20 lg:w-full">
                  <label
                    className="text-xs font-medium block"
                    style={{ color: "var(--color-texto)" }}
                  >
                    Tipo
                  </label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg text-sm appearance-none"
                    style={{
                      backgroundColor: "var(--color-fondo)",
                      border: "2px solid var(--color-borde)",
                      color: "var(--color-texto)",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent("#666")}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "32px",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-primario)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--color-borde)")
                    }
                  >
                    {tipos.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {TIPO_LABEL[tipo] || tipo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-20 lg:w-full">
                  <label
                    className="text-xs font-medium block"
                    style={{ color: "var(--color-texto)" }}
                  >
                    Estado
                  </label>
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="w-full mt-1 p-2 rounded-lg text-sm appearance-none"
                    style={{
                      backgroundColor: "var(--color-fondo)",
                      border: "2px solid var(--color-borde)",
                      color: "var(--color-texto)",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent("#666")}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "32px",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor =
                        "var(--color-primario)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--color-borde)")
                    }
                  >
                    {estados.map((estado) => (
                      <option key={estado} value={estado}>
                        {ESTADO_LABEL[estado] || estado}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={limpiarFiltros}
                  className="w-full py-2.5 rounded-lg text-sm font-medium mt-1 lg:mt-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_0_0_var(--color-destacado)] hover:border-(--color-destacado) active:scale-95"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    border: "2px solid var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
              <p
                className="text-sm"
                style={{ color: "var(--color-texto-sec)" }}
              >
                Mostrando{" "}
                <strong style={{ color: "var(--color-texto)" }}>
                  {proyectosFiltrados.length}
                </strong>{" "}
                proyectos
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setVistaGrid(true)}
                  className={`p-2 rounded-lg border transition-all ${vistaGrid ? "shadow-sm" : ""}`}
                  style={getButtonStyles(vistaGrid)}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setVistaGrid(false)}
                  className={`p-2 rounded-lg border transition-all ${!vistaGrid ? "shadow-sm" : ""}`}
                  style={getButtonStyles(!vistaGrid)}
                >
                  ☰ Lista
                </button>
              </div>
            </div>

            {vistaGrid ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {proyectosFiltrados.map((proyecto) => {
                  const tieneEnlace =
                    proyecto.enlacePdf &&
                    proyecto.enlacePdf !== "" &&
                    proyecto.enlacePdf !== "#";
                  return (
                    <div
                      key={`${proyecto.titulo}-${proyecto.fecha}`}
                      className="p-4 rounded-xl border flex flex-col gap-1 transition-all hover:shadow-sm"
                      style={{
                        backgroundColor: "var(--color-fondo-alt)",
                        borderColor: "var(--color-borde)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-bold ${getEstadoBadge(proyecto.estado)}`}
                        >
                          {ESTADO_LABEL[proyecto.estado] || proyecto.estado}
                        </span>
                        <span
                          className="text-xs whitespace-nowrap"
                          style={{ color: "var(--color-texto-sec)" }}
                        >
                          {proyecto.fecha}
                        </span>
                      </div>
                      <h4
                        className="font-head font-medium text-base"
                        style={{ color: "var(--color-texto)" }}
                      >
                        {proyecto.titulo}
                      </h4>
                      <p
                        className="text-sm line-clamp-3"
                        style={{ color: "var(--color-texto-sec)" }}
                      >
                        {proyecto.descripcion}
                      </p>
                      <div
                        className="flex items-center justify-between mt-2 pt-2 border-t flex-wrap gap-1"
                        style={{ borderColor: "var(--color-borde)" }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-texto-sec)" }}
                        >
                          {TIPO_LABEL[proyecto.tipo] || proyecto.tipo}
                        </span>
                        {tieneEnlace ? (
                          <a
                            href={proyecto.enlacePdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium hover:underline whitespace-nowrap"
                            style={{ color: "var(--color-texto-sec)" }}
                          >
                            <FontAwesomeIcon icon={faFilePdf} className="mr-1" />
                            Ver
                          </a>
                        ) : (
                          <span
                            className="text-xs whitespace-nowrap"
                            style={{ color: "var(--color-texto-sec)" }}
                          >
                            <FontAwesomeIcon icon={faFilePdf} className="mr-1" />
                            No disponible
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="rounded-xl border overflow-x-auto"
                style={{ borderColor: "var(--color-borde)" }}
              >
                <table className="w-full text-sm min-w-150">
                  <thead style={{ backgroundColor: "var(--color-fondo-alt)" }}>
                    <tr>
                      <th
                        className="text-left p-3 font-medium"
                        style={{ color: "var(--color-texto-sec)", width: "35%" }}
                      >
                        Título
                      </th>
                      <th
                        className="text-left p-3 font-medium hidden sm:table-cell"
                        style={{ color: "var(--color-texto-sec)", width: "20%" }}
                      >
                        Tipo
                      </th>
                      <th
                        className="text-left p-3 font-medium hidden md:table-cell"
                        style={{ color: "var(--color-texto-sec)", width: "15%" }}
                      >
                        Fecha
                      </th>
                      <th
                        className="text-left p-3 font-medium"
                        style={{ color: "var(--color-texto-sec)", width: "20%" }}
                      >
                        Estado
                      </th>
                      <th
                        className="text-left p-3 font-medium"
                        style={{ color: "var(--color-texto-sec)", width: "20%" }}
                      >
                        Expediente
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectosFiltrados.map((proyecto, index) => {
                      const tieneEnlace =
                        proyecto.enlacePdf &&
                        proyecto.enlacePdf !== "" &&
                        proyecto.enlacePdf !== "#";
                      return (
                        <tr
                          key={`${proyecto.titulo}-${proyecto.fecha}`}
                          className="border-t transition-colors hover:brightness-95"
                          style={{
                            borderColor: "var(--color-borde)",
                            backgroundColor:
                              index % 2 === 0
                                ? "var(--color-fondo)"
                                : "var(--color-fondo-alt)",
                          }}
                        >
                          <td
                            className="p-3 font-medium wrap-break-word"
                            style={{ color: "var(--color-texto)" }}
                          >
                            {proyecto.titulo}
                          </td>
                          <td
                            className="p-3 hidden sm:table-cell"
                            style={{ color: "var(--color-texto-sec)" }}
                          >
                            {TIPO_LABEL[proyecto.tipo] || proyecto.tipo}
                          </td>
                          <td
                            className="p-3 hidden md:table-cell"
                            style={{ color: "var(--color-texto-sec)" }}
                          >
                            {proyecto.fecha}
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-bold ${getEstadoBadge(proyecto.estado)}`}
                            >
                              {ESTADO_LABEL[proyecto.estado] || proyecto.estado}
                            </span>
                          </td>
                          <td className="p-3">
                            {tieneEnlace ? (
                              <a
                                href={proyecto.enlacePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium hover:underline whitespace-nowrap"
                                style={{ color: "var(--color-texto-sec)" }}
                              >
                                <FontAwesomeIcon icon={faFilePdf} className="mr-1" />
                                Ver
                              </a>
                            ) : (
                              <span
                                className="text-xs whitespace-nowrap"
                                style={{ color: "var(--color-texto-sec)" }}
                              >
                                No disponible
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {proyectosFiltrados.length === 0 && (
              <p
                className="text-center py-10"
                style={{ color: "var(--color-texto-sec)" }}
              >
                No se encontraron proyectos con los filtros seleccionados.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}