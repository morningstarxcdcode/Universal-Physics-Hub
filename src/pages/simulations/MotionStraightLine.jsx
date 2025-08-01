import { useState, useRef, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function MotionStraightLine() {
  const location = useLocation();
  const [inputs, setInputs] = useState({
    u: 5, // initial velocity (px/s)
    a: 1, // acceleration (px/s^2)
    duration: 10, // seconds shown
    showGrid: true,
  });

  const inputsRef = useRef(inputs);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const Sketch = useCallback(p => {
    let t = 0; // time in seconds
    let lastMillis = 0;

    function bgColorOfScreen() {
      const screenEl = document.querySelector('.screen');
      const rgb = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g).map(Number);
      return rgb;
    }

    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.createCanvas(w, h);
      lastMillis = p.millis();
    };

    function drawAxes(x, y, w, h, xLabel, yLabel) {
      p.push();
      p.translate(x, y);
      p.stroke(180);
      p.strokeWeight(1);
      p.noFill();
      p.rect(0, 0, w, h);
      p.fill(200);
      p.noStroke();
      p.textSize(12);
      p.text(xLabel, w - 40, h - 6);
      p.push();
      p.translate(8, 14);
      p.rotate(-p.HALF_PI);
      p.text(yLabel, 0, 0);
      p.pop();
      p.pop();
    }

    function drawGrid(x, y, w, h, nx = 10, ny = 6) {
      p.push();
      p.translate(x, y);
      p.stroke(235);
      p.strokeWeight(1);
      for (let i = 1; i < nx; i++) {
        const gx = (i * w) / nx;
        p.line(gx, 0, gx, h);
      }
      for (let j = 1; j < ny; j++) {
        const gy = (j * h) / ny;
        p.line(0, gy, w, gy);
      }
      p.pop();
    }

    function drawPlot({ x, y, w, h, fn, color }) {
      p.push();
      p.translate(x, y);
      p.noFill();
      p.stroke(color);
      p.strokeWeight(2);

      const { duration } = inputsRef.current;
      p.beginShape();
      for (let i = 0; i <= w; i++) {
        const tt = (i / w) * duration;
        const val = fn(tt);
        // auto-scale to fit panel: estimate range from sampled values
        // simple approach: map val using heuristic scale derived from current inputs
        const scaleY = h / 3; // normalized scale, then clamp into panel
        const yy = p.constrain(h - (val / scaleY) * (h * 0.8) - h * 0.1, 0, h);
        p.vertex(i, yy);
      }
      p.endShape();
      p.pop();
    }

    p.draw = () => {
      const now = p.millis();
      const dt = (now - lastMillis) / 1000;
      lastMillis = now;

      const { u, a, duration, showGrid } = inputsRef.current;
      // advance time, loop within [0,duration]
      t += dt;
      if (t > duration) t = 0;

      const [r, g, b] = bgColorOfScreen();
      p.background(r, g, b);

      const pad = 16;
      const panelW = (p.width - pad * 3) / 2;
      const panelH = (p.height - pad * 3) / 2;

      // Top-left: s(t) = ut + 1/2 a t^2
      drawAxes(pad, pad, panelW, panelH, "t (s)", "s");
      if (showGrid) drawGrid(pad, pad, panelW, panelH);
      drawPlot({
        x: pad, y: pad, w: panelW, h: panelH,
        fn: (tt) => u * tt + 0.5 * a * tt * tt,
        color: p.color(50, 160, 255)
      });

      // Top-right: v(t) = u + a t
      drawAxes(pad * 2 + panelW, pad, panelW, panelH, "t (s)", "v");
      if (showGrid) drawGrid(pad * 2 + panelW, pad, panelW, panelH);
      drawPlot({
        x: pad * 2 + panelW, y: pad, w: panelW, h: panelH,
        fn: (tt) => u + a * tt,
        color: p.color(255, 120, 60)
      });

      // Bottom-left: a(t) constant
      drawAxes(pad, pad * 2 + panelH, panelW, panelH, "t (s)", "a");
      if (showGrid) drawGrid(pad, pad * 2 + panelH, panelW, panelH);
      p.push();
      p.translate(pad, pad * 2 + panelH);
      p.stroke(60, 200, 120);
      p.strokeWeight(2);
      const yConst = p.constrain(panelH - (a / (panelH / 3)) * (panelH * 0.8) - panelH * 0.1, 0, panelH);
      p.line(0, yConst, panelW, yConst);
      p.pop();

      // Bottom-right: instantaneous numeric values
      p.push();
      p.translate(pad * 2 + panelW, pad * 2 + panelH);
      p.fill(230);
      p.noStroke();
      p.textSize(14);
      const sNow = u * t + 0.5 * a * t * t;
      const vNow = u + a * t;
      const lines = [
        `t = ${t.toFixed(2)} s`,
        `s(t) = ${sNow.toFixed(2)} (arb. units)`,
        `v(t) = ${vNow.toFixed(2)} (arb. units/s)`,
        `a = ${a.toFixed(2)} (arb. units/s^2)`
      ];
      for (let i = 0; i < lines.length; i++) {
        p.text(lines[i], 0, 20 + i * 20);
      }
      p.pop();
    };

    p.windowResized = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.resizeCanvas(w, h);
    };
  }, []);

  return (
    <>
      <TopSim />
      <Screen sketch={Sketch} />
      <div className="inputs-container">
        <NumberInput
          label="Initial velocity u"
          name="u"
          placeholder="u (px/s)"
          val={inputs.u}
          onChange={e => handleInputChange("u", Number(e.target.value))}
        />
        <NumberInput
          label="Acceleration a"
          name="a"
          placeholder="a (px/s^2)"
          val={inputs.a}
          onChange={e => handleInputChange("a", Number(e.target.value))}
        />
        <NumberInput
          label="Duration"
          name="duration"
          placeholder="seconds"
          val={inputs.duration}
          onChange={e => handleInputChange("duration", Math.max(1, Number(e.target.value)))}
        />
        <CheckboxInput
          label="Show grid"
          name="showGrid"
          checked={inputs.showGrid}
          onChange={e => handleInputChange("showGrid", e.target.checked)}
        />
      </div>

      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}
