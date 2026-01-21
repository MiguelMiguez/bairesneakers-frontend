// ===========================================
// COMPONENTS - NAVBAR
// ===========================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks";
import { useCartItemCount } from "@/store";
import { Cart } from "../Cart";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const cartItemCount = useCartItemCount();

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoText}>SS</span>
            <span className={styles.logoFull}>SneakerSolid</span>
          </Link>

          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <ul
            className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ""}`}
          >
            <li>
              <Link to="/" className={styles.navLink}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/sneakers" className={styles.navLink}>
                Sneakers
              </Link>
            </li>
            <li>
              <Link to="/contact" className={styles.navLink}>
                Contacto
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin" className={styles.navLink}>
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <span className={styles.userName}>
                  <User size={16} />
                  {user?.displayName}
                </span>
                <button className={styles.logoutButton} onClick={logout}>
                  <LogOut size={16} />
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className={styles.loginButton}>
                <User size={16} />
                Ingresar
              </Link>
            )}

            <button
              className={styles.cartButton}
              onClick={() => setIsCartOpen(true)}
              aria-label="Carrito"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className={styles.cartBadge}>{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
