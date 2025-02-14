import { useQuery } from '@tanstack/react-query'
import { getHC } from '~/lib'
import { handleError } from '~/util/handle-error'
import { authQueryKeys } from '../query-key-factory'
import type { GetSSOSlackQueryParams } from './types'

export const useGetSSOSlack = (
  query: GetSSOSlackQueryParams,
  enabled: boolean,
) => {
  const bff = getHC()
  return useQuery({
    queryKey: [...authQueryKeys.ssoSlack(query)],
    queryFn: async () => {
      const res = await bff.auth.oidc.slack.$get({
        query,
      })
      if (!res.ok) handleError('システムエラー')
      return await res.json()
    },
    enabled,
  })
}
