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
    <>
    </>
  );
};

export default Navbar;
