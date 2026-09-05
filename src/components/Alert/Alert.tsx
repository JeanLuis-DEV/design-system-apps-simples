import type { ReactNode } from 'react'

export type AlertType = 'success' | 'error' | 'warning' | 'info'

type AlertBaseProps = {
  type: AlertType
  children: ReactNode
  title?: ReactNode
  className?: string
}

type PersistentAlertProps = AlertBaseProps & {
  dismissible?: false
  onDismiss?: never
}

type DismissibleAlertProps = AlertBaseProps & {
  dismissible: true
  onDismiss: () => void
}

export type AlertProps = PersistentAlertProps | DismissibleAlertProps

export default function Alert({
  type,
  children,
  title,
  className,
  dismissible = false,
  onDismiss,
}: AlertProps) {
  const classes = ['alert', `alert--${type}`, className].filter(Boolean).join(' ')
  const role = type === 'error' || type === 'warning' ? 'alert' : 'status'

  return (
    <div className={classes} role={role} aria-atomic="true">
      <div className="alert__content">
        {title != null && <strong className="alert__title">{title}</strong>}
        <div className="alert__message">{children}</div>
      </div>
      {dismissible && (
        <button className="alert__close" type="button" aria-label="Fechar aviso" onClick={onDismiss}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  )
}
