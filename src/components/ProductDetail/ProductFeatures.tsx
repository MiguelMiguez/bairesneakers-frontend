// ===========================================
// PRODUCT DETAIL - PRODUCT FEATURES
// ===========================================

import { Truck, RotateCcw, Shield, type LucideIcon } from "lucide-react";
import styles from "./ProductDetail.module.css";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: Truck,
    title: "Envío gratis",
    description: "En compras mayores a $50.000",
  },
  {
    icon: RotateCcw,
    title: "Devolución gratuita",
    description: "30 días para cambios",
  },
  {
    icon: Shield,
    title: "Garantía oficial",
    description: "Producto 100% original",
  },
];

interface ProductFeaturesProps {
  features?: Feature[];
}

export function ProductFeatures({
  features = DEFAULT_FEATURES,
}: ProductFeaturesProps) {
  return (
    <div className={styles.features}>
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className={styles.feature}>
            <Icon size={20} />
            <div>
              <strong>{feature.title}</strong>
              <span>{feature.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
