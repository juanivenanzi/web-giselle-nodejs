"use client";

import {
  useActionState,
  useEffect,
  useState,
  useRef,
  useTransition,
} from "react";
import { enviarContacto, type ContactoState } from "@/actions/contacto";
import { z } from "zod";

// ✅ Constantes de validación (compartidas con Voluntariado)
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

// --- Esquema de validación en cliente (usando Zod) ---
const contactoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre es requerido (mínimo 2 caracteres)")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .regex(
      VALIDACIONES.nombre,
      "El nombre solo puede contener letras y espacios",
    ),
  email: z.string().email("Email inválido. Usá formato: nombre@dominio.com"),
  telefono: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        VALIDACIONES.telefono.test(val.replace(/\s/g, "")) ||
        val === "",
      "Teléfono inválido. Usá formato: 11 1234-5678 o similar",
    ),
  asunto: z.string().min(1, "Debes seleccionar un asunto"),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede superar los 1000 caracteres")
    .refine(
      (val) => !VALIDACIONES.spam.some((pattern) => pattern.test(val)),
      "El mensaje contiene contenido sospechoso. Por favor, revisá tu texto.",
    ),
});

const initialState: ContactoState = {
  errors: {},
  message: "",
  success: false,
};

// Definir tipos para los campos del formulario
type ContactFormFields = "nombre" | "email" | "telefono" | "asunto" | "mensaje";

