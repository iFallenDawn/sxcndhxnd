import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { NotFound } from '@/pages/NotFound'
import { Placeholder } from '@/pages/Placeholder'

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
      { path: 'dashboard', element: <Placeholder name="Dashboard" /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
