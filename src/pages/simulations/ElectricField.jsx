import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ElectricField() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ q1: 1, q2: -1, sep: 160, color: "#7f7f7f", density: 24 });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (name) => (e) => { const v = name==="color"? e.target.value : Number(e.target.value); setCfg(s=>({...s,[name]:v})); };
  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    const E = (x,y) => {
      const { q1, q2, sep } = cfgRef.current; const k = 2000; // scaled Coulomb
      const c1 = {x: p.width/2 - sep/2, y: p.height/2};
      const c2 = {x: p.width/2 + sep/2, y: p.height/2};
      const v1x = x - c1.x, v1y = y - c1.y; const r1 = Math.hypot(v1x,v1y)+1e-3; 
      const v2x = x - c2.x, v2y = y - c2.y; const r2 = Math.hypot(v2x,v2y)+1e-3;
      const e1x = k*q1*v1x/(r1*r1*r1), e1y = k*q1*v1y/(r1*r1*r1);
      const e2x = k*q2*v2x/(r2*r2*r2), e2y = k*q2*v2y/(r2*r2*r2);
      return {x: e1x+e2x, y: e1y+e2y};
    };
    p.draw = () => {
      const se = document.querySelector('.screen'); const bg = window.getComputedStyle(se).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { sep, color, density, q1, q2 } = cfgRef.current; p.background(...bg);
      // charges
      p.noStroke(); p.fill(q1>0? '#ff7777' : '#7777ff'); p.circle(p.width/2 - sep/2, p.height/2, 16);
      p.fill(q2>0? '#ff7777' : '#7777ff'); p.circle(p.width/2 + sep/2, p.height/2, 16);
      // field vectors grid
      p.stroke(color); p.strokeWeight(1);
      for (let x=0; x<p.width; x+=density) {
        for (let y=0; y<p.height; y+=density) {
          const v = E(x,y); const m = Math.hypot(v.x,v.y) || 1; const s = 12; // scale
          p.line(x, y, x + s*v.x/m, y + s*v.y/m);
        }
      }
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="q1:" val={cfg.q1} min={-5} max={5} step={0.1} onChange={handle("q1")} />
        <NumberInput label="q2:" val={cfg.q2} min={-5} max={5} step={0.1} onChange={handle("q2")} />
        <NumberInput label="Separation:" val={cfg.sep} min={60} max={320} step={5} onChange={handle("sep")} />
        <NumberInput label="Grid step:" val={cfg.density} min={12} max={48} step={1} onChange={handle("density")} />
        <ColorInput label="Field Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ElectricField;
