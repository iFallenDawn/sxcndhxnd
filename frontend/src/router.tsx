import type { RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { NotFound } from '@/pages/NotFound'
import { Placeholder } from '@/pages/Placeholder'
import { RequireAuth } from '@/components/guards/RequireAuth'
import { RequireAdmin } from '@/components/guards/RequireAdmin'
import { RouteError } from '@/components/layout/RouteError'

// Dev-only route: guarded by `import.meta.env.DEV`, which Vite inlines as a
// literal `false` in production builds. That lets the bundler dead-code
// eliminate this whole branch — including the dynamic import() of
// Styleguide — so it never ships in `dist/`. Verified by grepping the built
// output for "Styleguide" (see PR notes / CLAUDE.md verification section).
const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'styleguide',
        lazy: async () => {
          const { Styleguide } = await import('@/pages/Styleguide')
          return { Component: Styleguide }
        },
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Placeholder name="Home" /> },
      { path: 'store', element: <Placeholder name="Store" /> },
      {
        path: 'store/:productId',
        element: <Placeholder name="Product" />,
      },
      { path: 'gallery', element: <Placeholder name="Gallery" /> },
      { path: 'projects', element: <Placeholder name="Projects" /> },
      {
        path: 'commissions/request',
        element: <Placeholder name="Commission Request" />,
      },
      { path: 'contact', element: <Placeholder name="Contact" /> },
      { path: 'sign-in', element: <Placeholder name="Sign In" /> },
      { path: 'register', element: <Placeholder name="Register" /> },
      {
        // Any authenticated user must be signed in to reach the dashboard;
        // the dashboard itself is the site's only admin-facing area, so it
        // additionally requires the admin probe to pass (see RequireAdmin).
        element: <RequireAuth />,
        children: [
          {
            element: <RequireAdmin />,
            children: [{ path: 'dashboard', element: <Placeholder name="Dashboard" /> }],
          },
        ],
      },
      ...devRoutes,
      { path: '*', element: <NotFound /> },
    ],
  },
])
