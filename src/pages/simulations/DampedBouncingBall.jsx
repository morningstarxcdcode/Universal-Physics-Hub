import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function DampedBouncingBall() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ vx: 3, vy: -2, e: 0.85, drag: 0.0, r: 24, color: "#7f7f7f", trail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="trail"? e.target.checked : (n==="color"? e.target.value : Number(e.target.value)) }));

  const Sketch = useCallback((p) => {
    let x, y;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); x = p.width*0.2; y = p.height*0.3; };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { vx, vy, e, drag, r, color, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 

      // update
      let nvx = vx * (1 - drag);
      let nvy = (vy + 0.2) * (1 - drag); // add small gravity as in original demos
      x += nvx; y += nvy;

      // collisions
      if (x < r || x > p.width - r) { setCfg(s => ({ ...s, vx: -nvx })); }
      if (y > p.height - r) { setCfg(s => ({ ...s, vy: -nvy * e })); y = p.height - r; }
      if (y < r) { setCfg(s => ({ ...s, vy: -nvy })); y = r; }

      // draw
      p.noStroke(); p.fill(color); p.circle(x, y, r*2);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="vx:" val={cfg.vx} min={-10} max={10} step={0.1} onChange={handle("vx")} />
        <NumberInput label="vy:" val={cfg.vy} min={-10} max={10} step={0.1} onChange={handle("vy")} />
        <NumberInput label="Restitution e:" val={cfg.e} min={0} max={1} step={0.01} onChange={handle("e")} />
        <NumberInput label="Drag:" val={cfg.drag} min={0} max={0.2} step={0.005} onChange={handle("drag")} />
        <NumberInput label="Radius:" val={cfg.r} min={8} max={60} step={1} onChange={handle("r")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Ball Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default DampedBouncingBall;
