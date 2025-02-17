import { useState } from 'react'
import { Button, TableSkeleton } from '~/components'
import { useMutation, useQuery } from '~/lib/gqty'
import type { CreateTicket, Mutation, Tickets } from '~/lib/gqty'
import { formatDate } from '~/util/date'
import { handleError } from '~/util/handle-error'
import { DeleteButton } from '../delete-button'
import { EditableDateTimeField, EditableTextField } from '../editable-field'
import { TicketForm } from '../ticket-form'

const prepareTickets = (tickets: Tickets[]) => {
  tickets.map(
    ({ ticketId, title, description, deadline, createdAt, updatedAt }) => {},
  )
}

const prepareCreateTicket = ({
  ticketId,
  title,
  description,
  deadline,
  createdAt,
  updatedAt,
}: CreateTicket) => {}

export const TicketList = () => {
  const { tickets, $state, $refetch } = useQuery({
    prepare({ query: { tickets } }) {
      prepareTickets(tickets())
    },
  })
  const data = tickets()

  // Create
  const [isCreating, setIsCreating] = useState(false)
  const [createTicket] = useMutation<
    void,
    Parameters<Mutation['createTicket']>[0]
  >(async (mutation, inputs) => {
    const res = await mutation.createTicket(inputs)
    prepareCreateTicket(res)
    setIsCreating(false)
    await $refetch()
  })

  // Update
  const [updateTitle] = useMutation<
    void,
    Parameters<Mutation['updateTicketTitle']>[0]
  >(async (mutation, inputs) => {
    await mutation.updateTicketTitle(inputs)
    inputs
    await $refetch()
  })
  const [updateDescription] = useMutation<
    void,
    Parameters<Mutation['updateTicketDescription']>[0]
  >(async (mutation, inputs) => {
    await mutation.updateTicketDescription(inputs)
    inputs
    await $refetch()
  })
  const [updateDeadline] = useMutation<
    void,
    Parameters<Mutation['updateTicketDeadline']>[0]
  >(async (mutation, inputs) => {
    await mutation.updateTicketDeadline(inputs)
    inputs
    await $refetch()
  })

  // Delete
  const [deleteTicket] = useMutation<
    void,
    Parameters<Mutation['deleteTicket']>[0]
  >(async (mutation, inputs) => {
    await mutation.deleteTicket(inputs)
    inputs
    await $refetch()
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
            onSubmit={async (t) => {
              await createTicket({
                args: t,
              })
            }}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <Button className="bg-primary" onClick={() => setIsCreating(true)}>
            新しいTODOを追加
          </Button>
        )}
      </div>
      {$state.isLoading ? <TableSkeleton /> : <></>}
      {data.map((ticket) => (
        <div
          key={`ticket-${ticket.ticketId}`}
          className="bg-white p-4 rounded-lg shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold w-full">
              <EditableTextField
                value={ticket.title}
                onSave={async (title) => {
                  const ticketId = ticket.ticketId
                  await updateTitle({
                    args: {
                      ticketId,
                      title,
                    },
                  })
                  ticket.title = title
                }}
              />
            </h3>
            <div className="flex space-x-2">
              <DeleteButton
                onDelete={async () => {
                  const ticketId = ticket.ticketId
                  await deleteTicket({ args: { ticketId } })
                }}
              />
            </div>
          </div>
          <div className="mb-2">
            <EditableTextField
              value={ticket.description ?? ''}
              onSave={async (description) => {
                const ticketId = ticket.ticketId
                await updateDescription({
                  args: {
                    ticketId,
                    description,
                  },
                })
              }}
              inputType="textarea"
            />
          </div>
          <p className="text-sm text-gray-500">
            期限:&nbsp;
            <EditableDateTimeField
              value={ticket.deadline ? new Date(ticket.deadline) : undefined}
              onSave={async (deadline) => {
                const ticketId = ticket.ticketId
                await updateDeadline({
                  args: {
                    ticketId,
                    deadline: deadline.toISOString(),
                  },
                })
              }}
            />
          </p>
          <p className="pt-1 text-xs text-gray-400">
            作成日時:&nbsp;{formatDate(new Date(ticket.createdAt))}
          </p>
          <p className="text-xs text-gray-400">
            更新日時:&nbsp;{formatDate(new Date(ticket.updatedAt))}
          </p>
        </div>
      ))}
    </div>
  )
}
