import { useId } from 'react'

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
}

export default function OptionGroup({
  options,
  value,
  onChange,
  label,
  disabled = false,
}: OptionGroupProps) {
  const groupId = useId()

  return (
    <fieldset className="option-group" disabled={disabled}>
      <legend className="option-group__legend">{label}</legend>
      <div className="option-group__options">
        {options.map((option, index) => {
          const optionId = `${groupId}-${index}`

          return (
            <span className="option-group__option" key={option.value}>
              <input
                className="option-group__input"
                type="radio"
                id={optionId}
                name={groupId}
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
              />
              <label className="option-group__label" htmlFor={optionId}>{option.label}</label>
            </span>
          )
        })}
      </div>
    </fieldset>
  )
}
