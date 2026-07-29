'use server'

import { z } from 'zod'

// Schema de validación con Zod
const VoluntariadoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().email('Email no válido').min(1, 'El email es obligatorio'),
  telefono: z.string().optional(),
  mensaje: z.string().min(1, 'Debés escribir un mensaje'),
})

export type VoluntariadoState = {
  errors?: {
    nombre?: string[]
    email?: string[]
    telefono?: string[]
    mensaje?: string[]
  }
  message?: string
  success?: boolean
}

export async function enviarVoluntariado(
  prevState: VoluntariadoState,
  formData: FormData
): Promise<VoluntariadoState> {
  // Validar los datos
  const validatedFields = VoluntariadoSchema.safeParse({
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    mensaje: formData.get('mensaje'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor, corregí los campos marcados.',
      success: false,
    }
  }

  const { nombre, email, telefono, mensaje } = validatedFields.data

  try {
    const GOOGLE_SCRIPT_URL =
      'https://script.google.com/macros/s/AKfycbw8t5n99HlHLV8JI_oKORrDoOq963MgrUjmcDrQBoori2NE8xftm55bXXNnoG-XHZqltA/exec'

    const formDataToSend = new FormData()
    formDataToSend.append('nombre', nombre)
    formDataToSend.append('email', email)
    formDataToSend.append('telefono', telefono || '')
    formDataToSend.append('mensaje', mensaje)
    formDataToSend.append('secreto', 'MI_SECRETO_123')
    formDataToSend.append('tipo', 'voluntariado')

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formDataToSend,
    })

    const data = await response.json()

    if (data.success) {
      return {
        message: '✅ ¡Gracias por sumarte!',
        success: true,
      }
    } else {
      return {
        message: data.error || 'Error al enviar el mensaje',
        success: false,
      }
    }
  } catch (error) {
    console.error('Error en Server Action:', error)
    return {
      message: '❌ Error al enviar el mensaje. Intentá nuevamente.',
      success: false,
    }
  }
}