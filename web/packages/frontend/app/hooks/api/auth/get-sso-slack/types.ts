import type { API, RequestQueryParams } from '~/types'

type GetSSOSlackApi = API['auth']['oidc']['slack']['$get']

type GetSSOSlackQueryParams = RequestQueryParams<GetSSOSlackApi>

export type { GetSSOSlackApi, GetSSOSlackQueryParams }
