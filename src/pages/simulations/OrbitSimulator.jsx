import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function OrbitSimulator() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ mu: 0.5, r0: 160, v0: 2.2, color: "#7f7f7f", trail: true });
  const cfgRef = useRef(cfg); useEffect(()=>{cfgRef.current=cfg;},[cfg]);
  const handle = (n)=>(e)=>{const v=n==="trail"? e.target.checked : (n==="color"? e.target.value : Number(e.target.value)); setCfg(s=>({...s,[n]:v}));};
  const Sketch = useCallback((p)=>{
  let pos, vel;
    p.setup=()=>{const {clientWidth:w,clientHeight:h}=p._userNode;p.createCanvas(w,h); reset();};
    const reset=()=>{const {r0,v0}=cfgRef.current; pos=p.createVector(r0,0); vel=p.createVector(0,v0);};
    p.draw=()=>{
      const se=document.querySelector('.screen');const bg=window.getComputedStyle(se).backgroundColor.match(/\d+/g)?.map(Number)||[0,0,0];
      const {mu,color,trail}=cfgRef.current; if(!trail)p.background(...bg); else {p.noStroke();p.fill(bg[0],bg[1],bg[2],40);p.rect(0,0,p.width,p.height);} 
      // center origin in middle
      p.push(); p.translate(p.width/2, p.height/2);
      const rr = Math.hypot(pos.x,pos.y); const ax = -mu*pos.x/(rr*rr*rr+1e-6); const ay = -mu*pos.y/(rr*rr*rr+1e-6);
      vel.x += ax; vel.y += ay; pos.x += vel.x; pos.y += vel.y;
      p.noStroke(); p.fill('#ffaa00'); p.circle(0,0,10); // primary
      p.fill(color); p.circle(pos.x,pos.y,6);
      p.pop();
    };
    p.windowResized=()=>{const {clientWidth:w,clientHeight:h}=p._userNode;p.resizeCanvas(w,h);};
    p.mousePressed=()=>{reset();};
  },[]);
  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch}/>
      <div className="inputs-container">
        <NumberInput label="mu=GM:" val={cfg.mu} min={0.05} max={5} step={0.05} onChange={handle("mu")} />
        <NumberInput label="r0:" val={cfg.r0} min={60} max={240} step={2} onChange={handle("r0")} />
        <NumberInput label="v0:" val={cfg.v0} min={0.1} max={4} step={0.05} onChange={handle("v0")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Body Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default OrbitSimulator;
