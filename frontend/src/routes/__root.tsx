import * as React from 'react'
import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Navbar from '../components/Navbar'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      <Navbar currentPage={'test'} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  )
}
