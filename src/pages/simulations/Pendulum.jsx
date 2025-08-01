import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function Pendulum() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ L: 180, g: 0.35, d: 0.002, theta0: 0.8, color: "#7f7f7f", trail: true });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (name) => (e) => {
    let v;
    if (name === "trail") v = e.target.checked; else if (name === "color") v = e.target.value; else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };

  const Sketch = useCallback((p) => {
    let theta, omega, alpha, origin, bobR;
    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h);
      theta = cfgRef.current.theta0; omega = 0; alpha = 0; origin = p.createVector(p.width/2, 50); bobR = 14;
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { L, g, d, color, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 
      // equation: theta'' = -(g/L) sin(theta) - d*theta'
      alpha = -(g/L) * Math.sin(theta) - d * omega;
      omega += alpha;
      theta += omega;
      const bob = p.createVector(origin.x + L * Math.sin(theta), origin.y + L * Math.cos(theta));
      p.stroke(180); p.line(origin.x, origin.y, bob.x, bob.y);
      p.noStroke(); p.fill(color); p.circle(bob.x, bob.y, bobR*2);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  p.mousePressed = () => { theta = Math.atan2(p.mouseX - p.width/2, p.mouseY - 50); omega = 0; };
  }, []);

  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Length L:" val={cfg.L} min={40} max={260} step={1} onChange={handle("L")} />
        <NumberInput label="Gravity g:" val={cfg.g} min={0} max={1.5} step={0.01} onChange={handle("g")} />
        <NumberInput label="Damping d:" val={cfg.d} min={0} max={0.02} step={0.0005} onChange={handle("d")} />
        <NumberInput label="Theta0:" val={cfg.theta0} min={-3.14} max={3.14} step={0.01} onChange={handle("theta0")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Bob Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default Pendulum;
