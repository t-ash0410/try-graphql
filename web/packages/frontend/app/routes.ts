import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes'
import { pagePaths } from './consts'

export default [
  index(pagePaths.public.root.file),

  route(pagePaths.public.signin.path, pagePaths.public.signin.file),
  route(pagePaths.public.ssoSlack.path, pagePaths.public.ssoSlack.file),

  layout('./routes/authorized/layouts/layout.tsx', [
    route(pagePaths.authorized.tickets.path, pagePaths.authorized.tickets.file),
  ]),
] satisfies RouteConfig
