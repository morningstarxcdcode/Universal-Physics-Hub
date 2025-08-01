// src/components/BackgroundFX.jsx
import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import p5 from "p5";

/**
 * BackgroundFX renders a fixed animated canvas behind the page.
 * Props:
 *  - variant: 'particles' | 'waves' | 'aurora'
 */
export default function BackgroundFX(props) {
  const { variant = 'particles' } = props;
  const hostRef = useRef(null);
  const p5Ref = useRef(null);

  useEffect(() => {
    if (!hostRef.current) return;
    let raf; // for graceful stop on blur

  const sketch = (s) => {
      let W = window.innerWidth;
      let H = Math.max(window.innerHeight, document.documentElement.clientHeight);

      // Shared state
      const particles = [];
      const MAX = Math.min(140, Math.floor((W * H) / 18000));
      let t = 0; // time for color/flow

      const mouse = { x: -9999, y: -9999 };

      s.setup = () => {
        const cnv = s.createCanvas(W, H);
        cnv.style('position', 'fixed');
        cnv.style('inset', '0');
        cnv.style('z-index', '-1');
        cnv.style('pointer-events', 'none');
        s.pixelDensity(1);
        s.frameRate(45);
        s.noiseSeed(Math.floor(Math.random() * 1e9));

        for (let i = 0; i < MAX; i++) {
          particles.push(newParticle());
        }
      };

      const newParticle = () => ({
        x: s.random(W),
        y: s.random(H),
        vx: s.random(-0.6, 0.6),
        vy: s.random(-0.6, 0.6),
        life: s.random(0.5, 1),
        size: s.random(1.2, 2.4),
      });

      // Smooth cycling between accent and secondary
      const palette = (k) => {
        const a = [0, 230, 230];
        const b = [138, 92, 255];
        const mix = 0.5 + 0.5 * Math.sin(k);
        const r = Math.round(a[0] * (1 - mix) + b[0] * mix);
        const g = Math.round(a[1] * (1 - mix) + b[1] * mix);
        const bch = Math.round(a[2] * (1 - mix) + b[2] * mix);
        return s.color(r, g, bch, 90);
      };

  const drawParticles = () => {
        s.blendMode(s.ADD);
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Flow field drift (curvy day line vibe)
          const ang = 2.5 * s.noise(p.x * 0.002, p.y * 0.002, t * 0.002) * Math.PI * 2;
          const spd = 0.5 + 0.5 * s.noise(p.y * 0.003, t * 0.001);
          p.vx += 0.04 * Math.cos(ang) * spd;
          p.vy += 0.04 * Math.sin(ang) * spd;

          // Mouse repulsion
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            const f = 60 / Math.max(60, Math.sqrt(d2));
            p.vx += dx * 0.02 * f;
            p.vy += dy * 0.02 * f;
          }

          // Integrate
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98; // damping
          p.vy *= 0.98;

          // Wrap
          if (p.x < -5) p.x = W + 5;
          if (p.x > W + 5) p.x = -5;
          if (p.y < -5) p.y = H + 5;
          if (p.y > H + 5) p.y = -5;

          // Render
          s.noStroke();
          s.fill(palette(t * 0.8 + i * 0.03));
          s.circle(p.x, p.y, p.size);

          // Trailing glow line
          s.stroke(palette(t * 0.7 + i * 0.02));
          s.strokeWeight(0.6);
          s.line(p.x, p.y, p.x - p.vx * 4, p.y - p.vy * 4);
        }
        s.blendMode(s.BLEND);
  };

  const drawWaves = () => {
        s.noFill();
        const rows = 10;
        for (let r = 0; r < rows; r++) {
          const y0 = (H / rows) * r + (t * 12 + r * 8) % (H / rows);
          s.stroke(palette(t * 0.4 + r));
          s.strokeWeight(1.2);
          let px = 0, py = y0;
          for (let x = 0; x <= W; x += 12) {
            const y = y0 + 18 * Math.sin((x + t * 40 + r * 30) * 0.01) + 8 * Math.sin((x - t * 25) * 0.02);
            if (x > 0) s.line(px, py, x, y);
            px = x; py = y;
          }
        }
  };

  const drawAurora = () => {
        s.noStroke();
        for (let i = 0; i < 3; i++) {
          s.fill(palette(t * 0.6 + i * 2));
          const w = W * (0.5 + 0.4 * Math.sin(t * 0.02 + i));
          const h = 180 + 80 * Math.sin(t * 0.015 + i * 1.7);
          const x = (W / 2) + 220 * Math.sin(t * 0.01 + i);
          const y = (H / 3) + 140 * Math.cos(t * 0.012 + i * 1.3);
          s.ellipse(x, y, w, h);
        }
  };

      s.windowResized = () => {
        W = window.innerWidth;
        H = Math.max(window.innerHeight, document.documentElement.clientHeight);
        s.resizeCanvas(W, H);
      };

      s.mouseMoved = () => { mouse.x = s.mouseX; mouse.y = s.mouseY; };

      s.draw = () => {
        t += 0.5;
        s.clear();
        s.push();
        s.background(0, 0, 0, 10);
        if (variant === 'particles') drawParticles();
        else if (variant === 'waves') drawWaves();
        else drawAurora();
        s.pop();
      };
  };

    p5Ref.current = new p5(sketch, hostRef.current);

    const handleVisibility = () => {
      if (document.hidden && p5Ref.current) {
        p5Ref.current.frameRate(8);
      } else if (p5Ref.current) {
        p5Ref.current.frameRate(45);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
      cancelAnimationFrame(raf);
    };
  }, [variant]);

  return <div ref={hostRef} aria-hidden="true" />;
}

BackgroundFX.propTypes = {
  variant: PropTypes.oneOf(['particles', 'waves', 'aurora'])
};
