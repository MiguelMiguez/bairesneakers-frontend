// ===========================================
// PAGES - HOME PAGE (Redesign)
// ===========================================

import { useNavigate } from "react-router-dom";
import {
  Truck,
  BadgeCheck,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
} from "lucide-react";
import { useFeaturedProducts } from "@/hooks";
import { ProductCard, ProductCardSkeleton, Marquee } from "@/components";
import styles from "./HomePage.module.css";

// Datos de promociones bancarias
const bankPromos = [
  { bank: "BBVA", offer: "25% OFF", detail: "con tarjetas de crédito" },
  { bank: "Santander", offer: "20% OFF", detail: "+ 6 cuotas sin interés" },
  { bank: "Galicia", offer: "30% OFF", detail: "los días miércoles" },
  { bank: "Macro", offer: "15% OFF", detail: "+ 3 cuotas sin interés" },
  { bank: "ICBC", offer: "20% OFF", detail: "en toda la tienda" },
  { bank: "Naranja X", offer: "6 cuotas", detail: "sin interés" },
];

// Marcas con las que trabaja la tienda
const brands = [
  {
    name: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  },
  {
    name: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  },
  {
    name: "Puma",
    logo: "https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg",
  },

  {
    name: "Converse",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg",
  },
  {
    name: "Vans",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg",
  },

  {
    name: "Jordan",
    logo: "https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg",
  },
];

export function HomePage() {
  const { products, isLoading } = useFeaturedProducts(4);
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Promo Banner - Using Marquee */}
      <div className={styles.promoBanner}>
        <Marquee speed={40}>
          {bankPromos.map((promo, i) => (
            <div key={i} className={styles.promoItem}>
              <span className={styles.promoBank}>{promo.bank}</span>
              <span className={styles.promoOffer}>{promo.offer}</span>
              <span className={styles.promoDetail}>{promo.detail}</span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Nueva Colección 2026</span>
          <h1>
            ELEVA TU
            <br />
            <span className={styles.heroAccent}>ESTILO</span>
          </h1>
          <p>Descubrí las últimas tendencias en sneakers premium</p>
          <div className={styles.heroActions}>
            <button
              className={styles.heroPrimary}
              onClick={() => navigate("/sneakers")}
            >
              Explorar Colección
              <ArrowRight size={18} />
            </button>
            <button
              className={styles.heroSecondary}
              onClick={() => navigate("/sneakers?category=new")}
            >
              Lo Nuevo
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800"
            alt="Featured Sneaker"
          />
        </div>
      </section>

      {/* Brands Marquee */}
      <section className={styles.brands}>
        <Marquee speed={30} pauseOnHover>
          {brands.map((brand, i) => (
            <div key={i} className={styles.brandItem}>
              <img src={brand.logo} alt={brand.name} />
            </div>
          ))}
        </Marquee>
      </section>

      {/* Featured Products */}
      <section className={styles.featured}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionTag}>Selección Curada</span>
              <h2 className={styles.sectionTitle}>Destacados</h2>
            </div>
            <button
              className={styles.viewAllLink}
              onClick={() => navigate("/sneakers")}
            >
              Ver todos
              <ArrowRight size={16} />
            </button>
          </div>

          <div className={styles.productsGrid}>
            {isLoading
              ? [...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)
              : products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={() => navigate(`/sneakers/${product.id}`)}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className={styles.featuresStrip}>
        <div className={styles.featureItem}>
          <Truck size={24} strokeWidth={1.5} />
          <div>
            <strong>Envío Gratis</strong>
            <span>En compras +$50.000</span>
          </div>
        </div>
        <div className={styles.featureItem}>
          <BadgeCheck size={24} strokeWidth={1.5} />
          <div>
            <strong>100% Original</strong>
            <span>Garantizado</span>
          </div>
        </div>
        <div className={styles.featureItem}>
          <ShieldCheck size={24} strokeWidth={1.5} />
          <div>
            <strong>Pago Seguro</strong>
            <span>Mercado Pago</span>
          </div>
        </div>
        <div className={styles.featureItem}>
          <RotateCcw size={24} strokeWidth={1.5} />
          <div>
            <strong>Devoluciones</strong>
            <span>30 días</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>¿Listo para encontrar tu próximo par?</h2>
          <p>Unite a nuestra comunidad y recibí ofertas exclusivas</p>
          <div className={styles.ctaForm}>
            <input type="email" placeholder="Tu email" />
            <button>Suscribirse</button>
          </div>
        </div>
      </section>
    </div>
  );
}
