import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function CircularMotion() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ r: 120, omega: 0.03, showVectors: true, color: "#7f7f7f", trail: false });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (name) => (e) => {
    let v;
    if (name === "trail" || name === "showVectors") v = e.target.checked;
    else if (name === "color") v = e.target.value;
    else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };
  const Sketch = useCallback((p) => {
    let t;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); t = 0; };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { r, omega, showVectors, color, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 
      t += omega;
      const cx = p.width/2, cy = p.height/2;
      const x = cx + r * Math.cos(t), y = cy + r * Math.sin(t);
      p.noStroke(); p.fill(color); p.circle(x, y, 16);
      p.noFill(); p.stroke(120); p.circle(cx, cy, r*2);
      if (showVectors) {
        p.stroke(0,255,0); p.line(x, y, x - r*omega*Math.sin(t)*30, y + r*omega*Math.cos(t)*30); // velocity (approx scaled)
        p.stroke(255,0,0); p.line(x, y, cx, cy); // centripetal dir
      }
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Radius r:" val={cfg.r} min={20} max={240} step={1} onChange={handle("r")} />
        <NumberInput label="Omega:" val={cfg.omega} min={0.001} max={0.2} step={0.001} onChange={handle("omega")} />
        <CheckboxInput label="Show vectors" name="showVectors" checked={cfg.showVectors} onChange={handle("showVectors")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Object Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default CircularMotion;
