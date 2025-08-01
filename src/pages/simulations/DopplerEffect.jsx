import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function DopplerEffect() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ f: 2, vs: 2, vo: 0, c: 20, showWavefronts: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="showWavefronts"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let t = 0, srcX = 80, obsX;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); obsX = p.width - 80; };
    p.draw = () => {
      const { f, vs, vo, c, showWavefronts } = cfgRef.current; t += 0.016;
      p.background(18,18,18);
      // update positions
      srcX += vs;
      obsX += vo;
      if (obsX < 60) obsX = 60;
      if (obsX > p.width-60) obsX = p.width-60;
      // draw wavefronts
      if (showWavefronts) {
        p.noFill(); p.stroke(120);
        for (let n=0; n<10; n++) {
          const age = t - n/f;
          if (age < 0) { continue; }
          const r = age * c;
          p.circle(srcX - vs*age, p.height/2, 2*r);
        }
      }
      // draw source and observer
      p.noStroke(); p.fill(255,160,0); p.circle(srcX, p.height/2, 14);
      p.fill(100,200,255); p.rectMode(p.CENTER); p.rect(obsX, p.height/2, 20, 14, 3);
    };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="f:" val={cfg.f} min={0.5} max={5} step={0.1} onChange={handle("f")} />
        <NumberInput label="v_source:" val={cfg.vs} min={-5} max={5} step={0.1} onChange={handle("vs")} />
        <NumberInput label="v_observer:" val={cfg.vo} min={-5} max={5} step={0.1} onChange={handle("vo")} />
        <NumberInput label="wave speed c:" val={cfg.c} min={5} max={60} step={1} onChange={handle("c")} />
        <CheckboxInput label="Wavefronts" name="showWavefronts" checked={cfg.showWavefronts} onChange={handle("showWavefronts")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default DopplerEffect;
