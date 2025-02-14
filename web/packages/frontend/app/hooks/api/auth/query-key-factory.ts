import type { GetSSOSlackQueryParams } from './get-sso-slack/types'

export const authQueryKeys = {
  all: ['auth'] as const,
  ssoSlack: (query: GetSSOSlackQueryParams) =>
    [...authQueryKeys.all, query] as const,
}
