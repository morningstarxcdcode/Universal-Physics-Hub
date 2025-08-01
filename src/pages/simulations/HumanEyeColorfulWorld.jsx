import { useRef, useState, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

// Human eye: simple lens + adjustable focal length to show myopia/hyperopia and correction
export function HumanEyeColorfulWorld() {
  const location = useLocation();
  const [cfg, setCfg] = useState({ focal: 55, eyeLen: 60, obj: 300, correct: false, prism: false });
  const cfgRef = useRef(cfg); useEffect(() => { cfgRef.current = cfg; }, [cfg]);
  const handle = (n) => (e) => setCfg(s => ({ ...s, [n]: e?.target?.type === 'checkbox' ? e.target.checked : Number(e.target.value) }));

  const Sketch = useCallback((p) => {
    p.setup = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.createCanvas(w, h); };
    p.windowResized = () => { const { clientWidth: w, clientHeight: h } = p._userNode; p.resizeCanvas(w, h); };
    p.draw = () => {
      const { focal, eyeLen, obj, correct, prism } = cfgRef.current;
      p.background(24);
      const cx = p.width*0.55, cy = p.height/2;
      // retina plane at cx + eyeLen
      const retinaX = cx + eyeLen;
      p.stroke(120); p.line(0, cy, p.width, cy);
      p.stroke(80,160,255); p.line(retinaX, cy-120, retinaX, cy+120);
      p.noStroke(); p.fill(200); p.text('Retina', retinaX-20, cy-130);

      // lens at cx
      p.stroke(160); p.line(cx, cy-120, cx, cy+120);

      // object at left
      const objX = cx - obj; const objH = 80;
      p.stroke(255,210,120); p.line(objX, cy, objX, cy-objH); p.noStroke(); p.circle(objX, cy-objH, 6);

      // thin lens eq: 1/f = 1/u + 1/v  -> v = (f u)/(u - f)
      const u = obj; const v = (focal*u)/(u - focal);
      let imageX = cx + v; // image plane position
      let fEff = focal;

      // correction lens (very simple: shift effective focal)
      if (correct) { fEff = focal * 0.9; const v2 = (fEff*u)/(u - fEff); imageX = cx + v2; }

      // draw image marker
      const m = - (imageX - cx)/u; const imgH = m*objH;
      p.stroke(120,255,180); p.line(imageX, cy, imageX, cy - imgH); p.noStroke(); p.circle(imageX, cy - imgH, 6);

      if (prism) {
        // dispersion, simple colored rays
        const colors = [p.color('#ff5555'), p.color('#ffaa00'), p.color('#55ccff')];
        for (let i=0;i<colors.length;i++) {
          p.stroke(colors[i]); p.line(objX, cy-objH, cx, cy-20+ i*20);
          p.line(cx, cy-20+i*20, imageX, cy - imgH);
        }
      } else {
        p.stroke(240,120,120); p.line(objX, cy-objH, cx, cy-20); p.line(cx, cy-20, imageX, cy - imgH);
      }

      p.fill(230); p.text(`f=${fEff.toFixed(1)}mm, u=${u.toFixed(1)}mm, v=${(imageX-cx).toFixed(1)}mm`, 16, 24);
      p.text(`Retina distance=${eyeLen.toFixed(1)}mm`, 16, 42);
    };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput label="Focal length f (mm):" val={cfg.focal} min={30} max={80} step={1} onChange={handle("focal")} />
        <NumberInput label="Eye length (mm):" val={cfg.eyeLen} min={40} max={80} step={1} onChange={handle("eyeLen")} />
        <NumberInput label="Object distance u (mm):" val={cfg.obj} min={100} max={600} step={10} onChange={handle("obj")} />
        <CheckboxInput label="Apply correction" name="correct" checked={cfg.correct} onChange={handle("correct")} />
        <CheckboxInput label="Show prism dispersion" name="prism" checked={cfg.prism} onChange={handle("prism")} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}

export default HumanEyeColorfulWorld;
