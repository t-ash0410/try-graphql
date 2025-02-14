import { useEffect } from 'react'
import { redirect } from 'react-router'
import { pagePaths } from '~/consts'
import { useGetSession } from '~/hooks/api'
import { handleError } from '~/util/handle-error'

export function useRootRedirect() {
  const { data, isLoading, isError } = useGetSession()
  useEffect(() => {
    if (isLoading || !data) return
    if (isError) {
      handleError(new Error('エラーが発生しました'))
      return
    }
    if (data.status === 401) {
      redirect(pagePaths.signin.path)
      return
    }
    redirect(pagePaths.tickets.path)
  }, [data, isLoading, isError])
}
