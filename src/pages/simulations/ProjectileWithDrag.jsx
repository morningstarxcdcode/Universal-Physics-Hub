import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ProjectileWithDrag() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ v0: 10, angle: 45, k: 0.005, g: 0.3, trail: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: n==="trail"? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    let pos, vel, path = [];

    function launch() {
      const { v0, angle } = cfgRef.current;
      const th = angle * Math.PI / 180;
      pos = p.createVector(40, p.height - 40);
      vel = p.createVector(v0 * Math.cos(th), -v0 * Math.sin(th));
      path = [];
    }

    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w,h); launch(); };

    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { k, g, trail } = cfgRef.current;
      if (!trail) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);} 

      // quadratic drag
      const speed = vel.mag();
      const drag = vel.copy().mult(-k * speed);
      vel.y += g; // gravity down
      vel.add(drag);
      pos.add(vel);
      path.push(pos.copy()); if (path.length > 500) path.shift();

      // ground
      if (pos.y > p.height - 20) { pos.y = p.height - 20; vel.y *= -0.3; }

      // draw
      p.noFill(); p.stroke(100,200,255); p.beginShape();
      for (const v of path) { p.vertex(v.x, v.y); }
      p.endShape();
      p.noStroke(); p.fill("#7f7f7f"); p.circle(pos.x, pos.y, 12);
    };

    p.mousePressed = launch;
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h); launch(); };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="v0:" val={cfg.v0} min={1} max={40} step={0.5} onChange={handle("v0")} />
        <NumberInput label="Angle°:" val={cfg.angle} min={0} max={90} step={1} onChange={handle("angle")} />
        <NumberInput label="Drag k:" val={cfg.k} min={0} max={0.05} step={0.001} onChange={handle("k")} />
        <NumberInput label="g:" val={cfg.g} min={0} max={1} step={0.01} onChange={handle("g")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ProjectileWithDrag;
