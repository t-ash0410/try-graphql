import { useState } from 'react'
import { DateTimePicker } from '~/components'
import { formatDate } from '~/util/date'

type Props = {
  value?: Date
  onSave: (value: Date) => void
}

export const EditableDateTimeField = ({ value, onSave }: Props) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (newDate: Date) => {
    onSave(newDate)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <DateTimePicker
        date={value ? new Date(value) : new Date()}
        setDate={handleSave}
      />
    )
  }
  return (
    <span
      onClick={() => setIsEditing(true)}
      onKeyUp={() => setIsEditing(true)}
      suppressHydrationWarning={true}
    >
      {value ? formatDate(value) : ''}
    </span>
  )
}
