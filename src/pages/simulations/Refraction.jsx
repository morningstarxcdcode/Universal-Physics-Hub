import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function Refraction() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ n1: 1.0, n2: 1.33, theta1: 30, color: "#7f7f7f", trail: false });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (name) => (e) => {
    let v;
    if (name === "trail") v = e.target.checked; else if (name === "color") v = e.target.value; else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };
  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); };
    p.draw = () => {
      const se = document.querySelector('.screen'); const bg = window.getComputedStyle(se).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { n1, n2, theta1, color, trail } = cfgRef.current; if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 
      const cx = p.width/2, cy = p.height/2; p.stroke(120); p.line(0, cy, p.width, cy);
      // incident ray
      const th1 = theta1 * Math.PI/180; const len = 160;
      p.stroke(color); p.line(cx - len*Math.cos(th1), cy - len*Math.sin(th1), cx, cy);
      // refracted if possible
      const sin2 = n1 * Math.sin(th1) / n2;
      if (Math.abs(sin2) <= 1) {
        const th2 = Math.asin(sin2);
        p.stroke(200,200,80); p.line(cx, cy, cx + len*Math.cos(th2), cy + len*Math.sin(th2));
      } else {
        // total internal reflection
        const refl = th1; // reflect angle equals incident
        p.stroke(200,80,80); p.line(cx, cy, cx - len*Math.cos(refl), cy + len*Math.sin(refl));
      }
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="n1:" val={cfg.n1} min={1.0} max={2.5} step={0.01} onChange={handle("n1")} />
        <NumberInput label="n2:" val={cfg.n2} min={1.0} max={2.5} step={0.01} onChange={handle("n2")} />
        <NumberInput label="theta1:" val={cfg.theta1} min={0} max={89} step={0.5} onChange={handle("theta1")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Ray Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default Refraction;
