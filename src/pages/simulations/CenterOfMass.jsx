import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function CenterOfMass() {
  const location = useLocation();
  const [cfg, setCfg] = useState({
    massCount: 4,
    showTrails: true,
    color: "#7f7f7f",
  });
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  const [masses, setMasses] = useState([]);
  const massesRef = useRef(masses);
  useEffect(() => { massesRef.current = masses; }, [masses]);

  const handle = (name) => (e) => {
    let val;
    if (name === "showTrails") val = e.target.checked;
    else if (name === "color") val = e.target.value;
    else val = Number(e.target.value);
    setCfg(s => ({ ...s, [name]: val }));
  };

  const drawBackground = (p) => {
    const screenEl = document.querySelector('.screen');
    const bg = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g)?.map(Number) || [0,0,0];
    const { showTrails } = cfgRef.current;
    if (!showTrails) p.background(...bg); else { p.noStroke(); p.fill(bg[0],bg[1],bg[2],60); p.rect(0,0,p.width,p.height);}  
  };

  const computeCOM = (p, arr) => {
    let M = 0, cx = 0, cy = 0;
    for (const b of arr) { M += b.m; cx += b.m*b.x; cy += b.m*b.y; }
    if (M === 0) return { x: p.width/2, y: p.height/2 };
    return { x: cx/M, y: cy/M };
  };

  const Sketch = useCallback((p) => {
    let dragging = -1, r = 12;

    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.createCanvas(w, h);
      const arr = [];
      const n = cfgRef.current.massCount;
      for (let i = 0; i < n; i++) {
        arr.push({ x: p.width*(0.2 + 0.6*Math.random()), y: p.height*(0.2 + 0.6*Math.random()), m: 1 + Math.floor(Math.random()*4) });
      }
      setMasses(arr);
    };

    p.draw = () => {
      drawBackground(p);
      const { color } = cfgRef.current;
      const arr = massesRef.current;

      p.noStroke();
      for (const b of arr) {
        p.fill(color);
        p.circle(b.x, b.y, r*2);
        p.fill(240); p.textAlign(p.CENTER, p.CENTER); p.textSize(12);
        p.text(b.m.toString(), b.x, b.y);
      }

      const C = computeCOM(p, arr);
      p.stroke(255, 160, 0); p.strokeWeight(2);
      p.line(C.x-15, C.y, C.x+15, C.y); p.line(C.x, C.y-15, C.x, C.y+15);
    };

    p.windowResized = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w,h);
    };

    p.mousePressed = () => {
      const arr = massesRef.current; dragging = -1;
      for (let i = 0; i < arr.length; i++) {
        if (p.dist(p.mouseX, p.mouseY, arr[i].x, arr[i].y) < r) { dragging = i; break; }
      }
    };

    p.mouseDragged = () => {
      if (dragging >= 0) {
        const arr = massesRef.current;
        const updated = new Array(arr.length);
        for (let i = 0; i < arr.length; i++) {
          updated[i] = i === dragging ? { ...arr[i], x: p.mouseX, y: p.mouseY } : arr[i];
        }
        setMasses(updated);
      }
    };

    p.mouseReleased = () => { dragging = -1; };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Masses:" val={cfg.massCount} min={2} max={8} step={1} onChange={handle("massCount")} />
        <CheckboxInput label="Trail" name="showTrails" checked={cfg.showTrails} onChange={handle("showTrails")} />
        <ColorInput label="Mass Color:" value={cfg.color} onChange={handle("color")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default CenterOfMass;
