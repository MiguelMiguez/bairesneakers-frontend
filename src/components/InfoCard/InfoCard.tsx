// ===========================================
// COMPONENTS - INFO CARD
// ===========================================

import { ReactNode } from "react";
import styles from "./InfoCard.module.css";

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function InfoCard({ icon, title, description }: InfoCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
}
