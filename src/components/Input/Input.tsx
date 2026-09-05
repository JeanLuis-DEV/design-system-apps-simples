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
  const describedBy = [ariaDescribedBy, (error || helperText) && feedbackId]
    .filter(Boolean)
    .join(' ') || undefined
  const classes = ['field', error && 'field--error', disabled && 'field--disabled', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes}>
      <label className="field__label" htmlFor={inputId}>{label}</label>
      <div className="field__control">
        {prefix != null && (
          <span className="field__adornment field__adornment--prefix" aria-hidden="true">{prefix}</span>
        )}
        <input
          {...inputProps}
          id={inputId}
          className="field__input"
          disabled={disabled}
          aria-invalid={error ? true : ariaInvalid}
          aria-describedby={describedBy}
        />
        {suffix != null && (
          <span className="field__adornment field__adornment--suffix" aria-hidden="true">{suffix}</span>
        )}
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
