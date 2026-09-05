import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastProps = {
  open: boolean
  type: ToastType
  message: string
  duration?: number
  onClose: () => void
  className?: string
}

const exitDuration = 150

export default function Toast({
  open,
  type,
  message,
  duration = 4000,
  onClose,
  className,
}: ToastProps) {
  const [closing, setClosing] = useState(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) {
      setClosing(false)
      return
    }

    setClosing(false)
    const timer = window.setTimeout(() => setClosing(true), Math.max(0, duration))
    return () => window.clearTimeout(timer)
  }, [open, type, message, duration])

  useEffect(() => {
    if (!open || !closing) return

    const timer = window.setTimeout(() => onCloseRef.current(), exitDuration)
    return () => window.clearTimeout(timer)
  }, [open, closing])

  if (!open || typeof document === 'undefined') return null

  const classes = [
    'toast',
    `toast--${type}`,
    closing && 'toast--closing',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const role = type === 'error' || type === 'warning' ? 'alert' : 'status'

  return createPortal(
    <div className={classes} role={role} aria-atomic="true">
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        type="button"
        aria-label="Fechar notificação"
        onClick={() => setClosing(true)}
      >
        <span aria-hidden="true">×</span>
      </button>
    </div>,
    document.body,
  )
}
