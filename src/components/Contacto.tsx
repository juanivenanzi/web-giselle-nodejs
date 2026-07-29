"use client";

import { useState, useEffect } from "react";

export default function Contacto() {
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [asunto, setAsunto] = useState("");
  const [asuntoOpen, setAsuntoOpen] = useState(false);

  const asuntos = [
    { valor: "consulta-general", label: "Consulta general" },
    { valor: "propuesta", label: "Propuesta" },
    { valor: "reclamo", label: "Reclamo" },
    { valor: "voluntariado", label: "Quiero ser voluntario/a" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setMensaje("✅ ¡Mensaje enviado!");
      setTimeout(() => setMensaje(""), 3000);
    }, 1500);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".asunto-dropdown")) {
        setAsuntoOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => setAsuntoOpen(!asuntoOpen);

  const selectAsunto = (label: string) => {
    setAsunto(label);
    setAsuntoOpen(false);
  };

  return (
    <section
      className="py-28 px-8 t-modo"
      id="contacto"
      style={{ backgroundColor: "var(--color-fondo-alt)" }}
    >
      <div className="max-w-300 mx-auto">
        <div className="reveal text-center mb-14">
          <div className="reveal pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            Contacto
          </div>
          <h2
            className="font-head text-4xl lg:text-5xl font-semibold"
            style={{ color: "var(--color-texto)" }}
          >
            Escribime
          </h2>
          <p
            className="reveal reveal-delay-1 leading-relaxed mb-3.5 font-medium"
            style={{ color: "var(--color-texto-sec)" }}
          >
            Tu opinión es fundamental. No dudes en comunicarte.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="reveal text-center lg:text-left">
            <h3
              className="text-sm font-semibold mb-4"
              style={{ color: "var(--color-texto)" }}
            >
              Mis redes sociales
            </h3>
            <div className="flex gap-3 justify-center lg:justify-start">
              {[
                "facebook-f",
                "instagram",
                "x-twitter",
                "threads",
                "youtube",
              ].map((red, i) => (
                <a
                  key={i}
                  href="#"
                  className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    border: "2px solid var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                >
                  <i className={`fab fa-${red}`}></i>
                </a>
              ))}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="reveal reveal-delay-1 flex flex-col gap-4 relative"
          >
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  maxLength={100}
                  placeholder=" "
                  className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all bg-transparent"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label
                  htmlFor="nombre"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-texto) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-texto) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Nombre completo *
                </label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder=" "
                  className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all bg-transparent"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-texto) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-texto) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Email *
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  maxLength={20}
                  placeholder=" "
                  className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all bg-transparent"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label
                  htmlFor="telefono"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-texto) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-texto) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Teléfono
                </label>
              </div>
              <div className="form-group relative asunto-dropdown">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className={`w-full py-3.5 px-4 rounded-xl border-2 text-sm text-left t-modo transition-all flex items-center justify-between focus:outline-none bg-transparent ${asunto ? "text-(--color-texto)" : "text-(--color-texto-sec)"}`}
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: asunto
                      ? "var(--color-texto)"
                      : "var(--color-borde)",
                  }}
                >
                  <span>{asunto || "Seleccionar asunto"}</span>
                  <i
                    className={`fas fa-chevron-down text-xs transition-transform duration-200 ${asuntoOpen ? "rotate-180" : ""}`}
                  ></i>
                </button>
                <label
                  className={`absolute left-4 text-sm text-(--color-texto-sec) transition-all duration-200 pointer-events-none bg-(--color-fondo) px-1 ${
                    asunto
                      ? "top-0 -translate-y-1/2 text-[0.65rem] font-semibold text-(--color-texto)"
                      : "top-1/2 -translate-y-1/2"
                  }`}
                >
                  Asunto
                </label>
                {asuntoOpen && (
                  <ul
                    className="absolute top-full left-0 right-0 mt-1 border-2 rounded-xl overflow-hidden shadow-xl z-50"
                    style={{
                      backgroundColor: "var(--color-fondo)",
                      borderColor: "var(--color-borde)",
                    }}
                  >
                    {asuntos.map((a) => (
                      <li
                        key={a.valor}
                        className="px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-(--color-fondo-alt)"
                        style={{ color: "var(--color-texto)" }}
                        onClick={() => selectAsunto(a.label)}
                      >
                        {a.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="form-group">
              <textarea
                id="mensaje"
                name="mensaje"
                required
                placeholder=" "
                rows={5}
                className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all resize-y min-h-30 bg-transparent"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  borderColor: "var(--color-borde)",
                  color: "var(--color-texto)",
                }}
              ></textarea>
              <label
                htmlFor="mensaje"
                className="absolute left-4 top-4 text-sm text-(--color-texto-sec) transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-texto) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-texto) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
              >
                Mensaje *
              </label>
            </div>
            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
              <button
                type="submit"
                disabled={enviando}
                className="btn-enviar inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl shrink-0"
              >
                <i className="fas fa-paper-plane"></i>{" "}
                {enviando ? "Enviando..." : "Enviar mensaje"}
              </button>
              <div
                className="flex flex-col items-center text-center sm:items-start sm:text-left gap-1"
                style={{ color: "var(--color-texto-sec)" }}
              >
                <p className="text-sm">
                  * Los campos marcados son obligatorios.
                </p>
                <span className="text-sm leading-tight">
                  Asunto se cerrará automáticamente luego de 4 segundos si no
                  seleccionás una opción.
                </span>
              </div>
            </div>
            {mensaje && (
              <p
                className="text-center text-sm font-medium"
                style={{ color: "var(--color-destacado)" }}
              >
                {mensaje}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
