import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function RCCircuit() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ R: 1000, C: 0.01, V0: 5, charge: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="charge"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
  const { R, C, V0, charge } = cfgRef.current;
      const tau = R*C;
      p.background(18,18,18);
      // plot V(t)
      const ox = 40, oy = p.height - 40, W = p.width - 80, H = p.height - 120;
      p.stroke(120); p.noFill(); p.rect(ox, oy - H, W, H);
      p.stroke(100,200,255); p.beginShape();
      for (let x = 0; x <= W; x++) {
        const tt = x / W * 5 * tau; // 5 tau span
        const y = charge ? V0*(1 - Math.exp(-tt/tau)) : V0*Math.exp(-tt/tau);
        const py = oy - (y/V0) * H; p.vertex(ox + x, py);
      }
      p.endShape();
      p.noStroke(); p.fill(220); p.text(`τ=${(tau).toFixed(2)}`, ox + 8, oy - H - 8);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="R (Ω):" val={cfg.R} min={100} max={10000} step={100} onChange={handle("R")} />
        <NumberInput label="C (F):" val={cfg.C} min={0.001} max={0.1} step={0.001} onChange={handle("C")} />
        <NumberInput label="V0 (V):" val={cfg.V0} min={1} max={12} step={0.5} onChange={handle("V0")} />
        <CheckboxInput label="Charging" name="charge" checked={cfg.charge} onChange={handle("charge")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default RCCircuit;
