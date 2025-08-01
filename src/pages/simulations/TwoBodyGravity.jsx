import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function TwoBodyGravity() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ G: 0.6, m1: 8, m2: 4, trail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="trail"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let r1, r2, v1, v2, path1 = [], path2 = [];
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h);
      r1 = p.createVector(p.width*0.4, p.height/2); r2 = p.createVector(p.width*0.6, p.height/2);
      v1 = p.createVector(0, -1.2); v2 = p.createVector(0, 1.2);
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      if (!cfgRef.current.trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],50); p.rect(0,0,p.width,p.height);} 
      const { G, m1, m2 } = cfgRef.current;
      const r12 = p.createVector(r2.x - r1.x, r2.y - r1.y); const d = Math.max(r12.mag(), 1);
      const dir12 = r12.copy().div(d);
      const a1 = dir12.copy().mult(G*m2/(d*d));
      const a2 = dir12.copy().mult(-G*m1/(d*d));
      v1.add(a1); v2.add(a2); r1.add(v1); r2.add(v2);
      path1.push(r1.copy()); if (path1.length>400) path1.shift();
      path2.push(r2.copy()); if (path2.length>400) path2.shift();
      // draw
      p.noFill(); p.stroke(255,200,100); p.beginShape();
      for (const q of path1) { p.vertex(q.x,q.y); }
      p.endShape();
      p.stroke(100,200,255); p.beginShape();
      for (const q of path2) { p.vertex(q.x,q.y); }
      p.endShape();
      p.noStroke(); p.fill(255,200,100); p.circle(r1.x, r1.y, 12+ m1);
      p.fill(100,200,255); p.circle(r2.x, r2.y, 12+ m2);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="G:" val={cfg.G} min={0.1} max={2} step={0.05} onChange={handle("G")} />
        <NumberInput label="m1:" val={cfg.m1} min={1} max={20} step={1} onChange={handle("m1")} />
        <NumberInput label="m2:" val={cfg.m2} min={1} max={20} step={1} onChange={handle("m2")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default TwoBodyGravity;
