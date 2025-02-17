import { useNavigate } from 'react-router'
import { pagePaths } from '~/consts'
import { getHC } from '~/lib/hono'

const useSignout = () => {
  const nav = useNavigate()
  const handleSignout = async () => {
    const hc = getHC()
    await hc.session.$delete()
    nav(pagePaths.public.signin.path)
  }
  return { handleSignout }
}

export { useSignout }
