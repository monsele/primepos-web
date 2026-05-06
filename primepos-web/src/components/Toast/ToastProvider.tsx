import {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from 'react'
import { ToastContext } from './toastContext'
import type { ToastItemInternal } from './toastTypes'
import styles from './Toast.module.css'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemInternal[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.map(t => (t.id === id ? { ...t, exiting: true } : t)))
    const timer = window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
      timersRef.current.delete(id)
    }, 300)
    timersRef.current.set(id, timer)
  }, [])

  const showToast = useCallback(
    (options: { message: string; type?: 'success' | 'warning' | 'error' | 'info'; duration?: number }) => {
      const id = Math.random().toString(36).slice(2)
      const toast: ToastItemInternal = {
        id,
        message: options.message,
        type: options.type || 'info',
        duration: options.duration || 4000,
      }
      setToasts(prev => [...prev, toast])
      const timer = window.setTimeout(() => dismissToast(id), toast.duration)
      timersRef.current.set(id, timer)
    },
    [dismissToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      <div className={styles.container} role="status" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]} ${toast.exiting ? styles.exit : styles.enter}`}
            aria-atomic="true"
          >
            <span className={styles.message}>{toast.message}</span>
            <button
              type="button"
              className={styles.dismiss}
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
