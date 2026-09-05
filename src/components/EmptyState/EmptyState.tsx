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
  const classes = ['as-empty-state', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      {icon != null && (
        <div className="as-empty-state__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="as-empty-state__content">
        <p className="as-empty-state__title">{title}</p>
        {description != null && <p className="as-empty-state__description">{description}</p>}
      </div>
      {action != null && <div className="as-empty-state__action">{action}</div>}
    </div>
  )
}
