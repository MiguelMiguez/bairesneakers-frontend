import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Brand */}
          <div className={styles.brand}>
            <h3>Sneaker Solid</h3>
            <p>Tu tienda de sneakers favorita</p>
          </div>

          {/* Links */}
          <div className={styles.links}>
            <h4>Enlaces</h4>
            <nav>
              <Link to="/">Inicio</Link>
              <Link to="/sneakers">Productos</Link>
              <Link to="/contact">Contacto</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className={styles.contact}>
            <h4>Contacto</h4>
            <p>
              <Mail size={14} />
              info@sneakersolid.com
            </p>
            <p>
              <Phone size={14} />
              +54 11 1234-5678
            </p>
          </div>

          {/* Social */}
          <div className={styles.social}>
            <h4>Síguenos</h4>
            <div className={styles.socialLinks}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {currentYear} Sneaker Solid. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
