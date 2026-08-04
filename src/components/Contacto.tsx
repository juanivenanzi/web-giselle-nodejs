"use client";

import {
  useActionState,
  useEffect,
  useState,
  useRef,
  useTransition,
} from "react";
import { enviarContacto, type ContactoState } from "@/actions/contacto";
import { contactoSchema } from "@/lib/validaciones";
import { z } from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faChevronDown, faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faXTwitter, faThreads, faYoutube } from "@fortawesome/free-brands-svg-icons";
import AnimateOnScroll from "./AnimateOnScroll";

const initialState: ContactoState = {
  errors: {},
  message: "",
  success: false,
};

type ContactFormFields = keyof z.infer<typeof contactoSchema>;

export default function Contacto() {
  const [state, formAction, isPending] = useActionState(
    enviarContacto,
    initialState
  );

  const [asunto, setAsunto] = useState("");
  const [asuntoOpen, setAsuntoOpen] = useState(false);
  const [localErrors, setLocalErrors] = useState<
    Partial<Record<ContactFormFields, string>>
  >({});
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [isTransitioning, startTransition] = useTransition();

  const asuntos = [
    { valor: "consulta-general", label: "Consulta general" },
    { valor: "propuesta", label: "Propuesta" },
    { valor: "reclamo", label: "Reclamo" },
  ];

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

  useEffect(() => {
    if (state.success) {
      setAsunto("");
      setLocalErrors({});
      formRef.current?.reset();
    }
  }, [state.success]);

  const getFieldError = (field: ContactFormFields): string | undefined => {
    if (localErrors[field]) return localErrors[field];
    const errorVal = state.errors?.[field];
    return Array.isArray(errorVal) ? errorVal[0] : errorVal;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalErrors({});

    const formData = new FormData(e.currentTarget);
    if (formData.get("website")) return;

    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      telefono: formData.get("telefono")?.toString().trim() ?? "",
      asunto,
      mensaje: formData.get("mensaje")?.toString().trim() ?? "",
      timestamp: formData.get("timestamp")?.toString() ?? String(Date.now()),
    };

    try {
      contactoSchema.parse(rawData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<ContactFormFields, string>> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0]?.toString() as ContactFormFields | undefined;
          if (path) errors[path] = issue.message;
        });
        setLocalErrors(errors);
        return;
      }
      throw error;
    }

    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      setLocalErrors({
        general: "Por favor, espera 3 segundos entre envíos",
      } as any);
      return;
    }
    setLastSubmitTime(now);

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
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">
              Contacto
            </div>
            <h2
              className="font-head text-4xl lg:text-5xl font-semibold"
              style={{ color: "var(--color-texto)" }}
            >
              Escribime
            </h2>
            <p
              className="leading-relaxed mb-3.5 font-medium"
              style={{
                color: "color-mix(in srgb, var(--color-texto) 75%, transparent)",
              }}
            >
              Tu opinión es fundamental. No dudes en comunicarte.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <AnimateOnScroll>
            <div className="text-center lg:text-left">
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
                <a href="https://www.facebook.com/giselle.miravete" target="_blank" rel="noopener noreferrer" className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "var(--color-fondo)", border: "2px solid var(--color-borde)", color: "var(--color-texto)" }} aria-label="Facebook de Giselle Miravete">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="https://www.instagram.com/giselmiravete/" target="_blank" rel="noopener noreferrer" className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "var(--color-fondo)", border: "2px solid var(--color-borde)", color: "var(--color-texto)" }} aria-label="Instagram de Giselle Miravete">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://x.com/giselmira" target="_blank" rel="noopener noreferrer" className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "var(--color-fondo)", border: "2px solid var(--color-borde)", color: "var(--color-texto)" }} aria-label="X de Giselle Miravete">
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
                <a href="https://www.threads.com/@giselmiravete" target="_blank" rel="noopener noreferrer" className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "var(--color-fondo)", border: "2px solid var(--color-borde)", color: "var(--color-texto)" }} aria-label="Threads de Giselle Miravete">
                  <FontAwesomeIcon icon={faThreads} />
                </a>
                <a href="https://www.youtube.com/@GiselleMiravete" target="_blank" rel="noopener noreferrer" className="red-social w-11 h-11 rounded-xl grid place-items-center transition-all duration-300 hover:scale-110 hover:shadow-lg" style={{ backgroundColor: "var(--color-fondo)", border: "2px solid var(--color-borde)", color: "var(--color-texto)" }} aria-label="YouTube de Giselle Miravete">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className="reveal-delay-1">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 relative"
            >
              <div className="absolute left-[-9999px]" aria-hidden="true">
                <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                <input type="text" id="timestamp" name="timestamp" tabIndex={-1} autoComplete="off" defaultValue={Date.now()} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nombre */}
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
                      borderColor: getFieldError("nombre") ? "#dc2626" : "var(--color-borde)",
                      color: "var(--color-texto)",
                    }}
                  />
                  <label htmlFor="nombre" className="label-flotante">
                    Nombre completo *
                  </label>
                  {getFieldError("nombre") && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError("nombre")}</p>
                  )}
                </div>

                {/* Email */}
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
                      borderColor: getFieldError("email") ? "#dc2626" : "var(--color-borde)",
                      color: "var(--color-texto)",
                    }}
                  />
                  <label htmlFor="email" className="label-flotante">
                    Email *
                  </label>
                  {getFieldError("email") && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError("email")}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Teléfono */}
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
                      borderColor: getFieldError("telefono") ? "#dc2626" : "var(--color-borde)",
                      color: "var(--color-texto)",
                    }}
                  />
                  <label htmlFor="telefono" className="label-flotante">
                    Teléfono
                  </label>
                  {getFieldError("telefono") && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError("telefono")}</p>
                  )}
                </div>

                {/* Asunto (dropdown) */}
                <div className="form-group relative asunto-dropdown">
                  <input type="hidden" name="asunto" value={asunto} />
                  <button
                    type="button"
                    onClick={() => setAsuntoOpen(!asuntoOpen)}
                    className={`peer w-full py-3.5 px-4 rounded-xl border-2 text-sm text-left t-modo transition-all duration-300 flex items-center justify-between focus:outline-none bg-transparent ${
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
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-xs transition-transform duration-300 ${asuntoOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>
                  <label
                    className={`label-flotante ${asunto ? "activo" : ""}`}
                    style={{ backgroundColor: "var(--color-fondo)" }}
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
                          onClick={() => {
                            setAsunto(a.label);
                            setAsuntoOpen(false);
                            setLocalErrors((prev) => ({ ...prev, asunto: "" }));
                          }}
                        >
                          {a.label}
                        </li>
                      ))}
                    </ul>
                  )}
                  {getFieldError("asunto") && (
                    <p className="text-xs text-red-600 mt-1">{getFieldError("asunto")}</p>
                  )}
                </div>
              </div>

              {/* Mensaje */}
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
                    borderColor: getFieldError("mensaje") ? "#dc2626" : "var(--color-borde)",
                    color: "var(--color-texto)",
                  }}
                />
                <label htmlFor="mensaje" className="label-flotante textarea">
                  Mensaje *
                </label>
                {getFieldError("mensaje") && (
                  <p className="text-xs text-red-600 mt-1">{getFieldError("mensaje")}</p>
                )}
              </div>

              {(localErrors as any).general && (
                <p className="text-xs text-red-600 text-center">
                  {(localErrors as any).general}
                </p>
              )}

              {/* Botón + texto obligatorio */}
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 pt-2">
                <button
                  type="submit"
                  disabled={isPending || isTransitioning}
                  className="btn-enviar inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    backgroundColor: isPending || isTransitioning ? "#94a3b8" : "var(--color-texto)",
                    color: "#ffffff",
                    border: `2px solid ${isPending || isTransitioning ? "#94a3b8" : "var(--color-texto)"}`,
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isPending || isTransitioning ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>Enviar mensaje</>
                    )}
                  </span>
                  <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
                <div className="flex flex-col items-center text-center sm:items-end sm:text-right gap-1" style={{ color: "var(--color-texto)" }}>
                  <p className="text-sm font-medium">
                    Los campos marcados con * son obligatorios.
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
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}