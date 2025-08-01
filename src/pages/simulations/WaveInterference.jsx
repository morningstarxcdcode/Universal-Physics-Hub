import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function WaveInterference() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ A1: 60, A2: 60, k: 0.03, omega: 0.05, phi: 0, color: "#7f7f7f", trail: false });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (name) => (e) => {
    let v;
    if (name === "trail") v = e.target.checked; else if (name === "color") v = e.target.value; else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };
  const Sketch = useCallback((p) => {
    let t;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); t = 0; };
    p.draw = () => {
      const se = document.querySelector('.screen'); const bg = window.getComputedStyle(se).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { A1, A2, k, omega, phi, color, trail } = cfgRef.current; t += omega;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],50); p.rect(0,0,p.width,p.height);} 
      p.noFill(); p.stroke(color); p.beginShape();
      for (let x = 0; x <= p.width; x+=2) {
        const y = p.height/2 + A1*Math.sin(k*x - t) + A2*Math.sin(k*x - t + phi);
        p.vertex(x, y);
      }
      p.endShape();
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="A1:" val={cfg.A1} min={0} max={150} step={1} onChange={handle("A1")} />
        <NumberInput label="A2:" val={cfg.A2} min={0} max={150} step={1} onChange={handle("A2")} />
        <NumberInput label="k:" val={cfg.k} min={0.005} max={0.2} step={0.001} onChange={handle("k")} />
        <NumberInput label="omega:" val={cfg.omega} min={0.001} max={0.2} step={0.001} onChange={handle("omega")} />
        <NumberInput label="phi:" val={cfg.phi} min={-Math.PI} max={Math.PI} step={0.01} onChange={handle("phi")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Wave Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default WaveInterference;
