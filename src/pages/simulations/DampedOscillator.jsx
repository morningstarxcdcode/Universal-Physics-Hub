import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function DampedOscillator() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ m: 1, k: 0.05, c: 0.01, F0: 0.2, omega: 0.05, x0: 60, color: "#7f7f7f", trail: true });
  const cfgRef = useRef(cfg); useEffect(()=>{cfgRef.current=cfg;},[cfg]);
  const handle = (name) => (e) => {
    let v;
    if (name === "trail") {
      v = e.target.checked;
    } else if (name === "color") {
      v = e.target.value;
    } else {
      v = Number(e.target.value);
    }
    setCfg(s => ({ ...s, [name]: v }));
  };
  const Sketch = useCallback((p)=>{
    let x, v, a, t, cy;
    p.setup=()=>{const {clientWidth:w,clientHeight:h}=p._userNode;p.createCanvas(w,h); x=cfgRef.current.x0; v=0; a=0; t=0; cy=p.height/2; };
    p.draw=()=>{
      const se=document.querySelector('.screen');
      const bg=window.getComputedStyle(se).backgroundColor.match(/\d+/g)?.map(Number)||[0,0,0];
      const { m,k,c,F0,omega,color,trail } = cfgRef.current;
      if (!trail) {
        p.background(...bg);
      } else {
        p.noStroke();
        p.fill(bg[0],bg[1],bg[2],50);
        p.rect(0,0,p.width,p.height);
      }
      // equation: m x'' + c x' + k x = F0 cos(omega t)
      const drive = F0 * Math.cos(t);
      a = (drive - c*v - k*x)/m; v += a; x += v; t += omega;
      const px = p.width/2 + x; p.noStroke(); p.fill(color); p.circle(px, cy, 16);
      p.stroke(160); p.line(p.width/2 - 220, cy, p.width/2 + 220, cy);
    };
    p.windowResized=()=>{const {clientWidth:w,clientHeight:h}=p._userNode;p.resizeCanvas(w,h); cy=p.height/2; };
    p.mousePressed=()=>{ x = p.mouseX - p.width/2; v=0; };
  },[]);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Mass m:" val={cfg.m} min={0.1} max={10} step={0.1} onChange={handle("m")} />
        <NumberInput label="Spring k:" val={cfg.k} min={0.001} max={0.2} step={0.001} onChange={handle("k")} />
        <NumberInput label="Damping c:" val={cfg.c} min={0} max={0.1} step={0.001} onChange={handle("c")} />
        <NumberInput label="F0:" val={cfg.F0} min={0} max={1} step={0.01} onChange={handle("F0")} />
        <NumberInput label="omega:" val={cfg.omega} min={0.001} max={0.2} step={0.001} onChange={handle("omega")} />
        <NumberInput label="Initial x:" val={cfg.x0} min={-200} max={200} step={1} onChange={handle("x0")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Mass Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default DampedOscillator;
