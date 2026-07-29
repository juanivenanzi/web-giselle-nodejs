"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { enviarVoluntario, type VoluntarioState } from "@/actions/voluntario";

// ✅ Constantes de validación mejoradas y centralizadas
const VALIDACIONES = {
  // 📧 Email
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // 📞 Teléfono argentino (con formato flexible)
  telefono:
    /^(?:(?:\(?(?:0?11|0?[1-9][0-9]{2})\)?[\s-]?)?(?:15)?[\s-]?[0-9]{7,8}|[0-9]{7,10})$/,
  // 👤 Nombre (solo letras y espacios)
  nombre: /^[a-zA-ZáéíóúñÑüÜ\s]+$/,
  // 🛡️ Patrones de spam
  spam: [
    /http[s]?:\/\//i,
    /www\./i,
    /gana\s+dinero/i,
    /oferta\s+limitada/i,
    /click\s+aquí/i,
    /visita\s+mi\s+sitio/i,
  ],
};

// Función de validación en cliente mejorada
const validateForm = (formData: FormData) => {
  const nombre = formData.get("nombre")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const telefono = formData.get("telefono")?.toString().trim() || "";
  const mensaje = formData.get("mensaje")?.toString().trim() || "";

  const errors: Record<string, string> = {};

  // 👤 Validación de nombre
  if (!nombre || nombre.length < 2) {
    errors.nombre = "El nombre es requerido (mínimo 2 caracteres)";
  } else if (!VALIDACIONES.nombre.test(nombre)) {
    errors.nombre = "El nombre solo puede contener letras y espacios";
  } else if (nombre.length > 100) {
    errors.nombre = "El nombre no puede superar los 100 caracteres";
  }

  // 📧 Validación de email
  if (!email) {
    errors.email = "El email es requerido";
  } else if (!VALIDACIONES.email.test(email)) {
    errors.email = "Email inválido. Usá formato: nombre@dominio.com";
  }

  // 📞 Validación de teléfono (opcional pero con formato)
  if (telefono) {
    const telefonoLimpio = telefono.replace(/\s/g, "");
    if (!VALIDACIONES.telefono.test(telefonoLimpio)) {
      errors.telefono =
        "Teléfono inválido. Usá formato: 11 1234-5678 o similar";
    }
  }

  // 💬 Validación de mensaje
  if (mensaje) {
    if (mensaje.length > 500) {
      errors.mensaje = "El mensaje no puede superar los 500 caracteres";
    } else if (VALIDACIONES.spam.some((pattern) => pattern.test(mensaje))) {
      errors.mensaje =
        "El mensaje contiene contenido sospechoso. Por favor, revisá tu texto.";
    }
  }

  return errors;
};

const initialState: VoluntarioState = {
  errors: {},
  message: "",
  success: false,
};

export default function Voluntariado() {
  // ✅ Todos los estados declarados correctamente
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [modo, setModo] = useState("institucional");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  // ✅ Referencia al formulario
  const formRef = useRef<HTMLFormElement>(null);

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

    // ✅ Validación en cliente
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrores(validationErrors);
      return;
    }

    setEnviando(true);

    startTransition(async () => {
      try {
        // ✅ Usar la función correcta con estado inicial
        const result = await enviarVoluntario(initialState, formData);

        if (result.success) {
          setMensaje(
            `✅ ${result.message || "¡Gracias por sumarte! Tus datos fueron enviados correctamente."}`,
          );

          // ✅ Usar la referencia al formulario para resetear
          if (formRef.current) {
            formRef.current.reset();
          }

          setTimeout(() => setMensaje(""), 5000);
        } else {
          // ✅ Mostrar errores del servidor si existen
          if (result.errors) {
            const serverErrors: Record<string, string> = {};
            Object.keys(result.errors).forEach((key) => {
              const errorMessages =
                result.errors?.[key as keyof typeof result.errors];
              if (Array.isArray(errorMessages) && errorMessages.length > 0) {
                serverErrors[key] = errorMessages[0];
              }
            });
            setErrores(serverErrors);
          }
          setMensaje(
            `❌ ${result.message || "No se pudo enviar. Intentá nuevamente."}`,
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
              ref={formRef} // ✅ Asignar la referencia al formulario
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
                <div className="form-group flex flex-col gap-1.5 relative">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                  >
                    Nombre completo *
                  </label>
                  {errores.nombre && (
                    <p id="nombre-error" className="text-xs text-red-500 mt-1">
                      {errores.nombre}
                    </p>
                  )}
                </div>
                <div className="form-group flex flex-col gap-1.5 relative">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
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

              <div className="form-group flex flex-col gap-1.5 relative">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Teléfono
                </label>
                {errores.telefono && (
                  <p id="telefono-error" className="text-xs text-red-500 mt-1">
                    {errores.telefono}
                  </p>
                )}
              </div>

              <div className="form-group flex flex-col gap-1.5 relative">
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
                  className="absolute left-4 top-4 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
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
