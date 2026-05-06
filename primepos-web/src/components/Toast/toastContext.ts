import { createContext } from 'react'

export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void
  dismissToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
