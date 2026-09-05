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
  const classes = ['loading', `loading--${size}`, `loading--${mode}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} role="status" aria-live="polite" aria-atomic="true">
      <span className="loading__spinner" aria-hidden="true" />
      {label ? (
        <span className="loading__label">{label}</span>
      ) : (
        <span className="loading__accessible-label">Carregando</span>
      )}
    </div>
  )
}
