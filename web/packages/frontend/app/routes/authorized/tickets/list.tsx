import { TicketList } from '~/features/tickets'
import type { Route } from './+types/list'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Tickets' }]
}

export default () => {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">チケット一覧</h1>
      <TicketList />
    </main>
  )
}
