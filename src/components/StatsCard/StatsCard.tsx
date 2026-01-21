// ===========================================
// COMPONENT - STATS CARD
// ===========================================

import { ReactNode } from "react";
import styles from "./StatsCard.module.css";

export interface StatCardData {
  id: string;
  label: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  bgColor: string;
}

interface StatsCardProps {
  stat: StatCardData;
  className?: string;
}

interface StatsGridProps {
  stats: StatCardData[];
  className?: string;
}

export function StatsCard({ stat, className }: StatsCardProps) {
  return (
    <div className={`${styles.card} ${className || ""}`}>
      <div
        className={styles.iconWrapper}
        style={{ backgroundColor: stat.bgColor }}
      >
        <span style={{ color: stat.color }}>{stat.icon}</span>
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{stat.value}</span>
        <span className={styles.label}>{stat.label}</span>
      </div>
    </div>
  );
}

export function StatsGrid({ stats, className }: StatsGridProps) {
  return (
    <div className={`${styles.grid} ${className || ""}`}>
      {stats.map((stat) => (
        <StatsCard key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