export default function Contacto() {
  // ✅ useActionState con su estado y función
  const [state, formAction, isPending] = useActionState(
    enviarContacto,
    initialState,
  );

  // ✅ Estados locales
  const [asunto, setAsunto] = useState("");
  const [asuntoOpen, setAsuntoOpen] = useState(false);
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<ContactFormFields, string>>
  >({});
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  // ✅ useTransition para manejar el envío
  const [isTransitioning, startTransition] = useTransition();

  // Opciones del dropdown (sin "Quiero ser voluntario/a")
  const asuntos = [
    { valor: "consulta-general", label: "Consulta general" },
    { valor: "propuesta", label: "Propuesta" },
    { valor: "reclamo", label: "Reclamo" },
  ];

  // Cerrar dropdown al hacer clic fuera
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

  // Resetear formulario después de envío exitoso
  useEffect(() => {
    if (state.success) {
      setAsunto("");
      setLocalErrors({});
      formRef.current?.reset();
    }
  }, [state.success]);

  const toggleDropdown = () => setAsuntoOpen(!asuntoOpen);
  const selectAsunto = (label: string) => {
    setAsunto(label);
    setAsuntoOpen(false);
    setLocalErrors((prev) => ({ ...prev, asunto: "" }));
  };

  // ✅ Función para obtener errores con tipado seguro
  const getFieldError = (field: ContactFormFields): string | undefined => {
    if (localErrors[field]) {
      return localErrors[field];
    }

    if (state.errors && typeof state.errors === "object") {
      const errorValue = state.errors[field as keyof typeof state.errors];
      if (Array.isArray(errorValue) && errorValue.length > 0) {
        return errorValue[0];
      }
    }

    return undefined;
  };

  // --- Validación y envío ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalErrors({});

    const formData = new FormData(e.currentTarget);

    // 1. Honeypot básico
    if (formData.get("website")) return;

    // 2. Validación en cliente con Zod
    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      telefono: formData.get("telefono")?.toString().trim() || "",
      asunto: asunto,
      mensaje: formData.get("mensaje")?.toString().trim() || "",
    };

    try {
      contactoSchema.parse(rawData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<ContactFormFields, string>> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0]?.toString() as ContactFormFields;
          if (path) {
            errors[path] = issue.message;
          }
        });
        setLocalErrors(errors);
        return;
      }
    }

    // 3. Rate limiting (3 segundos)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      setLocalErrors({
        general: "Por favor, espera 3 segundos entre envíos",
      } as any);
      return;
    }
    setLastSubmitTime(now);

    // ✅ 4. Enviar con Server Action dentro de startTransition
    startTransition(() => {
      formAction(formData);
    });
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
            style={{
              color: "color-mix(in srgb, var(--color-texto) 75%, transparent)",
            }}
          >
            Tu opinión es fundamental. No dudes en comunicarte.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="reveal text-center lg:text-left">
            <h3
              className="text-sm font-semibold mb-4"
              style={{
                color:
                  "color-mix(in srgb, var(--color-texto) 80%, transparent)",
              }}
            >
              Mis redes sociales
            </h3>
            <div className="flex gap-3 justify-center lg:justify-start">
              {/* ✅ FACEBOOK */}
              <a
                href="https://www.facebook.com/giselle.miravete"
                target="_blank"
                rel="noopener noreferrer"
                className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  border: "2px solid var(--color-borde)",
                  color: "var(--color-texto)",
                }}
                aria-label="Facebook de Giselle Miravete"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              {/* ✅ INSTAGRAM */}
              <a
                href="https://www.instagram.com/giselmiravete/"
                target="_blank"
                rel="noopener noreferrer"
                className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  border: "2px solid var(--color-borde)",
                  color: "var(--color-texto)",
                }}
                aria-label="Instagram de Giselle Miravete"
              >
                <i className="fab fa-instagram"></i>
              </a>
              {/* ✅ X (TWITTER) */}
              <a
                href="https://x.com/giselmira"
                target="_blank"
                rel="noopener noreferrer"
                className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  border: "2px solid var(--color-borde)",
                  color: "var(--color-texto)",
                }}
                aria-label="X de Giselle Miravete"
              >
                <i className="fab fa-x-twitter"></i>
              </a>
              {/* ✅ THREADS */}
              <a
                href="https://www.threads.com/@giselmiravete"
                target="_blank"
                rel="noopener noreferrer"
                className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  border: "2px solid var(--color-borde)",
                  color: "var(--color-texto)",
                }}
                aria-label="Threads de Giselle Miravete"
              >
                <i className="fab fa-threads"></i>
              </a>
              {/* ✅ YOUTUBE */}
              <a
                href="https://www.youtube.com/@GiselleMiravete"
                target="_blank"
                rel="noopener noreferrer"
                className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  border: "2px solid var(--color-borde)",
                  color: "var(--color-texto)",
                }}
                aria-label="YouTube de Giselle Miravete"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* ✅ FORMULARIO SIN TARJETA - Mismo estilo que Voluntariado */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="reveal reveal-delay-1 flex flex-col gap-4 relative"
          >
            {/* Honeypot oculto */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
              <input
                type="text"
                id="timestamp"
                name="timestamp"
                tabIndex={-1}
                autoComplete="off"
                defaultValue={Date.now()}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group relative">
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  required
                  maxLength={100}
                  placeholder=" "
                  className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: getFieldError("nombre")
                      ? "#dc2626"
                      : "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label
                  htmlFor="nombre"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Nombre completo *
                </label>
                {getFieldError("nombre") && (
                  <p className="text-xs text-red-600 mt-1">
                    {getFieldError("nombre")}
                  </p>
                )}
              </div>
              <div className="form-group relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder=" "
                  className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: getFieldError("email")
                      ? "#dc2626"
                      : "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Email *
                </label>
                {getFieldError("email") && (
                  <p className="text-xs text-red-600 mt-1">
                    {getFieldError("email")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group relative">
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  maxLength={20}
                  placeholder=" "
                  className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 bg-transparent"
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: getFieldError("telefono")
                      ? "#dc2626"
                      : "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label
                  htmlFor="telefono"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                >
                  Teléfono
                </label>
                {getFieldError("telefono") && (
                  <p className="text-xs text-red-600 mt-1">
                    {getFieldError("telefono")}
                  </p>
                )}
              </div>
              <div className="form-group relative asunto-dropdown">
                <input type="hidden" name="asunto" value={asunto} />
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className={`w-full py-3.5 px-4 rounded-xl border-2 text-sm text-left t-modo transition-all duration-300 flex items-center justify-between focus:outline-none bg-transparent ${
                    asunto ? "text-(--color-texto)" : "text-(--color-texto-sec)"
                  }`}
                  style={{
                    backgroundColor: "var(--color-fondo)",
                    borderColor: getFieldError("asunto")
                      ? "#dc2626"
                      : asunto
                        ? "var(--color-destacado)"
                        : "var(--color-borde)",
                  }}
                >
                  <span>{asunto || "Seleccionar"}</span>
                  <div className="flex items-center gap-2">
                    <i
                      className="fas fa-circle-question text-xs text-(--color-texto-sec) opacity-60 hover:opacity-100 transition-opacity"
                      title="Selecciona el tema de tu mensaje"
                    ></i>
                    <i
                      className={`fas fa-chevron-down text-xs transition-transform duration-300 ${
                        asuntoOpen ? "rotate-180" : ""
                      }`}
                    ></i>
                  </div>
                </button>
                <label
                  className={`absolute left-4 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none bg-(--color-fondo) px-1 ${
                    asunto
                      ? "top-0 -translate-y-1/2 text-[0.65rem] font-semibold text-(--color-destacado)"
                      : "top-1/2 -translate-y-1/2"
                  }`}
                >
                  Asunto *
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
                        className="px-4 py-3 text-sm cursor-pointer transition-all duration-200 hover:bg-(--color-fondo-alt) hover:pl-6"
                        style={{ color: "var(--color-texto)" }}
                        onClick={() => selectAsunto(a.label)}
                      >
                        {a.label}
                      </li>
                    ))}
                  </ul>
                )}
                {/* ✅ TEXTO GUÍA */}
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--color-texto-sec)" }}
                >
                  Haz click arriba en seleccionar y elige el asunto.
                </p>
                {getFieldError("asunto") && (
                  <p className="text-xs text-red-600 mt-1">
                    {getFieldError("asunto")}
                  </p>
                )}
              </div>
            </div>

            <div className="form-group relative">
              <textarea
                id="mensaje"
                name="mensaje"
                required
                placeholder=" "
                rows={5}
                maxLength={1000}
                className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 resize-y min-h-30 bg-transparent"
                style={{
                  backgroundColor: "var(--color-fondo)",
                  borderColor: getFieldError("mensaje")
                    ? "#dc2626"
                    : "var(--color-borde)",
                  color: "var(--color-texto)",
                }}
              />
              <label
                htmlFor="mensaje"
                className="absolute left-4 top-4 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
              >
                Mensaje *
              </label>
              {getFieldError("mensaje") && (
                <p className="text-xs text-red-600 mt-1">
                  {getFieldError("mensaje")}
                </p>
              )}
            </div>

            {/* Error general */}
            {(localErrors as any).general && (
              <p className="text-xs text-red-600 text-center">
                {(localErrors as any).general}
              </p>
            )}

            <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-6 pt-2">
              <button
                type="submit"
                disabled={isPending || isTransitioning}
                className="btn-enviar inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                style={{
                  backgroundColor:
                    isPending || isTransitioning
                      ? "#94a3b8"
                      : "var(--color-texto)",
                  color: "#ffffff",
                  border: `2px solid ${
                    isPending || isTransitioning
                      ? "#94a3b8"
                      : "var(--color-texto)"
                  }`,
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isPending || isTransitioning ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>Enviar mensaje</>
                  )}
                </span>
                <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <div
                className="flex flex-col items-center text-center sm:items-start sm:text-left gap-1"
                style={{ color: "var(--color-texto)" }}
              >
                <p className="text-sm font-medium">
                  <i className="fas fa-asterisk text-[0.5rem] align-top mr-1"></i>
                  Los campos marcados son obligatorios.
                </p>
              </div>
            </div>

            {state.message && (
              <p
                className={`text-center text-sm font-medium ${
                  state.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {state.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
