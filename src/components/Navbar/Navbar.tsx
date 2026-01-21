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
            <span className={styles.logoText}>BS</span>
            <span className={styles.logoFull}>BaireSneakers</span>
          </Link>

          <ul
            className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ""}`}
          >
            <li>
              <Link
                to="/"
                className={styles.navLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/sneakers"
                className={styles.navLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sneakers
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={styles.navLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contacto
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/admin"
                  className={styles.navLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}

            {/* Mobile-only auth buttons */}
            <li className={styles.mobileAuthItem}>
              {isAuthenticated ? (
                <button
                  className={styles.mobileLogoutButton}
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  className={styles.mobileLoginButton}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={18} />
                  Ingresar
                </Link>
              )}
            </li>
          </ul>

          <div className={styles.actions}>
            {/* Desktop-only auth */}
            <div className={styles.desktopAuth}>
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
            </div>

            {/* Mobile controls - cart and menu together */}
            <div className={styles.mobileControls}>
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

              <button
                className={styles.mobileMenuButton}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop cart */}
            <button
              className={styles.desktopCartButton}
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
