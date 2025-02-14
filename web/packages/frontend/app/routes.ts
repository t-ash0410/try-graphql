import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { pagePaths } from './consts'

export default [
  index(pagePaths.root.file),
  route(pagePaths.signin.path, pagePaths.signin.file),
] satisfies RouteConfig
