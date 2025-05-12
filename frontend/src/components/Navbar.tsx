import { useState } from "react"
import Logo from './Logo'

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
)

const ShoppingCart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
)

const Hamburger = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
)

const Account = () => {
  return (
    <a href={'/account'}>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    </a>
  )
}

interface NavbarProps {
  currentPage: string
}

const Navbar = ({ currentPage }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const routes = [
    ["/about", "About Me"],
    ["/commissions", "Commissions"],
    ["/contact", "Contact"],
    ["/faq", "FAQ"],
    ["/gallery", "Gallery"],
    ["/projects", "Projects"],
    ["/store", "Store"],
  ]

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  // change this to animating nav
  const MobileNavIcon = () => {
    return (
      <div>
        {isOpen ? <Close /> : <Hamburger />}
      </div>
    )
  }

  const links = routes.map((route) => {
    const path = route[0]
    const text = route[1]
    return (
      <li
        key={text}
        className='sm:px-2.5'
      >
        <a
          href={path}
          className={currentPage === path ? `hi` : 'hi2'}
        >
          <span
            className='text-2xl'
          >
            {text}
          </span>
        </a>
      </li>
    )
  })

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-orange-200 z-50">
        <div className="px-4 py-5 flex justify-between items-center">
          {/* Logo */}
          <a href="/">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex space-x-8">
              {links}
              <Account />
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex">
            <Account />
            <button
              onClick={handleOpen}
              className="md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <MobileNavIcon />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay - Only visible on mobile when menu is open */}
      <div
        className={`md:hidden fixed inset-0 bg-orange-200 z-40 flex flex-col justify-center items-center transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        <nav className="text-center">
          <ul className="space-y-6 text-xl">
            {links}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Navbar
