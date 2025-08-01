import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function LensMaker() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ f: 120, do_: 200 });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
      const { f, do_ } = cfgRef.current; const di = 1/((1/f) - (1/do_));
      p.background(18,18,18); const cx = p.width/2; const cy = p.height/2;
      // optical axis
      p.stroke(120); p.line(0, cy, p.width, cy);
      // lens
      p.stroke(200); p.line(cx, cy-80, cx, cy+80);
      // object arrow
      p.stroke(100,200,255); p.line(cx - do_, cy, cx - do_, cy - 40); p.line(cx - do_, cy - 40, cx - do_ - 6, cy - 28);
      // image arrow
      p.stroke(255,160,0); const imgH = -40 * di / do_; p.line(cx + di, cy, cx + di, cy - imgH); p.line(cx + di, cy - imgH, cx + di + Math.sign(imgH)*6, cy - imgH + 12*Math.sign(imgH));
      // foci
      p.noStroke(); p.fill(220); p.text(`f=${f}`, cx + f + 8, cy - 8);
      p.circle(cx + f, cy, 4); p.circle(cx - f, cy, 4);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Focal length f:" val={cfg.f} min={40} max={240} step={5} onChange={handle("f")} />
        <NumberInput label="Object distance d_o:" val={cfg.do_} min={60} max={400} step={5} onChange={handle("do_")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default LensMaker;
