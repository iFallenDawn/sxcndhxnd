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
    if (isOpen) return <IoMdClose size={42} />;
    else return <RxHamburgerMenu size={42} />;
  };

  const links = routes.map((route) => {
    const path = route[0];
    const text = route[1];
    return (
      <div className={styles.headerNavLinkContainer} key={text}>
        <a
          href={path}
          className={
            currentPage == path
              ? `${styles.active} ${styles.headerNavLink}`
              : styles.headerNavLink
          }
        >
          {text}
        </a>
      </div>
    );
  });

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <a href="/">
          <img src={sxcndhxndlogo.src} alt="sxcndhxnd logo" />
        </a>
      </div>
      <div className={styles.headerBurger}>
        <button className={styles.burgerButton} onClick={handleOpen}>{<Icon />}</button>
      </div>
      <div className={styles.headerNav}>{links}</div>
    </header>
  );
};

export default Navbar;
