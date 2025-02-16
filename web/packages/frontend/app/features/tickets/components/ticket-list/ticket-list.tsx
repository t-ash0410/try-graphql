import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Button, TableSkeleton } from '~/components'
import {
  useCreateTicket,
  useDeleteTicket,
  useListTickets,
  useUpdateTicket,
} from '~/hooks/api/ticket'
import { formatDate } from '~/util/date'
import { handleError } from '~/util/handle-error'
import { DeleteButton } from '../delete-button'
import { EditableDateTimeField, EditableTextField } from '../editable-field'
import { TicketForm } from '../ticket-form'

export const TicketList = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useListTickets()

  // Create
  const createMutation = useCreateTicket(queryClient)
  const [isCreating, setIsCreating] = useState(false)
  const handleCreateTicket = (newTicket: {
    title: string
    description: string
    deadline: Date
  }) => {
    createMutation.mutate({
      ...newTicket,
      deadline: newTicket.deadline.toString(),
    })
    setIsCreating(false)
  }

  // Update
  const updateMutation = useUpdateTicket(queryClient)
  const handleEditTitle = (id: string, value: string) => {
    updateMutation.mutate({
      ticketId: id,
      body: {
        title: value,
      },
    })
  }
  const handleEditDescription = (id: string, value: string) => {
    updateMutation.mutate({
      ticketId: id,
      body: {
        description: value,
      },
    })
  }
  const handleEditDeadline = (id: string, value: Date) => {
    updateMutation.mutate({
      ticketId: id,
      body: {
        deadline: value.toString(),
      },
    })
  }

  // Delete
  const deleteMutation = useDeleteTicket(queryClient)
  const handleDeleteTicket = (id: string) => {
    deleteMutation.mutate(id)
  }

  if (error) {
    handleError(error)
    return
  }
  return (
    <div className="space-y-4">
      <div className="mb-4">
        {isCreating ? (
          <TicketForm
            onSubmit={handleCreateTicket}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <Button className="bg-primary" onClick={() => setIsCreating(true)}>
            新しいTODOを追加
          </Button>
        )}
      </div>
      {isLoading ? <TableSkeleton /> : <></>}
      {data?.tickets.map((ticket) => (
        <div key={ticket.ticketId} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold w-full">
              <EditableTextField
                value={ticket.title}
                onSave={(value) => handleEditTitle(ticket.ticketId, value)}
              />
            </h3>
            <div className="flex space-x-2">
              <DeleteButton
                onDelete={() => handleDeleteTicket(ticket.ticketId)}
              />
            </div>
          </div>
          <div className="mb-2">
            <EditableTextField
              value={ticket.description}
              onSave={(value) => handleEditDescription(ticket.ticketId, value)}
              inputType="textarea"
            />
          </div>
          <p className="text-sm text-gray-500">
            期限:&nbsp;
            <EditableDateTimeField
              value={ticket.deadline ? new Date(ticket.deadline) : undefined}
              onSave={(value) => handleEditDeadline(ticket.ticketId, value)}
            />
          </p>
          <p
            className="pt-1 text-xs text-gray-400"
            suppressHydrationWarning={true}
          >
            作成日時:&nbsp;{formatDate(new Date(ticket.createdAt))}
          </p>
          <p className="text-xs text-gray-400" suppressHydrationWarning={true}>
            更新日時:&nbsp;{formatDate(new Date(ticket.updatedAt))}
          </p>
        </div>
      ))}
    </div>
  )
}
