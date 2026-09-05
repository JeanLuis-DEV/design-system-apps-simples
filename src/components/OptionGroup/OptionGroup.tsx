import { useId, type ReactNode } from 'react'

export type OptionGroupOption = {
  label: string
  value: string
}

export type OptionGroupProps = {
  options: OptionGroupOption[]
  value: string
  onChange: (value: string) => void
  label: string
  disabled?: boolean
  name?: string
  required?: boolean
  helperText?: ReactNode
  error?: ReactNode
  id?: string
  'aria-describedby'?: string
}

export default function OptionGroup({
  options,
  value,
  onChange,
  label,
  disabled = false,
  name,
  required = false,
  helperText,
  error,
  id,
  'aria-describedby': ariaDescribedBy,
}: OptionGroupProps) {
  const generatedId = useId()
  const groupId = id ?? generatedId
  const radioName = name ?? groupId
  const feedbackId = `${groupId}-feedback`
  const hasError = error != null && error !== false
  const hasHelperText = helperText != null && helperText !== false
  const describedBy = [
    ariaDescribedBy,
    (hasError || hasHelperText) && feedbackId,
  ].filter(Boolean).join(' ') || undefined
  const classes = ['as-option-group', hasError && 'as-option-group--error']
    .filter(Boolean)
    .join(' ')

  return (
    <fieldset
      className={classes}
      disabled={disabled}
      id={groupId}
      aria-describedby={describedBy}
      aria-invalid={hasError || undefined}
    >
      <legend className="as-option-group__legend">{label}</legend>
      <div className="as-option-group__options">
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`

          return (
            <span className="as-option-group__option" key={option.value}>
              <input
                className="as-option-group__input"
                type="radio"
                id={optionId}
                name={radioName}
                value={option.value}
                checked={value === option.value}
                required={required}
                onChange={(event) => onChange(event.target.value)}
              />
              <label className="as-option-group__label" htmlFor={optionId}>{option.label}</label>
            </span>
          )
        })}
      </div>
      {(hasError || hasHelperText) && (
        <span
          className={`as-option-group__feedback${hasError ? ' as-option-group__feedback--error' : ''}`}
          id={feedbackId}
          role={hasError ? 'alert' : undefined}
        >
          {hasError ? error : helperText}
        </span>
      )}
    </fieldset>
  )
}
