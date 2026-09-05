import type { ButtonHTMLAttributes } from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'compact' | 'default'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  ...buttonProps
}: ButtonProps) {
  const classes = [
    'as-button',
    `as-button--${variant}`,
    `as-button--${size}`,
    loading && 'as-button--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...buttonProps}
      className={classes}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <span className="as-button__spinner" aria-hidden="true" />}
      <span className="as-button__label">{children}</span>
    </button>
  )
}
