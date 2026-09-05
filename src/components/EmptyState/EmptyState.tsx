import type { ReactNode } from 'react'

export type EmptyStateProps = {
  title: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  const classes = ['empty-state', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {icon != null && (
        <div className="empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="empty-state__content">
        <p className="empty-state__title">{title}</p>
        {description != null && <p className="empty-state__description">{description}</p>}
      </div>
      {action != null && <div className="empty-state__action">{action}</div>}
    </div>
  )
}
