import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/api-error'

/**
 * Shared TanStack Query client. Retries are disabled for 4xx responses
 * (they won't succeed on retry — e.g. 404/403/401) but left on the default
 * for network errors and 5xx.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 2
      },
    },
  },
})
