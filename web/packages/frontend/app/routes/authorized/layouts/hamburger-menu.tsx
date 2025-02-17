import { LogOut } from 'lucide-react'
import { Button } from '~/components'
import { useSignout } from './use-signout'

const HamburgerMenu = () => {
  const { handleSignout } = useSignout()
  return (
    <nav className="py-2">
      <ul>
        <li>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            ログアウト
          </Button>
        </li>
      </ul>
    </nav>
  )
}

export { HamburgerMenu }
