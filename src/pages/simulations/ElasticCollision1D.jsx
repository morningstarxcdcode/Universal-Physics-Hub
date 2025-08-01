import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ElasticCollision1D() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ m1: 1, m2: 1, u1: 3, u2: -1, size1: 24, size2: 24, color1: "#7f7f7f", color2: "#9999ff", trail: false });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (name) => (e) => {
    let v;
    if (name === "trail") v = e.target.checked;
    else if (name === "color1" || name === "color2") v = e.target.value;
    else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };
  const Sketch = useCallback((p) => {
    let x1, x2, v1, v2, y;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w, h); y = h/2; reset(); };
    const reset = () => { const { u1, u2 } = cfgRef.current; x1 = 80; x2 = p.width-80; v1 = u1; v2 = u2; };
    const collide = () => {
      const { m1, m2 } = cfgRef.current;
      const nv1 = ((m1 - m2) / (m1 + m2)) * v1 + (2 * m2 / (m1 + m2)) * v2;
      const nv2 = (2 * m1 / (m1 + m2)) * v1 + ((m2 - m1) / (m1 + m2)) * v2;
      v1 = nv1; v2 = nv2;
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { size1, size2, color1, color2, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 
      // walls
      if (x1 - size1 < 0) { x1 = size1; v1 *= -1; }
      if (x2 + size2 > p.width) { x2 = p.width - size2; v2 *= -1; }
      // move
      x1 += v1; x2 += v2;
      // collision check
      if (x2 - x1 <= size1 + size2) { x2 = x1 + size1 + size2; collide(); }
      // draw
      p.noStroke(); p.fill(color1); p.circle(x1, y, size1*2);
      p.fill(color2); p.circle(x2, y, size2*2);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
    p.mousePressed = reset;
  }, []);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="m1:" val={cfg.m1} min={0.1} max={10} step={0.1} onChange={handle("m1")} />
        <NumberInput label="m2:" val={cfg.m2} min={0.1} max={10} step={0.1} onChange={handle("m2")} />
        <NumberInput label="u1:" val={cfg.u1} min={-10} max={10} step={0.1} onChange={handle("u1")} />
        <NumberInput label="u2:" val={cfg.u2} min={-10} max={10} step={0.1} onChange={handle("u2")} />
        <NumberInput label="size1:" val={cfg.size1} min={8} max={60} step={1} onChange={handle("size1")} />
        <NumberInput label="size2:" val={cfg.size2} min={8} max={60} step={1} onChange={handle("size2")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Color 1:" value={cfg.color1} onChange={handle("color1")} />
        <ColorInput label="Color 2:" value={cfg.color2} onChange={handle("color2")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ElasticCollision1D;
