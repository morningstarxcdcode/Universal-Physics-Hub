import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ThreeBodyRestricted() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ mu: 0.1, speed: 1, trail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="trail"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let r, v, t = 0;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h);
      r = p.createVector(p.width*0.7, p.height*0.5); v = p.createVector(0, -2);
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      if (!cfgRef.current.trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],50); p.rect(0,0,p.width,p.height);} 
      const { mu, speed } = cfgRef.current; t += 0.01*speed;
      // primary bodies on circular orbits
      const R = Math.min(p.width,p.height)*0.2;
      const P1 = p.createVector(p.width/2 + R*Math.cos(t), p.height/2 + R*Math.sin(t));
      const P2 = p.createVector(p.width/2 - R*Math.cos(t), p.height/2 - R*Math.sin(t));
      // massless particle acceleration
      const a1 = p.createVector(P1.x - r.x, P1.y - r.y); const d1 = Math.max(a1.mag(), 1); a1.setMag(mu/(d1*d1));
      const a2 = p.createVector(P2.x - r.x, P2.y - r.y); const d2 = Math.max(a2.mag(), 1); a2.setMag((1-mu)/(d2*d2));
      v.add(a1).add(a2); r.add(v);
      // draw
      p.noStroke(); p.fill(255,200,100); p.circle(P1.x,P1.y,12);
      p.fill(100,200,255); p.circle(P2.x,P2.y,12);
      p.fill("#7f7f7f"); p.circle(r.x, r.y, 8);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="μ:" val={cfg.mu} min={0.01} max={0.5} step={0.01} onChange={handle("mu")} />
        <NumberInput label="Speed:" val={cfg.speed} min={0.1} max={3} step={0.1} onChange={handle("speed")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ThreeBodyRestricted;
