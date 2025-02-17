import { useState } from 'react'
import { Input, Textarea } from '~/components'

type Props = {
  value: string
  onSave: (value: string) => void
  inputType?: 'input' | 'textarea'
}

export const EditableTextField = ({
  value,
  onSave,
  inputType = 'input',
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)

  const handleSave = () => {
    onSave(editedValue)
    setIsEditing(false)
  }

  if (isEditing) {
    const C = inputType === 'input' ? Input : Textarea
    return (
      <C
        value={editedValue}
        onChange={(e) => setEditedValue(e.target.value)}
        onBlur={handleSave}
        autoFocus
        className="w-full"
      />
    )
  }
  return (
    <span onClick={() => setIsEditing(true)} onKeyUp={() => setIsEditing(true)}>
      {value}
    </span>
  )
}
