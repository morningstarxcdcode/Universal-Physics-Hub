import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function OhmsLawLab() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ V: 5, R1: 100, R2: 100, parallel: false, grid: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => {
    let val;
    if (typeof e === 'boolean') val = e;
    else if (e?.target?.type === 'checkbox') val = e.target.checked;
    else val = Number(e.target.value);
    setCfg(s => ({ ...s, [n]: val }));
  };

  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w, h); };
    p.draw = () => {
      const { V, R1, R2, parallel, grid } = cfgRef.current;
      const R = parallel ? 1 / (1/R1 + 1/R2) : (R1 + R2);
      const I = V / R; // A
      p.background(20);
      // axes for I-V
      const ox = 60, oy = p.height - 50, W = p.width - 120, H = p.height - 140;
      p.stroke(140); p.noFill(); p.rect(ox, oy - H, W, H);
      if (grid) {
        p.stroke(50);
        for (let x=0; x<=W; x+=W/10) { p.line(ox+x, oy-H, ox+x, oy); }
        for (let y=0; y<=H; y+=H/10) { p.line(ox, oy-y, ox+W, oy-y); }
      }
      // line I = V/R
      p.stroke(100,220,255); p.beginShape();
      const Vmax = 12; const Imax = 12/Math.max(1,R);
      for (let x = 0; x <= W; x++) {
        const v = (x/W)*Vmax;
        const i = v/R;
        const px = ox + x;
        const py = oy - (i/Imax)*H;
        p.vertex(px, py);
      }
      p.endShape();
      // current operating point
      const px = ox + (V/12)*W;
      const py = oy - (I/(12/Math.max(1,R)))*H;
      p.noStroke(); p.fill(255,90,90); p.circle(px, py, 8);
      p.fill(230); p.text(`V=${V.toFixed(2)} V, R=${R.toFixed(1)} Ω, I=${I.toFixed(3)} A`, ox, oy - H - 10);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="V (V):" val={cfg.V} min={0} max={12} step={0.1} onChange={handle("V")} />
        <NumberInput label="R1 (Ω):" val={cfg.R1} min={1} max={1000} step={1} onChange={handle("R1")} />
        <NumberInput label="R2 (Ω):" val={cfg.R2} min={1} max={1000} step={1} onChange={handle("R2")} />
        <CheckboxInput label="Parallel (R1 || R2)" name="parallel" checked={cfg.parallel} onChange={handle("parallel")} />
        <CheckboxInput label="Grid" name="grid" checked={cfg.grid} onChange={handle("grid")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default OhmsLawLab;
