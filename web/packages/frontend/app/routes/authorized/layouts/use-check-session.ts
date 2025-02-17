import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { pagePaths } from '~/consts'
import { useGetSession } from '~/hooks/api'
import { handleError } from '~/util/handle-error'

const useCheckSession = () => {
  const nav = useNavigate()

  const { data, isLoading, isError } = useGetSession()
  useEffect(() => {
    if (isLoading || !data) return
    if (isError) {
      handleError(new Error('エラーが発生しました'))
      return
    }
    if (data.status === 401) {
      nav(pagePaths.public.signin.path)
      return
    }
  }, [nav, data, isLoading, isError])
}

export { useCheckSession }
