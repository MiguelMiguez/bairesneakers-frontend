// ===========================================
// COMPONENTS - MARQUEE (Infinite Scroll)
// ===========================================

import { ReactNode, useRef, useEffect, useState, useCallback } from "react";
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
  const [duration, setDuration] = useState(20);
  const [isVisible, setIsVisible] = useState(true);

  const calculateAnimation = useCallback(() => {
    if (!containerRef.current || !contentRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const contentWidth = contentRef.current.scrollWidth / copies;

    // Need enough copies to fill at least 2x the container width
    const neededCopies = Math.ceil((containerWidth * 2) / contentWidth) + 1;
    const minCopies = Math.max(neededCopies, 2);

    if (minCopies !== copies) {
      setCopies(minCopies);
    }

    // Calculate duration based on content width and speed
    const newDuration = contentWidth / speed;
    setDuration(newDuration);
  }, [copies, speed]);

  useEffect(() => {
    calculateAnimation();
    window.addEventListener("resize", calculateAnimation);

    return () => window.removeEventListener("resize", calculateAnimation);
  }, [calculateAnimation, children]);

  // Handle visibility change to reset animation when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else {
        // Small delay to reset animation smoothly
        setIsVisible(false);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

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
          animationPlayState: isVisible ? "running" : "paused",
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
