import { useState } from 'react'
import { pagePaths } from '~/consts'
import { useGetLocalStorage } from '~/hooks'
import { getHC } from '~/lib'
import { handleError } from '~/util/handle-error'

const SLACK_BASE_URL = 'https://slack.com/openid/connect/authorize'

export function useSlackSSOButton() {
  const teamId = useGetLocalStorage('SLACK_TEAM_ID')
  const bff = getHC()

  const [isPending, setIsPending] = useState<boolean>(false)

  async function onClick() {
    setIsPending(true)

    try {
      const res = await bff.auth.oidc.session.$get()
      if (!res.ok) {
        throw new Error('サインインに失敗しました')
      }
      const token = await res.json()

      const params = new URLSearchParams({
        scope: 'openid email profile',
        response_type: 'code',
        redirect_uri: `${location.origin}${pagePaths.sso.slack.path}`,
        client_id: import.meta.env.BASE_URL,
        team: teamId,
        state: token.state,
        nonce: token.nonce,
      })
      const url = `${SLACK_BASE_URL}?${params.toString()}`

      location.href = url
    } catch (err) {
      handleError(err)
      setIsPending(false)
    }
  }

  return { onClick, isPending }
}
