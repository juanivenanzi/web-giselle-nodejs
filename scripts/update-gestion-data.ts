#!/usr/bin/env node
import { exec } from 'child_process'
import { promisify } from 'util'
const execAsync = promisify(exec)
async function updateGestionData() {
  console.log('🔄 Iniciando actualización de datos...')
  console.log(`📅 ${new Date().toISOString()}`)
  try {
    const { stdout, stderr } = await execAsync('npm run fetch-data')
    if (stderr) console.error('❌ Error:', stderr)
    console.log(stdout)
    console.log('✅ Datos actualizados exitosamente')
  } catch (error) {
    console.error('❌ Error actualizando datos:', error)
  }
}
updateGestionData()