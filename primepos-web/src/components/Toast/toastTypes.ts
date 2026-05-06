export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastOptions {
  message: string
  type?: ToastType
  duration?: number
}

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  duration: number
}

export interface ToastItemInternal extends ToastItem {
  exiting?: boolean
}

export interface ToastContextValue {
  showToast: (options: ToastOptions) => void
  dismissToast: (id: string) => void
}
