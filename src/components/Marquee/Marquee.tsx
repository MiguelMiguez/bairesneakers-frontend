// ===========================================
// COMPONENTS - MARQUEE (Infinite Scroll)
// ===========================================

import { ReactNode, useRef, useEffect, useState } from "react";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  children: ReactNode;
  speed?: number; // pixels per second
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const calculateCopies = () => {
      if (!containerRef.current || !contentRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth / copies;

      // Need enough copies to fill at least 2x the container width
      const neededCopies = Math.ceil((containerWidth * 2) / contentWidth) + 1;
      const minCopies = Math.max(neededCopies, 2);

      if (minCopies !== copies) {
        setCopies(minCopies);
      }
    };

    calculateCopies();
    window.addEventListener("resize", calculateCopies);

    return () => window.removeEventListener("resize", calculateCopies);
  }, [copies, children]);

  // Calculate animation duration based on speed
  const contentWidth = contentRef.current?.scrollWidth || 1000;
  const duration = contentWidth / copies / speed;

  return (
    <div
      ref={containerRef}
      className={`${styles.marquee} ${pauseOnHover ? styles.pauseOnHover : ""} ${className}`}
    >
      <div
        ref={contentRef}
        className={styles.track}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <div key={i} className={styles.content}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
