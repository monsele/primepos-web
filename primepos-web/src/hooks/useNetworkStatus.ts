import { useState, useEffect, useRef } from 'react'

interface NetworkInformation {
  effectiveType?: '4g' | '3g' | '2g' | 'slow-2g' | 'unknown'
  addEventListener: (type: string, listener: () => void) => void
  removeEventListener: (type: string, listener: () => void) => void
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation
}

export interface NetworkStatus {
  isOnline: boolean
  connectionType: string
  since: Date | null
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const [connectionType, setConnectionType] = useState<string>('unknown')
  const [since, setSince] = useState<Date | null>(new Date())

  const prevIsOnlineRef = useRef<boolean>(isOnline)

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

  useEffect(() => {
    if (isOnline !== prevIsOnlineRef.current) {
      setSince(new Date())
      prevIsOnlineRef.current = isOnline
    }
  }, [isOnline])

  return { isOnline, connectionType, since }
}
