import { SigninForm } from '~/features/signin'
import type { Route } from './+types/signin'

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'Sign in' },
    { name: 'description', content: 'Welcome to Try GraphQL!' },
  ]
}

export default () => {
  return <SigninForm />
}
