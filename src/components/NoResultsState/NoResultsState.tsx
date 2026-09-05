import type { ReactNode } from 'react'
import { EmptyState } from '../EmptyState'

export type NoResultsStateProps = {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export default function NoResultsState({
  title = 'Nenhum resultado encontrado.',
  description = 'Tente ajustar sua busca ou seus filtros.',
  icon,
  action,
  className,
}: NoResultsStateProps) {
  const classes = ['as-no-results-state', className].filter(Boolean).join(' ')

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
