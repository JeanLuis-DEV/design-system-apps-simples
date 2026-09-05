import type { HTMLAttributes, KeyboardEvent, MouseEventHandler, ReactNode } from 'react'

export type CardVariant = 'default' | 'interactive' | 'highlight' | 'alert' | 'compact'

type CardBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'onClick'> & {
  children: ReactNode
  className?: string
}

type StaticCardProps = CardBaseProps & {
  variant?: Exclude<CardVariant, 'interactive'>
  onClick?: never
}

type InteractiveCardProps = CardBaseProps & {
  variant: 'interactive'
  onClick: MouseEventHandler<HTMLDivElement>
}

export type CardProps = StaticCardProps | InteractiveCardProps

export default function Card({
  children,
  variant = 'default',
  className,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...cardProps
}: CardProps) {
  const isInteractive = variant === 'interactive' && onClick != null
  const classes = ['card', `card--${variant}`, className].filter(Boolean).join(' ')

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event)

    if (!event.defaultPrevented && isInteractive && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      event.currentTarget.click()
    }
  }

  return (
    <div
      {...cardProps}
      className={classes}
      role={isInteractive ? 'button' : role}
      tabIndex={isInteractive ? 0 : tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  )
}
