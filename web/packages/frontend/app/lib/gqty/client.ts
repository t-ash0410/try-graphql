/**
 * GQty: You can safely modify this file based on your needs.
 */

import {
  Cache,
  type QueryFetcher,
  createClient,
  defaultResponseHandler,
} from 'gqty'
import {
  type GeneratedSchema,
  generatedSchema,
  scalarsEnumsHash,
} from './schema.generated'

const queryFetcher: QueryFetcher = async (
  { query, variables, operationName },
  fetchOptions,
) => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
    mode: 'cors',
    ...fetchOptions,
  })

  return await defaultResponseHandler(response)
}

const cache = new Cache(
  undefined,
  /**
   * Default option is immediate cache expiry but keep it for 5 minutes,
   * allowing soft refetches in background.
   */
  {
    maxAge: 0,
    staleWhileRevalidate: 5 * 60 * 1000,
    normalization: true,
  },
)

export const client = createClient<GeneratedSchema>({
  schema: generatedSchema,
  scalars: scalarsEnumsHash,
  cache,
  fetchOptions: {
    fetcher: queryFetcher,
  },
})

// Core functions
export const { resolve, subscribe, schema } = client

export * from './schema.generated'
