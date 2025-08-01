import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

// Simple spherical mirror lab: draw principal axis, mirror, object, image using 1/f = 1/u + 1/v with f=R/2
export function MirrorLab() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ concave: true, R: 200, obj: 250, height: 60, rays: true });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => {
    let val;
    if (typeof e === 'boolean') val = e;
    else if (e?.target?.type === 'checkbox') val = e.target.checked;
    else val = Number(e.target.value);
    setCfg(s => ({ ...s, [n]: val }));
  };

  const Sketch = useCallback((p) => {
    let W, H, cx, cy;
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; W=w; H=h; cx=W/2; cy=H/2; p.createCanvas(W,H); p.textFont('system-ui'); };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; W=w; H=h; cx=W/2; cy=H/2; p.resizeCanvas(W,H); };
    p.draw = () => {
      const { concave, R, obj, height, rays } = cfgRef.current;
      const f = (concave ? 1 : -1) * (R/2);
      const u = obj; // object distance (positive to left of mirror)
      const v = (f*u) / (u - f); // mirror formula
      const m = -v/u; // magnification
      const imgH = m * height;

      p.background(20);
      // principal axis
      p.stroke(120); p.line(0, cy, W, cy);
      // mirror at center (vertical line arc)
      p.noFill();
      p.stroke(180);
      const mirrorX = cx;
      p.line(mirrorX, cy-180, mirrorX, cy+180);
      // pole, focus, center of curvature
      p.noStroke(); p.fill(220);
      p.text('P', mirrorX-10, cy-8);
      p.fill(150,220,255); p.text('F', mirrorX - (f>0?Math.abs(f):-Math.abs(f)) - 10 + mirrorX - mirrorX, cy - 8);

      // object on left of mirror at distance u
      const objX = mirrorX - u;
      const objYTop = cy - height;
      p.stroke(255,200,120); p.line(objX, cy, objX, objYTop);
      p.noStroke(); p.fill(255,200,120); p.circle(objX, objYTop, 6);

      // image position on right or left depending on sign of v
      const imgX = mirrorX + v;
      const imgYTop = cy - imgH;
      p.stroke(120,255,180); p.line(imgX, cy, imgX, imgYTop);
      p.noStroke(); p.fill(120,255,180); p.circle(imgX, imgYTop, 6);

      if (rays) {
        p.stroke(240,120,120);
        // ray 1: parallel to axis -> through focus (after reflection)
        p.line(objX, objYTop, mirrorX, objYTop);
        p.line(mirrorX, objYTop, imgX, imgYTop);
        // ray 2: through center -> returns on itself
        p.line(objX, objYTop, mirrorX, cy);
        p.line(mirrorX, cy, imgX, imgYTop);
      }

      // labels
      p.fill(230); p.text(`R=${R.toFixed(0)}px, f=${f.toFixed(1)}px, u=${u.toFixed(1)}px, v=${v.toFixed(1)}px, m=${m.toFixed(2)}`, 20, 28);
    };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <CheckboxInput label="Concave" name="concave" checked={cfg.concave} onChange={handle("concave")} />
        <NumberInput label="Radius R (px):" val={cfg.R} min={50} max={400} step={10} onChange={handle("R")} />
        <NumberInput label="Object u (px):" val={cfg.obj} min={40} max={500} step={10} onChange={handle("obj")} />
        <NumberInput label="Object height (px):" val={cfg.height} min={20} max={120} step={5} onChange={handle("height")} />
        <CheckboxInput label="Show rays" name="rays" checked={cfg.rays} onChange={handle("rays")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default MirrorLab;
