import { useState } from 'react'
import { Button, TableSkeleton } from '~/components'
import { useMutation, useQuery } from '~/lib/gqty'
import type { Mutation } from '~/lib/gqty'
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
  const [createTicket] = useMutation<
    void,
    Parameters<Mutation['createTicket']>[0]
  >((mutation, inputs) => {
    const ticket = mutation.createTicket(inputs)
    setIsCreating(false)
    ticket.ticketId
  })

  // Update
  const [updateTitle] = useMutation<
    void,
    Parameters<Mutation['updateTicketTitle']>[0]
  >((mutation, inputs) => {
    mutation.updateTicketTitle(inputs)
  })
  const [updateDescription] = useMutation<
    void,
    Parameters<Mutation['updateTicketDescription']>[0]
  >((mutation, inputs) => {
    mutation.updateTicketDescription(inputs)
  })
  const [updateDeadline] = useMutation<
    void,
    Parameters<Mutation['updateTicketDeadline']>[0]
  >((mutation, inputs) => {
    mutation.updateTicketDeadline(inputs)
  })

  // Delete
  const [deleteTicket] = useMutation<
    void,
    Parameters<Mutation['deleteTicket']>[0]
  >((mutation, inputs) => {
    mutation.deleteTicket(inputs)
  })

  if ($state.error) {
    handleError($state.error)
    return
  }
  return (
    <div className="space-y-4">
      <div className="mb-4">
        {isCreating ? (
          <TicketForm
            onSubmit={(t) =>
              createTicket({
                args: t,
              })
            }
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
        <div
          key={`ticket-${ticket.ticketId}`}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold w-full">
              <EditableTextField
                value={ticket.title}
                onSave={(title) =>
                  updateTitle({
                    args: {
                      ticketId: ticket.ticketId,
                      title,
                    },
                  })
                }
              />
            </h3>
            <div className="flex space-x-2">
              <DeleteButton
                onDelete={() =>
                  deleteTicket({ args: { ticketId: ticket.ticketId } })
                }
              />
            </div>
          </div>
          <div className="mb-2">
            <EditableTextField
              value={ticket.description ?? ''}
              onSave={(description) =>
                updateDescription({
                  args: {
                    ticketId: ticket.ticketId,
                    description,
                  },
                })
              }
              inputType="textarea"
            />
          </div>
          <p className="text-sm text-gray-500">
            期限:&nbsp;
            <EditableDateTimeField
              value={ticket.deadline ? new Date(ticket.deadline) : undefined}
              onSave={(deadline) =>
                updateDeadline({
                  args: {
                    ticketId: ticket.ticketId,
                    deadline: deadline.toISOString(),
                  },
                })
              }
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
