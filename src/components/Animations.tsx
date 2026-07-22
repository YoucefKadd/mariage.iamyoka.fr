"use client";

import { useEffect } from "react";

export default function Animations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observer les éléments qui n'ont pas encore la classe visible
    document.querySelectorAll(".fade-in-up:not(.visible)").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }); // Sans tableau de dépendances, s'exécute après chaque rendu pour les données asynchrones

  return null;
}
