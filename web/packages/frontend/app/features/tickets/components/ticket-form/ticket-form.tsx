import { useState } from 'react'
import { Button, DateTimePicker, Input, Textarea } from '~/components'

type Ticket = {
  id: string
  title: string
  description: string
  deadline: Date
  createdAt: Date
  updatedAt: Date
}

type TicketFormProps = {
  onSubmit: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export const TicketForm = ({ onSubmit, onCancel }: TicketFormProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      deadline,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          説明
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700"
        >
          期限
        </label>
        <DateTimePicker date={deadline} setDate={setDeadline} />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit">作成</Button>
      </div>
    </form>
  )
}
