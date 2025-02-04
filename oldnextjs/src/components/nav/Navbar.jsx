'use client'
import { useState } from "react"
import Logo from '../Logo'
// import ShoppingCart from "./ShoppingCart"
// import Hamburger from "./Hamburger"
// import Close from "./Close"

const Close = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-x"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

const ShoppingCart = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-shopping-cart"
  >
    <circle cx={8} cy={21} r={1} />
    <circle cx={19} cy={21} r={1} />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
)

const Hamburger = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="lucide lucide-menu"
  >
    <path d="M4 12h16M4 6h16M4 18h16" />
  </svg>
)

const Account = (props) => {
  return (
    <a href={'/account'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-user"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </a>
  )
}

const Navbar = (props) => {
  const { currentPage } = props
  const [isOpen, setIsOpen] = useState(false)

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
      <div onClick={handleOpen}>
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
        className=' sm:px-2.5'
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
    // overall nav
    <div className='flex flex-col absolute h-svh sm:flex-row'>
      {/* Mobile Nav */}
      <div className={`${!isOpen ? 'h-12' : 'h-full'} flex flex-col fixed top-0 w-full sm:hidden`}>
        {/* top mobile nav*/}
        <div className='flex flex-row w-full items-center justify-between px-4 py-1 bg-amber-400'>
          <Logo />
          <div className='flex flex-row items-center justify-between'>
            <Account />
            <ShoppingCart />
            <MobileNavIcon />
          </div>
        </div>
        {/* rest of nav */}
        <div className={!isOpen ? 'hidden' : 'flex flex-grow flex-col bg-amber-400'}>
          <div className='flex flex-grow flex-col justify-center'>
            {/*middle mobile nav*/}
            <div className='flex flex-col items-center justify-center'>
              <ul className='flex flex-col items-center '>
                {links}
              </ul>
            </div>
          </div>
          {/*bottom mobile nav*/}
          <div className='flex flex-row items-center justify-center'>
            <p>Instagram</p>
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className='hidden sm:flex sm:bg-amber-400 sm:fixed sm:top-0 sm:h-12 sm:w-full'>
        <div className='flex flex-row items-center justify-between w-full'>
          <div className='mx-6'>
            <Logo />
          </div>
          <div className='flex flex-row items-center'>
            <ul className='flex flex-row items-center justify-between'>
              {links}
              <Account />
              <ShoppingCart />
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
