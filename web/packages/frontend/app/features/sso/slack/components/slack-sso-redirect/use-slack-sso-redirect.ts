import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { localStorageKeys, pagePaths } from '~/consts'
import { useGetSSOSlack } from '~/hooks/api'
import { handleError } from '~/util/handle-error'

export function useSlackSSORedirect() {
  const nav = useNavigate()

  const [params] = useSearchParams()
  const code = params.get('code')
  const state = params.get('state')
  const { data, isLoading, isError } = useGetSSOSlack(
    {
      code: code || '',
      state: state || '',
    },
    !!code && !!state,
  )
  useEffect(() => {
    if (isLoading || !data) return
    if (isError) {
      handleError(new Error('サインインに失敗しました'))
      nav(pagePaths.root.path)
      return
    }
    if (data.slackTeamId) {
      localStorage.setItem(localStorageKeys.SLACK_TEAM_ID, data.slackTeamId)
    }
    nav(pagePaths.tickets.path)
  }, [nav, data, isLoading, isError])
}
