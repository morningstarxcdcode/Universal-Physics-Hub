import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function InclinedPlane() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ angle: 25, muS: 0.3, muK: 0.2, g: 0.5, color: "#7f7f7f", trail: false });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (name) => (e) => {
    let v;
    if (name === "trail") v = e.target.checked; else if (name === "color") v = e.target.value; else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };
  const Sketch = useCallback((p) => {
    let pos, vel, r;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w, h); r = 16; pos = p.createVector(100, h-150); vel = p.createVector(0,0); };
    p.draw = () => {
      const se = document.querySelector('.screen'); const bg = window.getComputedStyle(se).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { angle, muS, muK, g, color, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 
      const a = angle*Math.PI/180;
      // slope line
      const x0 = 60, y0 = p.height-60, len = p.width-120; const x1 = x0 + len*Math.cos(a), y1 = y0 - len*Math.sin(a);
      p.stroke(160); p.line(x0,y0,x1,y1);
      // local axes
      const s = Math.sin(a), c = Math.cos(a);
      // forces along slope
      const mg_s = g * s; const N = g * c;
      // decide static/kinetic
      let acc_s = 0; // along slope
      const frictionMax = muS * N;
      if (Math.abs(mg_s) <= frictionMax && Math.abs(vel.x) < 0.01) {
        vel.x = 0; // stick
      } else {
        const sign = mg_s>0? 1 : -1;
        acc_s = mg_s - muK * N * sign; // kinetic friction opposes motion
      }
      // integrate along slope direction mapped to world
      vel.x += acc_s; // treat vel.x as along-slope speed
      pos.x += vel.x * c; pos.y -= vel.x * s;
      // keep on slope bounds
      pos.x = p.constrain(pos.x, x0, x1); pos.y = y0 - (pos.x-x0)*Math.tan(a);
      // draw block
      p.noStroke(); p.fill(color); p.circle(pos.x, pos.y, r*2);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
    p.mousePressed = () => { vel.x = 0; };
  }, []);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Angle (deg):" val={cfg.angle} min={0} max={60} step={1} onChange={handle("angle")} />
        <NumberInput label="μs:" val={cfg.muS} min={0} max={1} step={0.01} onChange={handle("muS")} />
        <NumberInput label="μk:" val={cfg.muK} min={0} max={1} step={0.01} onChange={handle("muK")} />
        <NumberInput label="g:" val={cfg.g} min={0} max={1} step={0.01} onChange={handle("g")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Block Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default InclinedPlane;
