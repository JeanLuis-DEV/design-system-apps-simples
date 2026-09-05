export type LoadingSize = 'small' | 'default' | 'large'

export type LoadingMode = 'inline' | 'section' | 'screen'

export type LoadingProps = {
  label?: string
  size?: LoadingSize
  mode?: LoadingMode
  className?: string
}

export default function Loading({
  label,
  size = 'default',
  mode = 'inline',
  className,
}: LoadingProps) {
  const classes = ['as-loading', `as-loading--${size}`, `as-loading--${mode}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="status" aria-live="polite" aria-atomic="true">
      <span className="as-loading__spinner" aria-hidden="true" />
      {label ? (
        <span className="as-loading__label">{label}</span>
      ) : (
        <span className="as-loading__accessible-label">Carregando</span>
      )}
    </div>
  )
}
