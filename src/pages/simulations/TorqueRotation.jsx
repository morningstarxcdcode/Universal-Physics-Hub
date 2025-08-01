import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function TorqueRotation() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ I: 2, tau: 0.02, damping: 0.01, showTrail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (n) => (e) => {
    const v = n === "showTrail" ? e.target.checked : Number(e.target.value);
    setCfg(s => ({ ...s, [n]: v }));
  };

  const Sketch = useCallback((p) => {
    let theta = 0, omega = 0, alpha = 0, r = 60;
    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h);
    };
    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      if (!cfgRef.current.showTrail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 

      const { I, tau, damping } = cfgRef.current;
      alpha = (tau - damping * omega) / I;
      omega += alpha;
      theta += omega;

      // draw rod rotating around center
      p.translate(p.width/2, p.height/2);
      p.rotate(theta);
      p.stroke(220); p.strokeWeight(3); p.line(-r, 0, r, 0);
      p.noStroke(); p.fill(255, 160, 0); p.circle(r, 0, 16);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Moment of inertia I:" val={cfg.I} min={0.5} max={20} step={0.5} onChange={handle("I")} />
        <NumberInput label="Torque τ:" val={cfg.tau} min={-0.2} max={0.2} step={0.005} onChange={handle("tau")} />
        <NumberInput label="Damping:" val={cfg.damping} min={0} max={0.1} step={0.001} onChange={handle("damping")} />
        <CheckboxInput label="Trail" name="showTrail" checked={cfg.showTrail} onChange={handle("showTrail")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default TorqueRotation;
