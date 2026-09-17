import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/**
 * Resets scroll to the top on every route change (a fresh `PUSH`/`REPLACE`
 * navigation), while leaving browser back/forward (`POP`) navigation alone
 * so the native scroll-position restoration for those cases still applies.
 * Renders nothing.
 */
export function ScrollRestoration() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0)
    }
  }, [pathname, navigationType])

  return null
}
