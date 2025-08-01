// Simple IntersectionObserver hook to add 'animate-in' to elements with 'reveal-element' class
import { useEffect } from "react";

export default function useReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elements = Array.from(document.querySelectorAll('.reveal-element'));
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
