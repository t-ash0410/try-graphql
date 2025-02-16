import { Outlet } from 'react-router'
import { Header } from './header'
import { useCheckSession } from './use-check-session'

export default () => {
  useCheckSession()

  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
