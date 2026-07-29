'use client'

import { useEffect, useState } from 'react'

export default function Footer() {
  const [tema, setTema] = useState('claro')

  useEffect(() => {
    const temaGuardado = localStorage.getItem('gm-tema') || 'claro'
    setTema(temaGuardado)

    const observer = new MutationObserver(() => {
      const nuevoTema = document.documentElement.getAttribute('data-tema') || 'claro'
      setTema(nuevoTema)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] })
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="t-modo px-8 py-4" style={{ backgroundColor: 'var(--color-primario-dark)' }}>
      <div className="max-w-300 mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
        <p className="text-white/60 text-[11px] leading-snug text-center md:text-left">
          © 2026 Giselle Miravete. Todos los derechos reservados.<br className="hidden md:block" />
          Santo Tomé, Santa Fe, Argentina.
        </p>
        <div className="h-12 md:h-14 flex items-center overflow-hidden">
          <img src="/images/aguila-blanca.png" alt="La Libertad Avanza" className="h-14 md:h-15 object-contain opacity-60 md:opacity-70 -my-2 md:-my-4" />
        </div>
      </div>
    </footer>
  )
}