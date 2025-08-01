import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function WorkEnergy() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ mass: 1, force: 0.1, friction: 0.0, trail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n === "trail" ? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let x = 60, v = 0, a = 0;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      if (!cfgRef.current.trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 
      const { mass, force, friction } = cfgRef.current;
      const F = force - friction * Math.sign(v);
      a = F / mass; v += a; x += v; x = Math.max(20, Math.min(p.width-20, x));
      // draw track and block
      p.stroke(200); p.line(20, p.height/2, p.width-20, p.height/2);
      p.noStroke(); p.fill(100,180,255); p.rectMode(p.CENTER); p.rect(x, p.height/2 - 10, 40, 20, 4);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Mass:" val={cfg.mass} min={0.5} max={10} step={0.5} onChange={handle("mass")} />
        <NumberInput label="Force:" val={cfg.force} min={-0.5} max={0.5} step={0.01} onChange={handle("force")} />
        <NumberInput label="Friction:" val={cfg.friction} min={0} max={0.2} step={0.005} onChange={handle("friction")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default WorkEnergy;
