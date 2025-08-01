import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

// Magnetic field lines around a long straight current-carrying wire
export function MagneticFieldWire() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ I: 5, k: 1, grid: 20 });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w, h); };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w, h); };
    p.draw = () => {
      const { I, k, grid } = cfgRef.current;
      p.background(20);
      p.fill(240); p.noStroke(); p.text('Wire (⊙ out of screen)', 16, 24);
      p.stroke(160); p.noFill();
      // draw vector field B ~ I/(2πr)
      for (let y = grid/2; y < p.height; y += grid) {
        for (let x = grid/2; x < p.width; x += grid) {
          const dx = x - p.width/2, dy = y - p.height/2; const r = Math.hypot(dx, dy) || 1;
          const mag = k * I / r; // drop constants
          // tangent direction: rotate radial by +90°
          const tx = -dy / r, ty = dx / r;
          p.stroke(100,220,255); p.line(x, y, x + tx*mag*8, y + ty*mag*8);
        }
      }
      // wire marker
      p.noStroke(); p.fill(255,120,120); p.circle(p.width/2, p.height/2, 10);
    };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Current I (A)" val={cfg.I} min={1} max={20} step={1} onChange={handle("I")} />
        <NumberInput label="Scale" val={cfg.k} min={0.5} max={3} step={0.1} onChange={handle("k")} />
        <NumberInput label="Grid" val={cfg.grid} min={12} max={48} step={2} onChange={handle("grid")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default MagneticFieldWire;
