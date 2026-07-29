'use server'

import { z } from 'zod'

// Schema de validación con Zod
const ContactoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio').max(100),
  email: z.string().email('Email no válido').min(1, 'El email es obligatorio'),
  telefono: z.string().optional(),
  asunto: z.string().min(1, 'Debés seleccionar un asunto'),
  mensaje: z.string().min(1, 'El mensaje es obligatorio'),
})

export type ContactoState = {
  errors?: {
    nombre?: string[]
    email?: string[]
    telefono?: string[]
    asunto?: string[]
    mensaje?: string[]
  }
  message?: string
  success?: boolean
}

export async function enviarContacto(
  prevState: ContactoState,
  formData: FormData
): Promise<ContactoState> {
  // Validar los datos
  const validatedFields = ContactoSchema.safeParse({
    nombre: formData.get('nombre'),
    email: formData.get('email'),
    telefono: formData.get('telefono'),
    asunto: formData.get('asunto'),
    mensaje: formData.get('mensaje'),
  })

  // Si hay errores de validación
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor, corregí los campos marcados.',
      success: false,
    }
  }

  const { nombre, email, telefono, asunto, mensaje } = validatedFields.data

  try {
    // Enviar a Google Sheets (manteniendo la misma lógica que tenías)
    const GOOGLE_SCRIPT_URL =
      'https://script.google.com/macros/s/AKfycbw8t5n99HlHLV8JI_oKORrDoOq963MgrUjmcDrQBoori2NE8xftm55bXXNnoG-XHZqltA/exec'

    const formDataToSend = new FormData()
    formDataToSend.append('nombre', nombre)
    formDataToSend.append('email', email)
    formDataToSend.append('telefono', telefono || '')
    formDataToSend.append('asunto', asunto)
    formDataToSend.append('mensaje', mensaje)
    formDataToSend.append('secreto', 'MI_SECRETO_123')
    formDataToSend.append('tipo', 'contacto')

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: formDataToSend,
    })

    const data = await response.json()

    if (data.success) {
      return {
        message: '✅ ¡Mensaje enviado!',
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