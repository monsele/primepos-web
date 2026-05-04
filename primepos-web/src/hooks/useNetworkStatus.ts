import { useState, useEffect } from 'react'

interface NetworkInformation {
  effectiveType?: string
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
}

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [connectionType, setConnectionType] = useState<string>('unknown')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    const updateConnectionInfo = () => {
      const conn = (navigator as NavigatorWithConnection).connection
      if (conn) {
        setConnectionType(conn.effectiveType || 'unknown')
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const conn = (navigator as NavigatorWithConnection).connection
    if (conn) {
      conn.addEventListener('change', updateConnectionInfo)
      updateConnectionInfo()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (conn) {
        conn.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  return { isOnline, connectionType }
}
