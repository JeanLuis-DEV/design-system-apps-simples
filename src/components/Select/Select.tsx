import { useId, type ReactNode, type SelectHTMLAttributes } from 'react'

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: ReactNode
  helperText?: ReactNode
  error?: ReactNode
}

export default function Select({
  label,
  helperText,
  error,
  id,
  className,
  disabled = false,
  children,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...selectProps
}: SelectProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const feedbackId = `${selectId}-feedback`
  const describedBy = [ariaDescribedBy, (error || helperText) && feedbackId]
    .filter(Boolean)
    .join(' ') || undefined
  const classes = ['field', error && 'field--error', disabled && 'field--disabled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="field__label" htmlFor={selectId}>{label}</label>
      <div className="field__control">
        <select
          {...selectProps}
          id={selectId}
          className="field__select"
          disabled={disabled}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={describedBy}
        >
          {children}
        </select>
      </div>
      {(error || helperText) && (
        <span
          id={feedbackId}
          className={`field__feedback${error ? ' field__feedback--error' : ''}`}
          role={error ? 'alert' : undefined}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  )
}
