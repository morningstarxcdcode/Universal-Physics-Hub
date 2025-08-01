import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function MagneticLoop() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ I: 5, R: 80, density: 12 });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
      const { I, R, density } = cfgRef.current;
      p.background(18,18,18);
      const cx = p.width/2, cy = p.height/2;
      // draw loop
      p.noFill(); p.stroke(200); p.circle(cx, cy, 2*R);
      // sample B direction using circular approximation
      p.stroke(100,200,255);
      for (let i=0; i<density; i++) {
        for (let j=0; j<density; j++) {
          const x = (i+0.5)/density * p.width; const y = (j+0.5)/density * p.height;
          const dx = x - cx, dy = y - cy; const d = Math.max(Math.hypot(dx,dy), 1);
          // direction around the loop
          const tx = -dy/d, ty = dx/d; const m = I / d; // crude falloff
          p.line(x, y, x + tx*12*m, y + ty*12*m);
        }
      }
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Current I:" val={cfg.I} min={1} max={20} step={1} onChange={handle("I")} />
        <NumberInput label="Radius R:" val={cfg.R} min={40} max={200} step={5} onChange={handle("R")} />
        <NumberInput label="Grid density:" val={cfg.density} min={6} max={24} step={1} onChange={handle("density")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default MagneticLoop;
