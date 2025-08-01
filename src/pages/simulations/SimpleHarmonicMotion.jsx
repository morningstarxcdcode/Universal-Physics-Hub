import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function SimpleHarmonicMotion() {
  const location = useLocation();
  const [cfg, setCfg] = useState({
    m: 1,
    k: 0.05,
    c: 0.01,
    x0: 120,
    color: "#7f7f7f",
    trail: true,
  });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (name) => (e) => {
    let v;
    if (name === "trail") v = e.target.checked;
    else if (name === "color") v = e.target.value;
    else v = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: v }));
  };

  const Sketch = useCallback((p) => {
    let x, v, a, anchorY, r;
    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.createCanvas(w, h);
      x = cfgRef.current.x0; v = 0; a = 0; r = 18; anchorY = p.height/2;
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { m, k, c, color, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);}    
      // spring force: -k x, damping: -c v
      a = (-k * x - c * v) / m;
      v += a;
      x += v;

      // draw spring line and mass
      const cx = p.width/2 + x;
      p.stroke(180); p.noFill();
      p.line(p.width/2 - 200, anchorY, cx, anchorY);
      p.noStroke(); p.fill(color);
      p.circle(cx, anchorY, r*2);
    };
    p.windowResized = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h);
    };
    p.mousePressed = () => { x = p.mouseX - p.width/2; v = 0; };
  }, []);

  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Mass m:" val={cfg.m} min={0.1} max={10} step={0.1} onChange={handle("m")} />
        <NumberInput label="Spring k:" val={cfg.k} min={0.001} max={0.2} step={0.001} onChange={handle("k")} />
        <NumberInput label="Damping c:" val={cfg.c} min={0} max={0.1} step={0.001} onChange={handle("c")} />
        <NumberInput label="Initial x:" val={cfg.x0} min={-200} max={200} step={1} onChange={handle("x0")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Mass Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default SimpleHarmonicMotion;
