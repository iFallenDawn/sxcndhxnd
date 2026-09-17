import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { NotFound } from '@/pages/NotFound'
import { Placeholder } from '@/pages/Placeholder'
import { RequireAuth } from '@/components/guards/RequireAuth'
import { RequireAdmin } from '@/components/guards/RequireAdmin'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
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
      { path: '*', element: <NotFound /> },
    ],
  },
])
