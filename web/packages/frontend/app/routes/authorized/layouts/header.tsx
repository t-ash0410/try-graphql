import { Menu } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '~/components'
import { HamburgerMenu } from './hamburger-menu'
import { Logo } from './logo'

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">メニューを開く</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0">
            <HamburgerMenu />
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}

export { Header }
