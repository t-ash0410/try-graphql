import { QueryClient } from '@tanstack/react-query'

const getQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  })
}

export { getQueryClient }
