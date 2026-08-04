// src/components/Voluntariado.tsx
"use client";

import { useState, useTransition, useRef } from "react";
import { enviarVoluntario, type VoluntarioState } from "@/actions/voluntario";
import { voluntarioSchema } from "@/lib/validaciones";
import { z } from "zod";
import { useApp } from "@/context/AppContext";
import { TIPO_MODO } from "@/config/modo";
import AnimateOnScroll from "./AnimateOnScroll";

const initialState: VoluntarioState = {
  errors: {},
  message: "",
  success: false,
};

export default function Voluntariado() {
  const { modo } = useApp();
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const esCampania = modo === TIPO_MODO.CAMPANIA;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrores({});

    const formData = new FormData(e.currentTarget);
    if (formData.get("website")) return;

    const rawData = {
      nombre: formData.get("nombre")?.toString().trim() ?? "",
      email: formData.get("email")?.toString().trim() ?? "",
      telefono: formData.get("telefono")?.toString().trim() ?? "",
      mensaje: formData.get("mensaje")?.toString().trim() ?? "",
      timestamp: formData.get("timestamp")?.toString() ?? String(Date.now()),
    };

    try {
      voluntarioSchema.parse(rawData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0]?.toString() ?? "general";
          errors[path] = issue.message;
        });
        setErrores(errors);
        return;
      }
      throw error;
    }

    setEnviando(true);
    startTransition(async () => {
      try {
        const result = await enviarVoluntario(initialState, formData);
        if (result.success) {
          setMensaje(
            `✅ ${result.message || "¡Gracias por sumarte! Tus datos fueron enviados correctamente."}`
          );
          formRef.current?.reset();
          setTimeout(() => setMensaje(""), 5000);
        } else {
          if (result.errors) {
            const serverErrors: Record<string, string> = {};
            Object.entries(result.errors).forEach(([key, val]) => {
              if (Array.isArray(val) && val.length) serverErrors[key] = val[0];
            });
            setErrores(serverErrors);
          }
          setMensaje(
            `❌ ${result.message || "No se pudo enviar. Intentá nuevamente."}`
          );
        }
      } catch (error) {
        setMensaje("❌ Ocurrió un error inesperado. Por favor, intentá más tarde.");
        console.error(error);
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
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Columna de texto (2/5) */}
          <AnimateOnScroll className="lg:col-span-2">
            <div className="text-center lg:text-left">
              <div className="pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                VOLUNTARIADO
              </div>
              <h2
                className="font-head text-4xl lg:text-5xl font-semibold mb-4"
                style={{ color: "var(--color-texto)" }}
              >
                {esCampania ? "Sumate" : "Anotate"}
              </h2>
              <div className="w-20 h-1 bg-(--color-destacado) rounded-full mb-4 lg:mx-0 mx-auto" />
              <p
                className="leading-relaxed text-lg"
                style={{
                  color: "color-mix(in srgb, var(--color-texto) 75%, transparent)",
                }}
              >
                {esCampania
                  ? "Santo Tomé se construye entre todos. Anotate."
                  : "Si querés participar activamente, dejá tus datos."}
              </p>
            </div>
          </AnimateOnScroll>

          {/* Columna del formulario (3/5) */}
          <div className="lg:col-span-3">
            <AnimateOnScroll className="reveal-delay-1">
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 relative"
              >
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <input type="text" id="volWebsite" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                  <input type="text" id="volTimestamp" name="timestamp" tabIndex={-1} autoComplete="off" defaultValue={Date.now()} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group relative">
                    <input
                      type="text"
                      id="volNombre"
                      name="nombre"
                      required
                      maxLength={100}
                      placeholder=" "
                      className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 bg-transparent"
                      style={{
                        backgroundColor: "var(--color-fondo)",
                        borderColor: errores.nombre ? "#dc2626" : "var(--color-borde)",
                        color: "var(--color-texto)",
                      }}
                    />
                    <label
                      htmlFor="volNombre"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                    >
                      Nombre completo *
                    </label>
                    {errores.nombre && (
                      <p className="text-xs text-red-500 mt-1">{errores.nombre}</p>
                    )}
                  </div>
                  <div className="form-group relative">
                    <input
                      type="email"
                      id="volEmail"
                      name="email"
                      required
                      placeholder=" "
                      className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 bg-transparent"
                      style={{
                        backgroundColor: "var(--color-fondo)",
                        borderColor: errores.email ? "#dc2626" : "var(--color-borde)",
                        color: "var(--color-texto)",
                      }}
                    />
                    <label
                      htmlFor="volEmail"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                    >
                      Email *
                    </label>
                    {errores.email && (
                      <p className="text-xs text-red-500 mt-1">{errores.email}</p>
                    )}
                  </div>
                </div>

                <div className="form-group relative">
                  <input
                    type="tel"
                    id="volTelefono"
                    name="telefono"
                    maxLength={20}
                    placeholder=" "
                    className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 bg-transparent"
                    style={{
                      backgroundColor: "var(--color-fondo)",
                      borderColor: errores.telefono ? "#dc2626" : "var(--color-borde)",
                      color: "var(--color-texto)",
                    }}
                  />
                  <label
                    htmlFor="volTelefono"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                  >
                    Teléfono
                  </label>
                  {errores.telefono && (
                    <p className="text-xs text-red-500 mt-1">{errores.telefono}</p>
                  )}
                  {!errores.telefono && (
                    <p className="text-xs mt-1.5" style={{ color: "var(--color-texto-sec)" }}>
                      Ejemplo: 3425478996
                    </p>
                  )}
                </div>

                <div className="form-group relative">
                  <textarea
                    id="volMensaje"
                    name="mensaje"
                    placeholder=" "
                    rows={4}
                    maxLength={500}
                    className="peer w-full py-3.5 px-4 rounded-xl border-2 text-sm t-modo focus:outline-none transition-all duration-300 resize-y min-h-25 bg-transparent"
                    style={{
                      backgroundColor: "var(--color-fondo)",
                      borderColor: errores.mensaje ? "#dc2626" : "var(--color-borde)",
                      color: "var(--color-texto)",
                    }}
                  />
                  <label
                    htmlFor="volMensaje"
                    className="absolute left-4 top-4 text-sm text-(--color-texto-sec) transition-all duration-300 pointer-events-none peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.65rem] peer-focus:font-semibold peer-focus:text-(--color-destacado) peer-focus:bg-(--color-fondo) peer-focus:px-1 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[0.65rem] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:text-(--color-destacado) peer-not-placeholder-shown:bg-(--color-fondo) peer-not-placeholder-shown:px-1"
                  >
                    ¿En qué actividad te gustaría participar? (máx. 500 caracteres)
                  </label>
                  {errores.mensaje && (
                    <p className="text-xs text-red-500 mt-1">{errores.mensaje}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6 pt-2">
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
                  <div className="flex flex-col items-center text-center sm:items-end sm:text-right gap-1" style={{ color: "var(--color-texto)" }}>
                    <p className="text-sm font-medium">
                      Los campos marcados con * son obligatorios.
                    </p>
                  </div>
                </div>

                {mensaje && (
                  <p
                    className={`text-center text-sm font-medium ${
                      mensaje.includes("✅") ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {mensaje}
                  </p>
                )}
              </form>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}