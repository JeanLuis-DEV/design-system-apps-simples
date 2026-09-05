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
  'area[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

type ActiveModal = {
  token: symbol
  dialog: HTMLDivElement
  restoreFocusTo: HTMLElement | null
}

const activeModals: ActiveModal[] = []
let bodyOverflowBeforeModals: string | null = null

function isRenderedAndNavigable(element: HTMLElement) {
  if (
    element.tabIndex < 0
    || element.matches(':disabled')
    || element.closest('[hidden], [inert], [aria-hidden="true"]')
    || element.getClientRects().length === 0
  ) {
    return false
  }

  const styles = window.getComputedStyle(element)
  return styles.display !== 'none' && styles.visibility !== 'hidden' && styles.visibility !== 'collapse'
}

function getFocusableElements(dialog: HTMLElement) {
  const candidates = Array.from(
    dialog.querySelectorAll<HTMLElement>(focusableSelector),
  ).filter(isRenderedAndNavigable)

  const focusableElements = candidates.filter((element) => {
    if (!(element instanceof HTMLInputElement) || element.type !== 'radio' || !element.name) {
      return true
    }

    const group = candidates.filter(
      (candidate): candidate is HTMLInputElement => candidate instanceof HTMLInputElement
        && candidate.type === 'radio'
        && candidate.name === element.name
        && candidate.form === element.form,
    )
    const activeRadio = group.find((radio) => radio.checked) ?? group[0]
    return element === activeRadio
  })

  return focusableElements
    .map((element, documentOrder) => ({ element, documentOrder }))
    .sort((first, second) => {
      const firstOrder = first.element.tabIndex || Number.POSITIVE_INFINITY
      const secondOrder = second.element.tabIndex || Number.POSITIVE_INFINITY

      return firstOrder === secondOrder
        ? first.documentOrder - second.documentOrder
        : firstOrder - secondOrder
    })
    .map(({ element }) => element)
}

function focusModal(modal: ActiveModal) {
  const elementToFocus = getFocusableElements(modal.dialog)[0] ?? modal.dialog
  elementToFocus.focus()
}

function isTopModal(modal: ActiveModal) {
  return activeModals.at(-1) === modal
}

function canRestoreFocus(element: HTMLElement | null): element is HTMLElement {
  return element != null
    && element.isConnected
    && element.matches(focusableSelector)
    && isRenderedAndNavigable(element)
}

function registerModal(modal: ActiveModal) {
  if (activeModals.length === 0) {
    bodyOverflowBeforeModals = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  activeModals.push(modal)
}

function unregisterModal(modal: ActiveModal) {
  const modalIndex = activeModals.indexOf(modal)
  if (modalIndex === -1) return

  const wasTopModal = modalIndex === activeModals.length - 1
  activeModals.splice(modalIndex, 1)

  if (!wasTopModal) {
    const nextModal = activeModals[modalIndex]

    if (nextModal && modal.dialog.contains(nextModal.restoreFocusTo)) {
      nextModal.restoreFocusTo = modal.restoreFocusTo
    }
    return
  }

  const underlyingModal = activeModals.at(-1)
  if (underlyingModal) {
    const restoreFocusTo = modal.restoreFocusTo
    if (canRestoreFocus(restoreFocusTo) && underlyingModal.dialog.contains(restoreFocusTo)) {
      restoreFocusTo.focus()
    } else {
      focusModal(underlyingModal)
    }
    return
  }

  document.body.style.overflow = bodyOverflowBeforeModals ?? ''
  bodyOverflowBeforeModals = null

  const restoreFocusTo = modal.restoreFocusTo
  if (canRestoreFocus(restoreFocusTo)) {
    restoreFocusTo.focus()
  }
}

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
  const modalTokenRef = useRef(Symbol('modal'))

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    if (!dialog) return

    const modal: ActiveModal = {
      token: modalTokenRef.current,
      dialog,
      restoreFocusTo: document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null,
    }
    registerModal(modal)

    const animationFrame = requestAnimationFrame(() => {
      if (isTopModal(modal)) focusModal(modal)
    })

    const handleDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      const dialog = dialogRef.current
      if (!dialog || !isTopModal(modal)) return

      if (event.key === 'Escape') {
        if (event.repeat) return
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusableElements = getFocusableElements(dialog)

      if (focusableElements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      event.preventDefault()
      const activeElement = document.activeElement
      const activeElementIndex = activeElement instanceof HTMLElement
        ? focusableElements.indexOf(activeElement)
        : -1
      const nextIndex = event.shiftKey
        ? (activeElementIndex <= 0 ? focusableElements.length - 1 : activeElementIndex - 1)
        : (activeElementIndex === -1 || activeElementIndex === focusableElements.length - 1
            ? 0
            : activeElementIndex + 1)

      focusableElements[nextIndex]?.focus()
    }

    const keepFocusInside = (event: FocusEvent) => {
      if (
        isTopModal(modal)
        && dialogRef.current
        && !dialogRef.current.contains(event.target as Node)
      ) {
        focusModal(modal)
      }
    }

    document.addEventListener('keydown', handleDocumentKeyDown)
    document.addEventListener('focusin', keepFocusInside)

    return () => {
      cancelAnimationFrame(animationFrame)
      document.removeEventListener('keydown', handleDocumentKeyDown)
      document.removeEventListener('focusin', keepFocusInside)
      unregisterModal(modal)
    }
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const classes = ['as-modal', className].filter(Boolean).join(' ')

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    const topModal = activeModals.at(-1)
    if (
      closeOnBackdrop
      && topModal?.token === modalTokenRef.current
      && event.target === event.currentTarget
    ) {
      onClose()
    }
  }

  return createPortal(
    <div className="as-modal__overlay" onClick={handleBackdropClick}>
      <div
        ref={dialogRef}
        className={classes}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="as-modal__header">
          <h2 className="as-modal__title" id={titleId}>{title}</h2>
          <button className="as-modal__close" type="button" onClick={onClose} aria-label="Fechar modal">
            <span aria-hidden="true">×</span>
          </button>
        </header>
        <div className="as-modal__body">{children}</div>
        {footer != null && <footer className="as-modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
