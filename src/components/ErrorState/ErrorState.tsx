import type { ReactNode } from 'react'
import { EmptyState } from '../EmptyState'

export type ErrorStateProps = {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function ErrorState({
  title = 'Não foi possível carregar os dados.',
  description = 'Tente novamente.',
  icon,
  action,
  className,
}: ErrorStateProps) {
  const classes = ['as-error-state', className].filter(Boolean).join(' ')

  return (
    <EmptyState
      className={classes}
      title={title}
      description={description}
      icon={icon}
      action={action}
    />
  )
}
