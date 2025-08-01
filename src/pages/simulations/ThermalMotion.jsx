import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ThermalMotion() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ n: 50, step: 2, trail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="trail"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let pts = [];
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h);
      const { n } = cfgRef.current; pts = Array.from({ length: n }, () => ({ x: p.random(20, p.width-20), y: p.random(20, p.height-20) }));
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { step, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],55); p.rect(0,0,p.width,p.height);} 
      p.noStroke(); p.fill("#7f7f7f");
      for (const pt of pts) {
        pt.x += p.random(-step, step); pt.y += p.random(-step, step);
        pt.x = Math.max(10, Math.min(p.width-10, pt.x));
        pt.y = Math.max(10, Math.min(p.height-10, pt.y));
        p.circle(pt.x, pt.y, 4);
      }
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Particles:" val={cfg.n} min={10} max={200} step={5} onChange={handle("n")} />
        <NumberInput label="Step size:" val={cfg.step} min={0.5} max={10} step={0.5} onChange={handle("step")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ThermalMotion;
