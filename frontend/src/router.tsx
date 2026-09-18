import type { RouteObject } from 'react-router'
import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { NotFound } from '@/pages/NotFound'
import { Home } from '@/pages/Home'
import { Store } from '@/pages/Store'
import { ProductDetail } from '@/pages/ProductDetail'
import { Gallery } from '@/pages/Gallery'
import { Dashboard } from '@/pages/Dashboard'
import { Placeholder } from '@/pages/Placeholder'
import { RequireAuth } from '@/components/guards/RequireAuth'
import { RequireAdmin } from '@/components/guards/RequireAdmin'
import { RouteError } from '@/components/layout/RouteError'
import { SignIn } from '@/pages/auth/SignIn'
import { Register } from '@/pages/auth/Register'
import { Account } from '@/pages/auth/Account'

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
      { index: true, element: <Home /> },
      { path: 'store', element: <Store /> },
      {
        path: 'store/:productId',
        element: <ProductDetail />,
      },
      { path: 'gallery', element: <Gallery /> },
      { path: 'projects', element: <Placeholder name="Projects" /> },
      {
        path: 'commissions/request',
        element: <Placeholder name="Commission Request" />,
      },
      { path: 'contact', element: <Placeholder name="Contact" /> },
      { path: 'sign-in', element: <SignIn /> },
      { path: 'register', element: <Register /> },
      {
        // Any authenticated user must be signed in to reach these; the
        // dashboard additionally requires the admin probe to pass (see
        // RequireAdmin).
        element: <RequireAuth />,
        children: [
          { path: 'account', element: <Account /> },
          {
            element: <RequireAdmin />,
            children: [{ path: 'dashboard', element: <Dashboard /> }],
          },
        ],
      },
      ...devRoutes,
      { path: '*', element: <NotFound /> },
    ],
  },
])
