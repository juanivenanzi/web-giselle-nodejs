"use client";

import { useState, useEffect, useTransition } from "react";
import { submitVoluntario } from "@/app/actions/voluntario";

// Función de validación en cliente
const validateForm = (formData: FormData) => {
  const nombre = formData.get("nombre")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const telefono = formData.get("telefono")?.toString().trim() || "";
  const mensaje = formData.get("mensaje")?.toString().trim() || "";

  const errors: Record<string, string> = {};

  if (!nombre || nombre.length < 2) {
    errors.nombre = "El nombre es requerido (mínimo 2 caracteres)";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Email inválido";
  }
  if (telefono && !/^[\d\s\-+()]{7,20}$/.test(telefono)) {
    errors.telefono = "Teléfono inválido";
  }
  if (mensaje && mensaje.length > 500) {
    errors.mensaje = "El mensaje no puede superar los 500 caracteres";
  }

  return errors;
};

export default function Voluntariado() {
  // Estados del componente
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [modo, setModo] = useState("institucional");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // Detectar cambios de modo (institucional/campaña)
  useEffect(() => {
    const modoGuardado = localStorage.getItem("gm-modo") || "institucional";
    setModo(modoGuardado);

    const observer = new MutationObserver(() => {
      const nuevoModo =
        document.documentElement.getAttribute("data-modo") || "institucional";
      setModo(nuevoModo);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-modo"],
    });
    return () => observer.disconnect();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrores({});

    const formData = new FormData(e.currentTarget);

    // Validación en cliente
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors);
      return;
    }

    setEnviando(true);

    startTransition(async () => {
      try {
        const result = await submitVoluntario(formData);

        if (result.success) {
          setMensaje(
            `✅ ${result.message || "¡Gracias por sumarte! Tus datos fueron enviados correctamente."}`,
          );
          e.currentTarget.reset();
          setTimeout(() => setMensaje(""), 5000);
        } else {
          setMensaje(
            `❌ ${result.error || "No se pudo enviar. Intentá nuevamente."}`,
          );
        }
      } catch (error) {
        setMensaje(
          "❌ Ocurrió un error inesperado. Por favor, intentá más tarde.",
        );
        console.error("Error en handleSubmit:", error);
      } finally {
        setEnviando(false);
      }
    });
  };

  return (
    <section
      className="py-25 px-8 t-modo relative"
      id="voluntariado"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div className="max-w-300 mx-auto">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Columna izquierda: información */}
          <div className="lg:col-span-2 reveal text-center lg:text-left">
            <div className="reveal pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
              VOLUNTARIADO
            </div>
            <h2
              className="font-head text-4xl lg:text-5xl font-semibold mb-4"
              style={{ color: "var(--color-texto)" }}
            >
              {modo === "institucional" ? "Anotate" : "Sumate"}
            </h2>
            <div className="w-20 h-1 bg-(--color-destacado) rounded-full mb-4 lg:mx-0 mx-auto" />
            <p
              className="reveal reveal-delay-1 leading-relaxed text-lg"
              style={{
                color:
                  "color-mix(in srgb, var(--color-texto) 85%, transparent)",
              }}
            >
              {modo === "institucional"
                ? "Si querés participar activamente, dejá tus datos."
                : "Santo Tomé se construye entre todos. Anotate."}
            </p>
          </div>

          {/* Columna derecha: formulario */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="reveal reveal-delay-1 flex flex-col gap-4 relative bg-(--color-fondo-alt) p-6 md:p-8 rounded-2xl shadow-lg border border-(--color-borde) t-modo"
            >
              {/* Honeypot mejorado con timestamp */}
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <input
                  type="text"
                  id="volWebsite"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue=""
                />
                <input
                  type="text"
                  id="volTimestamp"
                  name="timestamp"
                  tabIndex={-1}
                  autoComplete="off"
                  defaultValue={Date.now()}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group flex flex-col gap-1.5">
                  <input
                    type="text"
                    id="volNombre"
                    name="nombre"
                    required
                    maxLength={100}
                    placeholder=" "
                    className="peer py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-borde) text-sm text-(--color-texto) t-modo transition-all duration-300 focus:outline-none focus:border-(--color-destacado) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-destacado)_15%,transparent)]"
                    aria-describedby="nombre-error"
                  />
                  <label
                    htmlFor="volNombre"
                    className="text-xs font-medium px-1 -mt-1"
                    style={{ color: "var(--color-texto-sec)" }}
                  >
                    Nombre completo *
                  </label>
                  {errores.nombre && (
                    <p id="nombre-error" className="text-xs text-red-500 mt-1">
                      {errores.nombre}
                    </p>
                  )}
                </div>
                <div className="form-group flex flex-col gap-1.5">
                  <input
                    type="email"
                    id="volEmail"
                    name="email"
                    required
                    placeholder=" "
                    className="peer py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-borde) text-sm text-(--color-texto) t-modo transition-all duration-300 focus:outline-none focus:border-(--color-destacado) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-destacado)_15%,transparent)]"
                    aria-describedby="email-error"
                  />
                  <label
                    htmlFor="volEmail"
                    className="text-xs font-medium px-1 -mt-1"
                    style={{ color: "var(--color-texto-sec)" }}
                  >
                    Email *
                  </label>
                  {errores.email && (
                    <p id="email-error" className="text-xs text-red-500 mt-1">
                      {errores.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <input
                  type="tel"
                  id="volTelefono"
                  name="telefono"
                  maxLength={20}
                  placeholder=" "
                  className="peer py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-borde) text-sm text-(--color-texto) t-modo transition-all duration-300 focus:outline-none focus:border-(--color-destacado) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-destacado)_15%,transparent)]"
                  aria-describedby="telefono-error"
                />
                <label
                  htmlFor="volTelefono"
                  className="text-xs font-medium px-1 -mt-1"
                  style={{ color: "var(--color-texto-sec)" }}
                >
                  Teléfono
                </label>
                {errores.telefono && (
                  <p id="telefono-error" className="text-xs text-red-500 mt-1">
                    {errores.telefono}
                  </p>
                )}
              </div>

              <div className="form-group flex flex-col gap-1.5">
                <textarea
                  id="volMensaje"
                  name="mensaje"
                  placeholder=" "
                  rows={4}
                  maxLength={500}
                  className="peer py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-borde) text-sm text-(--color-texto) t-modo transition-all duration-300 focus:outline-none focus:border-(--color-destacado) focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-destacado)_15%,transparent)] resize-y min-h-25"
                  aria-describedby="mensaje-error"
                />
                <label
                  htmlFor="volMensaje"
                  className="text-xs font-medium px-1 -mt-1"
                  style={{ color: "var(--color-texto-sec)" }}
                >
                  ¿En qué actividad te gustaría participar? (máx. 500
                  caracteres)
                </label>
                {errores.mensaje && (
                  <p id="mensaje-error" className="text-xs text-red-500 mt-1">
                    {errores.mensaje}
                  </p>
                )}
              </div>

              <div className="flex flex-col items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={enviando || isPending}
                  className="btn-voluntario inline-flex items-center justify-center px-10 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed min-w-45"
                >
                  {enviando || isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </span>
                  ) : (
                    "Enviar datos"
                  )}
                </button>
                {mensaje && (
                  <p
                    className={`text-center text-sm font-medium ${
                      mensaje.includes("✅") ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {mensaje}
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
