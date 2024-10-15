'use client'
import { useState } from "react";
import Logo from './Logo'
import ShoppingCart from "./ShoppingCart";
import Hamburger from "./Hamburger";
import Close from "./Close";

const Navbar = (props) => {
  const { currentPage } = props;
  const [isOpen, setIsOpen] = useState(false);

  const routes = [
    ["/", "Home"],
    ["/gallery", "Gallery"],
    ["/commissions", "Commissions"],
    ["/about", "About Me"],
    ["/contact", "Contact"],
  ];

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
  };

  const links = routes.map((route) => {
    const path = route[0];
    const text = route[1];
    return (
      <li
        key={text}
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
    );
  });

  return (
    // overall nav
    <div className='flex flex-col absolute h-svh sm:flex-row'>
      {/* Mobile Nav */}
      <div className='flex flex-col fixed top-0 w-full h-full sm:hidden '>
        {/* top mobile nav*/}
        <div className='flex flex-row w-full items-center justify-between px-4 py-1 bg-amber-400'>
          <Logo />
          <div className='flex flex-row items-center justify-between'>
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
      <div className='hidden sm:flex'>

      </div>
    </div>
  );
};

export default Navbar;
