import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const follower = document.createElement('div');
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    let fx = 0, fy = 0;
    let rafId = 0;

    const move = (e) => {
      const { clientX: x, clientY: y } = e;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      // lerp for follower
      const lerp = 0.18;
      fx += (x - fx) * lerp;
      fy += (y - fy) * lerp;
      follower.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
    };

    const animate = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => move(e));
    };

    window.addEventListener('mousemove', animate, { passive: true });

    return () => {
      window.removeEventListener('mousemove', animate);
      if (rafId) cancelAnimationFrame(rafId);
      cursor.remove();
      follower.remove();
    };
  }, []);

  return null;
}
