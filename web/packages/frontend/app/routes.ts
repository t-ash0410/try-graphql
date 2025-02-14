import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { pagePaths } from './consts'

export default [
  index('routes/home.tsx'),

  route(pagePaths.signin.path, pagePaths.signin.file),
] satisfies RouteConfig
