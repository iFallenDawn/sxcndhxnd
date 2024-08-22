import { useState } from "react";
import styles from "./Navbar.css";
import sxcndhxndlogo from "../../assets/sxcndhxndlogo.jpg";
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

  const links = routes.map((route) => {
    const path = route[0];
    const text = route[1];
    return (
      <div className="header-nav-link">
        <a
          href={path}
          className={
            currentPage == path
              ? "active header-nav-link-a"
              : "header-nav-link-a"
          }
        >
          {text}
        </a>
      </div>
    );
  });

  return (
    <header className="header">
      <div className="header-title">
        <a href="/">
          <img src={sxcndhxndlogo.src} alt="sxcndhxnd logo" />
        </a>
      </div>
      <div className="header-burger">
        {isOpen ? <IoMdClose size={42} /> : <RxHamburgerMenu size={42} />}
      </div>
      <div className="header-nav">{links}</div>
    </header>
  );
};

export default Navbar;
