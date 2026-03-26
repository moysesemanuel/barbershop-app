"use client";

import { useEffect, useState } from "react";
import styles from "./back-to-top-button.module.css";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 320);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className={styles.button}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      type="button"
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
    >
      ↑
    </button>
  );
}
