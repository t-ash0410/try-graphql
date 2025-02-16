import { useState } from 'react'
import { Button, TableSkeleton } from '~/components'
import { useMutation, useQuery } from '~/lib/gqty'
import { formatDate } from '~/util/date'
import { handleError } from '~/util/handle-error'
import { DeleteButton } from '../delete-button'
import { EditableDateTimeField, EditableTextField } from '../editable-field'
import { TicketForm } from '../ticket-form'

export const TicketList = () => {
  const { tickets, $state } = useQuery()
  const data = tickets()

  // Create
  const [isCreating, setIsCreating] = useState(false)
  const [createTicket] = useMutation((mutation, inputs) => {
    mutation.createTicket(inputs)
    setIsCreating(false)
  })

  // Update
  // const updateMutation = useUpdateTicket(queryClient)
  // const handleEditTitle = (id: string, value: string) => {
  //   updateMutation.mutate({
  //     ticketId: id,
  //     body: {
  //       title: value,
  //     },
  //   })
  // }

  // Delete
  // const deleteMutation = useDeleteTicket(queryClient)
  // const handleDeleteTicket = (id: string) => {
  //   deleteMutation.mutate(id)
  // }

  if ($state.error) {
    handleError($state.error)
    return
  }
  return (
    <div className="space-y-4">
      <div className="mb-4">
        {isCreating ? (
          <TicketForm
            onSubmit={() => createTicket()}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <Button className="bg-primary" onClick={() => setIsCreating(true)}>
            新しいTODOを追加
          </Button>
        )}
      </div>
      {!data ? <TableSkeleton /> : <></>}
      {data.map((ticket) => (
        <div key={ticket.ticketId} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold w-full">
              <EditableTextField value={ticket.title} onSave={console.log} />
            </h3>
            <div className="flex space-x-2">
              <DeleteButton onDelete={console.log} />
            </div>
          </div>
          <div className="mb-2">
            <EditableTextField
              value={ticket.description ?? ''}
              onSave={console.log}
              inputType="textarea"
            />
          </div>
          <p className="text-sm text-gray-500">
            期限:&nbsp;
            <EditableDateTimeField
              value={ticket.deadline ? new Date(ticket.deadline) : undefined}
              onSave={console.log}
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
