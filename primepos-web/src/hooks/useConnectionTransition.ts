import { useState, useEffect, useRef } from 'react'
import { useNetworkStatus } from './useNetworkStatus'

export interface ConnectionTransition {
  wentOffline: boolean
  cameOnline: boolean
}

export function useConnectionTransition(): ConnectionTransition {
  const { isOnline } = useNetworkStatus()
  const [wentOffline, setWentOffline] = useState(false)
  const [cameOnline, setCameOnline] = useState(false)
  const prevIsOnlineRef = useRef(isOnline)

  useEffect(() => {
    if (prevIsOnlineRef.current !== isOnline) {
      if (prevIsOnlineRef.current && !isOnline) {
        setWentOffline(true)
      } else if (!prevIsOnlineRef.current && isOnline) {
        setCameOnline(true)
      }
      prevIsOnlineRef.current = isOnline
    }
  }, [isOnline])

  useEffect(() => {
    if (wentOffline) {
      const id = setTimeout(() => setWentOffline(false), 0)
      return () => clearTimeout(id)
    }
  }, [wentOffline])

  useEffect(() => {
    if (cameOnline) {
      const id = setTimeout(() => setCameOnline(false), 0)
      return () => clearTimeout(id)
    }
  }, [cameOnline])

  return { wentOffline, cameOnline }
}
