import { useRegisterSW } from 'virtual:pwa-register/react'
import { useCallback } from 'react'

export function usePWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swScriptUrl: string, r: ServiceWorkerRegistration | undefined) {
      console.log('SW registered:', r)
    },
    onRegisterError(error: unknown) {
      console.error('SW registration error:', error)
    },
  })

  const updateServiceWorkerWithCallback = useCallback(() => {
    updateServiceWorker()
  }, [updateServiceWorker])

  return { needRefresh, setNeedRefresh, updateServiceWorker: updateServiceWorkerWithCallback }
}