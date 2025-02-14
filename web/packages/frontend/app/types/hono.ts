import type { App } from '@try-graphql/backend'
import type { ClientResponse, hc } from 'hono/client'

type API = ReturnType<typeof hc<App>>

// biome-ignore lint/suspicious/noExplicitAny: Defined as a utility type, it should be widely available.
type Response<T extends (...args: any[]) => Promise<ClientResponse<any>>> =
  Awaited<ReturnType<T>> extends ClientResponse<infer Out> ? Out : never

type RequestArgs = {
  // biome-ignore lint/suspicious/noExplicitAny: Defined as a utility type, it should be widely available.
  query: any
  // biome-ignore lint/suspicious/noExplicitAny: Defined as a utility type, it should be widely available.
  param: any
  // biome-ignore lint/suspicious/noExplicitAny: Defined as a utility type, it should be widely available.
  json: any
}

type RequestQueryParams<
  T extends (
    args: RequestArgs,
    // biome-ignore lint/suspicious/noExplicitAny: Defined as a utility type, it should be widely available.
  ) => any,
> = Parameters<T>['0']['query']

type RequestJsonParams<
  T extends (
    args: RequestArgs,
    // biome-ignore lint/suspicious/noExplicitAny: Defined as a utility type, it should be widely available.
  ) => any,
> = Parameters<T>['0']['json']

export type { API, RequestQueryParams, RequestJsonParams, Response }
