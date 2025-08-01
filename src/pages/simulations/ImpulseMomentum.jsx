import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ImpulseMomentum() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ m: 1, J: 2 });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let x = 80, v = 0, r = 16;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      p.background(...bg);
      x += v; if (x<r || x>p.width-r) { x = Math.max(r, Math.min(p.width-r,x)); v *= -1; }
      p.noStroke(); p.fill("#7f7f7f"); p.circle(x, p.height/2, r*2);
      p.fill(230); p.textAlign(p.CENTER, p.CENTER); p.text(`v=${v.toFixed(2)}`, x, p.height/2 - 24);
    };
    p.mousePressed = () => { const { m, J } = cfgRef.current; v += J / m; };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Mass m:" val={cfg.m} min={0.5} max={10} step={0.5} onChange={handle("m")} />
        <NumberInput label="Impulse J (click to apply):" val={cfg.J} min={-5} max={5} step={0.1} onChange={handle("J")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ImpulseMomentum;
