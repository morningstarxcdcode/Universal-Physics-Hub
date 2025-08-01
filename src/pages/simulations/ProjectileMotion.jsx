import { useState, useRef, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function ProjectileMotion() {
  const location = useLocation();
  const [cfg, setCfg] = useState({
    speed: 8,
    angle: 45,
    gravity: 0.35,
    restitution: 0.75,
    drag: 0.001,
    trail: true,
    color: "#7f7f7f",
  });

  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const handle = (name) => (e) => {
    let value;
    if (name === "trail") value = e.target.checked;
    else if (name === "color") value = e.target.value;
    else value = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: value }));
  };

  const Sketch = useCallback(p => {
    let pos, vel, r;

    const resetShot = () => {
      const { speed, angle } = cfgRef.current;
      const rad = (angle * Math.PI) / 180;
      pos = p.createVector(50, p.height - r - 2);
      vel = p.createVector(Math.cos(rad) * speed, -Math.sin(rad) * speed);
    };

    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.createCanvas(w, h);
      r = 10;
      resetShot();
    };

    p.draw = () => {
      const screenEl = document.querySelector('.screen');
      const bgColor = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
      const { gravity, restitution, drag, trail, color } = cfgRef.current;

      if (!trail) p.background(...bgColor);
      else {
        p.noStroke();
        p.fill(bgColor[0], bgColor[1], bgColor[2], 50);
        p.rect(0, 0, p.width, p.height);
      }

      // physics
      vel.y += gravity;                // gravity
      vel.x *= (1 - drag);             // simple drag
      vel.y *= (1 - drag);
      pos.add(vel);

      // bounds
      if (pos.x + r > p.width) { pos.x = p.width - r; vel.x *= -restitution; }
      if (pos.x - r < 0) { pos.x = r; vel.x *= -restitution; }
      if (pos.y + r > p.height) { pos.y = p.height - r; vel.y *= -restitution; }
      if (pos.y - r < 0) { pos.y = r; vel.y *= -restitution; }

      // draw ground guide
      p.stroke(40);
      p.line(0, p.height - 1, p.width, p.height - 1);

      // projectile
      p.noStroke();
      p.fill(color);
      p.circle(pos.x, pos.y, r * 2);
    };

    p.mousePressed = () => { resetShot(); };
    p.keyPressed = () => { if (p.key === ' ') resetShot(); };

    p.windowResized = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.resizeCanvas(w, h);
    };
  }, []);

  return (
    <>
      <TopSim/>
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Launch speed:" val={cfg.speed} min={0.1} max={40} step={0.1} onChange={handle("speed")} />
        <NumberInput label="Angle (deg):" val={cfg.angle} min={0} max={90} step={0.5} onChange={handle("angle")} />
        <NumberInput label="Gravity:" val={cfg.gravity} min={0} max={2} step={0.01} onChange={handle("gravity")} />
        <NumberInput label="Restitution:" val={cfg.restitution} min={0} max={1} step={0.01} onChange={handle("restitution")} />
        <NumberInput label="Drag:" val={cfg.drag} min={0} max={0.02} step={0.0005} onChange={handle("drag")} />
        <CheckboxInput label="Trail" name="trail" checked={cfg.trail} onChange={handle("trail")} />
        <ColorInput label="Ball Color:" value={cfg.color} onChange={handle("color")} />
      </div>

  <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default ProjectileMotion;
