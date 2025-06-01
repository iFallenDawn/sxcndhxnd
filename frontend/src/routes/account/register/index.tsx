import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account/register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account/register/"!</div>
}
