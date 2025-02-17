import { RootRedirect } from '~/features/root'
import type { Route } from './+types/root'

export function meta(_: Route.MetaArgs) {
  return [{ title: 'Redirecting...' }]
}

export default () => {
  return <RootRedirect />
}
