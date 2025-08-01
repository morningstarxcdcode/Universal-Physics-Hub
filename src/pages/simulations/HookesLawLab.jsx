import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function HookesLawLab() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ k: 0.05, m: 1 });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let x = 120, v = 0, a = 0, anchorY;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); anchorY = p.height/2; };
    p.draw = () => {
      const { k, m } = cfgRef.current;
      a = (-k * x) / m; v += a; x += v;
      p.background(18,18,18);
      // draw axes
      p.stroke(120); p.line(40, anchorY + 80, p.width-40, anchorY + 80); p.line(60, anchorY+120, 60, anchorY - 120);
      // current point F vs x
      const F = -k * x;
      const px = 60 + x; const py = anchorY + 120 - F*50; // scale for visibility
      p.noStroke(); p.fill(255,160,0); p.circle(px, py, 6);
      p.fill(220); p.text(`x=${x.toFixed(1)} F=${F.toFixed(2)}`, px+10, py-10);
      // spring and mass
      const cx = p.width/2 + x;
      p.stroke(180); p.noFill(); p.line(p.width/2 - 200, anchorY, cx, anchorY);
      p.noStroke(); p.fill("#7f7f7f"); p.circle(cx, anchorY, 24);
    };
    p.mousePressed = () => { x = p.mouseX - p.width/2; v = 0; };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="k:" val={cfg.k} min={0.001} max={0.2} step={0.001} onChange={handle("k")} />
        <NumberInput label="m:" val={cfg.m} min={0.5} max={5} step={0.1} onChange={handle("m")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default HookesLawLab;
