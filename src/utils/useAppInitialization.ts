import { useEffect, useState } from 'react'
import { 
  initDatabase, 
  isFirstTimeInstall, 
  getDatabaseStats
} from './unifiedDatabase'
import { initDevTools } from './devTools'
import { isQRScanURL } from './scheduleUtils'
import { isDevelopment } from './types'

export function useAppInitialization() {
  const [state, setState] = useState({
    dbInitialized: false,
    initError: null as string | null,
    isFirstInstall: false
  })

  useEffect(() => {
    const initialize = async () => {
      try {
        // Inicializar herramientas de desarrollo
        if (isDevelopment()) {
          initDevTools()
        }

        await initDatabase()
        
        // Verificar si es primera instalación
        const firstInstall = await isFirstTimeInstall()
        
        if (firstInstall) {
          console.log('🎉 ¡Bienvenido! Esta es la primera vez que usas la aplicación.')
          console.log('💡 Tip: Si estás en desarrollo, usa devTools.help() en la consola para ver comandos disponibles.')
          console.log('👑 Usuario administrador por defecto creado:')
          console.log('   📧 Email: admin@colegio.edu.co')
          console.log('   🔐 Contraseña: admin123')
          console.log('   👤 Nombre: Administrador')
        } else {
          console.log('👋 Aplicaci��n inicializada con datos existentes')
          // Mostrar estadísticas
          const stats = await getDatabaseStats()
          console.log('📊 Estadísticas de la BD:', stats)
        }
        
        setState({
          dbInitialized: true,
          initError: null,
          isFirstInstall: firstInstall
        })
        
      } catch (error) {
        console.error('Error al inicializar la aplicación:', error)
        setState({
          dbInitialized: false,
          initError: 'Error al inicializar la aplicación. Por favor recarga la página.',
          isFirstInstall: false
        })
      }
    }

    initialize()
  }, [])

  return {
    ...state,
    shouldShowQRLanding: isQRScanURL()
  }
}