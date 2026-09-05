import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> & {
  label: ReactNode
  helperText?: ReactNode
  error?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
}

export default function Input({
  label,
  helperText,
  error,
  prefix,
  suffix,
  id,
  className,
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...inputProps
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const feedbackId = `${inputId}-feedback`
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
      <label className="as-field__label" htmlFor={inputId}>{label}</label>
      <div className="as-field__control">
        {prefix != null && (
          <span className="as-field__adornment as-field__adornment--prefix" aria-hidden="true">{prefix}</span>
        )}
        <input
          {...inputProps}
          id={inputId}
          className="as-field__input"
          disabled={disabled}
          aria-invalid={hasError ? true : ariaInvalid}
          aria-describedby={describedBy}
        />
        {suffix != null && (
          <span className="as-field__adornment as-field__adornment--suffix" aria-hidden="true">{suffix}</span>
        )}
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
