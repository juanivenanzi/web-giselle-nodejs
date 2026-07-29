'use client'

import { useState, useEffect } from 'react'

export default function Voluntariado() {
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [modo, setModo] = useState('institucional')

  useEffect(() => {
    const modoGuardado = localStorage.getItem('gm-modo') || 'institucional'
    setModo(modoGuardado)

    const observer = new MutationObserver(() => {
      const nuevoModo = document.documentElement.getAttribute('data-modo') || 'institucional'
      setModo(nuevoModo)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-modo'] })
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      setMensaje('✅ ¡Gracias por sumarte!')
      setTimeout(() => setMensaje(''), 3000)
    }, 1500)
  }

  return (
    <section className="py-25 px-8 t-modo" id="voluntariado" style={{ backgroundColor: 'var(--color-fondo)' }}>
      <div className="max-w-300 mx-auto">
        <div className="reveal text-center mb-14">
          <div className="reveal pill-magica inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-3">Voluntariado</div>
          <h2 className="font-head text-4xl lg:text-5xl font-semibold" style={{ color: 'var(--color-texto)' }}>{modo === 'institucional' ? 'Voluntariado' : 'Sumate'}</h2>
          <p className="reveal reveal-delay-1 leading-relaxed mb-3.5 font-medium" style={{ color: 'color-mix(in srgb, var(--color-texto) 85%, transparent)' }}>
            {modo === 'institucional' 
              ? 'Si querés participar activamente, dejá tus datos.'
              : 'Santo Tomé se construye entre todos. Anotate.'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="reveal reveal-delay-1 flex flex-col gap-4 relative max-w-2xl mx-auto">
          <div className="absolute left-[-9999px]" aria-hidden="true">
            <input type="text" id="volWebsite" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group flex flex-col gap-1.5">
              <input type="text" id="volNombre" name="nombre" required maxLength={100} placeholder=" " className="py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-texto-sec) text-sm text-(--color-texto) t-modo focus:outline-none focus:border-(--color-texto)" />
              <label htmlFor="volNombre">Nombre completo *</label>
            </div>
            <div className="form-group flex flex-col gap-1.5">
              <input type="email" id="volEmail" name="email" required placeholder=" " className="py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-texto-sec) text-sm text-(--color-texto) t-modo focus:outline-none focus:border-(--color-texto)" />
              <label htmlFor="volEmail">Email *</label>
            </div>
          </div>
          <div className="form-group flex flex-col gap-1.5">
            <input type="tel" id="volTelefono" name="telefono" maxLength={20} placeholder=" " className="py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-texto-sec) text-sm text-(--color-texto) t-modo focus:outline-none focus:border-(--color-texto)" />
            <label htmlFor="volTelefono">Teléfono</label>
          </div>
          <div className="form-group flex flex-col gap-1.5">
            <textarea id="volMensaje" name="mensaje" placeholder=" " rows={4} className="py-3.5 px-4 rounded-xl bg-(--color-fondo) border-2 border-(--color-texto-sec) text-sm text-(--color-texto) t-modo focus:outline-none focus:border-(--color-texto) resize-y min-h-25"></textarea>
            <label htmlFor="volMensaje">¿En qué actividad te gustaría participar?</label>
          </div>
          <div className="flex justify-center pt-2">
            <button type="submit" disabled={enviando} className="btn-enviar inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold shadow-md t-modo transition-all duration-300 hover:scale-105 hover:shadow-xl shrink-0">
              <i className="fas fa-hand-holding-heart"></i> {enviando ? 'Enviando...' : 'Quiero ser voluntario/a'}
            </button>
          </div>
          {mensaje && <p className="text-center text-sm font-medium" style={{ color: 'var(--color-destacado)' }}>{mensaje}</p>}
        </form>
      </div>
    </section>
  )
}