import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function StandingWaves() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ n: 1, speed: 1, nodes: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="nodes"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let t = 0;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
      const { n, speed, nodes } = cfgRef.current; t += 0.03*speed;
      p.background(18,18,18);
      const L = p.width - 80; const ox = 40; const oy = p.height/2; const A = 40;
      p.stroke(220); p.noFill(); p.beginShape();
      for (let x=0; x<=L; x++) {
        const k = Math.PI*n/L; const y = A*Math.sin(k*x)*Math.cos(t);
        p.vertex(ox + x, oy - y);
      }
      p.endShape();
      if (nodes) {
        p.fill(255,160,0); p.noStroke();
        for (let i=0; i<=n; i++) { p.circle(ox + (L*i/n), oy, 6); }
      }
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Mode n:" val={cfg.n} min={1} max={8} step={1} onChange={handle("n")} />
        <NumberInput label="Speed:" val={cfg.speed} min={0.1} max={5} step={0.1} onChange={handle("speed")} />
        <CheckboxInput label="Show nodes" name="nodes" checked={cfg.nodes} onChange={handle("nodes")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default StandingWaves;
