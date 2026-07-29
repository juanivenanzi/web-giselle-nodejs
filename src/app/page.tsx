'use client'

import { useEffect } from 'react'
import Hero from '@/components/Hero'
import SobreMi from '@/components/SobreMi'
import Equipo from '@/components/Equipo'
import Pilares from '@/components/Pilares'
import Voluntariado from '@/components/Voluntariado'
import Contacto from '@/components/Contacto'

export default function Home() {
  useEffect(() => {
    const modoGuardado = localStorage.getItem('gm-modo') || 'institucional'
    document.documentElement.setAttribute('data-modo', modoGuardado)

    const temaGuardado = localStorage.getItem('gm-tema') || 'claro'
    document.documentElement.setAttribute('data-tema', temaGuardado)

    const observer = new MutationObserver(() => {
      const nuevoModo = document.documentElement.getAttribute('data-modo') || 'institucional'
      localStorage.setItem('gm-modo', nuevoModo)
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-modo'] })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Hero />
      <SobreMi />
      <Equipo />
      <Pilares />
      <Voluntariado />
      <Contacto />
    </>
  )
}