import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type ModalProps = {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
  closeOnBackdrop?: boolean
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  closeOnBackdrop = false,
}: ModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusFirstElement = () => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(focusableSelector)
      const elementToFocus = firstFocusable ?? dialogRef.current
      elementToFocus?.focus()
    }

    const animationFrame = requestAnimationFrame(focusFirstElement)

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      const dialog = dialogRef.current
      if (!dialog) return

      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(focusableSelector),
      )
      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements.at(-1)

      if (!firstFocusable || !lastFocusable) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const focusIsOutside = !dialog.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === firstFocusable || focusIsOutside)) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && (document.activeElement === lastFocusable || focusIsOutside)) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    const keepFocusInside = (event: FocusEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        focusFirstElement()
      }
    }

    document.addEventListener('keydown', handleDocumentKeyDown)
    document.addEventListener('focusin', keepFocusInside)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleDocumentKeyDown)
      document.removeEventListener('focusin', keepFocusInside)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const classes = ['modal', className].filter(Boolean).join(' ')

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div className="modal__overlay" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="modal__header">
          <h2 className="modal__title" id={titleId}>{title}</h2>
          <button className="modal__close" type="button" onClick={onClose} aria-label="Fechar modal">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer != null && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
