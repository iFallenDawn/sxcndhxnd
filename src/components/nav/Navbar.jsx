import { useState } from "react";
import styles from "./Navbar.module.css";
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

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const Icon = () => {
    if (isOpen) return <IoMdClose size={42} color='white' />;
    else return <RxHamburgerMenu size={42} color='white' />;
  };

  const links = routes.map((route) => {
    const path = route[0];
    const text = route[1];
    return (
      <li key={text}>
        <a
          href={path}
          className={currentPage === path ? `${styles.primaryNavigationLink} ${styles.active}` : styles.primaryNavigationLink}
        >
          {text}
        </a>
      </li>
    );
  });

  return (
    <header className={`${styles.primaryHeader} ${styles.flex}`}>
      <div className={styles.logo}>
        <a href="/">
          <img src={sxcndhxndlogo.src} alt="sxcndhxnd logo" />
        </a>
      </div>
      <button onClick={handleOpen} className={styles.mobileNavToggle}>{<Icon />}</button>
      <nav>
        <ul id='primary-navigation' className={`${styles.flex} ${styles.primaryNavigation}`}>{links}</ul>
      </nav>
    </header>
  );
};

export default Navbar;
