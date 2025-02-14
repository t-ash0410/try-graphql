import { type RouteConfig, route } from '@react-router/dev/routes'
import { pagePaths } from './consts'

export default [
  route(pagePaths.signin.path, pagePaths.signin.file),
] satisfies RouteConfig
