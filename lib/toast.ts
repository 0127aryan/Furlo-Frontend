export interface ToastMessage {
  id: string
  type: 'error' | 'success' | 'info'
  message: string
}

type ToastListener = (toasts: ToastMessage[]) => void

let toasts: ToastMessage[] = []
const listeners: Set<ToastListener> = new Set()

export const toast = {
  subscribe(listener: ToastListener) {
    listeners.add(listener)
    listener(toasts)
    return () => {
      listeners.delete(listener)
    }
  },

  show(message: string, type: 'error' | 'success' | 'info' = 'info') {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastMessage = { id, type, message }
    
    // Avoid duplicate error toasts triggered simultaneously
    if (toasts.some((t) => t.message === message)) return

    toasts = [...toasts, newToast]
    listeners.forEach((l) => l(toasts))

    setTimeout(() => {
      toast.dismiss(id)
    }, 4500)
  },

  error(message: string) {
    toast.show(message, 'error')
  },

  success(message: string) {
    toast.show(message, 'success')
  },

  info(message: string) {
    toast.show(message, 'info')
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id)
    listeners.forEach((l) => l(toasts))
  },
}
