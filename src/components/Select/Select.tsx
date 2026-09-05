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
  const hasError = error != null && error !== false
  const hasHelperText = helperText != null && helperText !== false
  const hasFeedback = hasError || hasHelperText
  const describedBy = [ariaDescribedBy, hasFeedback && feedbackId]
    .filter(Boolean)
    .join(' ') || undefined
  const classes = ['as-field', hasError && 'as-field--error', disabled && 'as-field--disabled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="as-field__label" htmlFor={selectId}>{label}</label>
      <div className="as-field__control">
        <select
          {...selectProps}
          id={selectId}
          className="as-field__select"
          disabled={disabled}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-describedby={describedBy}
        >
          {children}
        </select>
      </div>
      {hasFeedback && (
        <span
          id={feedbackId}
          className={`as-field__feedback${hasError ? ' as-field__feedback--error' : ''}`}
          role={hasError ? 'alert' : undefined}
        >
          {hasError ? error : helperText}
        </span>
      )}
    </div>
  )
}
