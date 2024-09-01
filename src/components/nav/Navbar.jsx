import { useState } from "react";
import Logo from './Logo'
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";

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
    setIsOpen(!isOpen);
  };

  // change this to animating nav
  const MobileNavIcon = () => {
    if (isOpen) return <IoMdClose size={42} color='black' />;
    else return <RxHamburgerMenu size={42} color='black' />;
  };

  const links = routes.map((route) => {
    const path = route[0];
    const text = route[1];
    return (
      <li
        class='m-5'
        key={text}
      >
        <a
          href={path}
          className={currentPage === path ? `hi` : 'hi2'}
        >
          <span
            class='text-2xl'
          >
            {text}
          </span>
        </a>
      </li>
    );
  });

  return (
    <header class='flex flex-wrap items-center bg-red-600 justify-between p-2'>
      <div>
        <a href="/">
          <Logo />
          {/* <img src={sxcndhxndlogo.src} alt="sxcndhxnd logo" /> */}
        </a>
      </div>
      <button onClick={handleOpen}>
        {<MobileNavIcon />}
      </button>
      <nav class='flex basis-full items-center justify-center text-center h-svh'>
        <ul>
          {links}
        </ul>
      </nav>
      <div>
        {/* could put actions here like socials */}
      </div>
    </header>
  );
};

export default Navbar;
