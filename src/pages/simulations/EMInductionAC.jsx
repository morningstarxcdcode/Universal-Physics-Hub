import { useState, useRef, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import CheckboxInput from "../../components/inputs/CheckboxInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function EMInductionAC() {
  const location = useLocation();
  const [inputs, setInputs] = useState({
    emfAmplitude: 5,
    frequency: 1,
    resistance: 10,
    inductance: 0.2,
    capacitance: 0.002,
    showPhasor: true,
  });

  const inputsRef = useRef(inputs);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const Sketch = useCallback(p => {
    let t = 0;
    let lastMillis = 0;

    function bg() {
      const screenEl = document.querySelector('.screen');
      const rgb = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g).map(Number);
      return rgb;
    }

    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
  p.createCanvas(w, h);
  lastMillis = p.millis();
      p.textFont('sans-serif');
    };

    function drawAxes(x, y, w, h, xLabel, yLabel) {
      p.push();
      p.translate(x, y);
      p.stroke(180);
      p.noFill();
      p.rect(0, 0, w, h);
      p.noStroke();
      p.fill(200);
      p.textSize(12);
      p.text(xLabel, w - 40, h - 6);
      p.push(); p.translate(8, 14); p.rotate(-p.HALF_PI); p.text(yLabel, 0, 0); p.pop();
      p.pop();
    }

  function plotSine({ x, y, w, h, A, phi, color }) {
      p.push();
      p.translate(x, y);
      p.noFill();
      p.stroke(color);
      p.strokeWeight(2);
      p.beginShape();
      for (let i = 0; i <= w; i++) {
    const tt = (i / w) * 2 * Math.PI; // normalized phase across width
    const val = A * Math.sin(tt + phi);
        const yy = h / 2 - (val / (A || 1)) * (h * 0.45);
        p.vertex(i, yy);
      }
      p.endShape();
      p.pop();
    }

    function drawPhasor(cx, cy, radius, angleV, angleI) {
      p.push();
      p.translate(cx, cy);
      p.noFill();
      p.stroke(180);
      p.circle(0, 0, radius * 2);
      // Voltage phasor
      p.stroke(255, 120, 60);
      p.line(0, 0, radius * Math.cos(angleV), -radius * Math.sin(angleV));
      p.noStroke();
      p.fill(255, 120, 60);
      p.text("V", radius * Math.cos(angleV) + 6, -radius * Math.sin(angleV));
      // Current phasor
      p.stroke(60, 200, 120);
      p.line(0, 0, radius * Math.cos(angleI), -radius * Math.sin(angleI));
      p.noStroke();
      p.fill(60, 200, 120);
      p.text("I", radius * Math.cos(angleI) + 6, -radius * Math.sin(angleI));
      p.pop();
    }

    p.draw = () => {
      const now = p.millis();
      const dt = (now - lastMillis) / 1000;
      lastMillis = now;
      t += dt;

  const { emfAmplitude, frequency, resistance, inductance, capacitance, showPhasor } = inputsRef.current;
  const omega = 2 * Math.PI * frequency;
      const Xl = omega * inductance;
      const Xc = 1 / (omega * capacitance || 1e-6);
      const Z = Math.sqrt(resistance * resistance + Math.pow(Xl - Xc, 2));
      const I = emfAmplitude / (Z || 1e-6);
  const phi = Math.atan2(Xl - Xc, resistance); // phase of V relative to I

      const [r, g, b] = bg();
      p.background(r, g, b);

      const pad = 16;
      const panelW = (p.width - pad * 3) / 2;
      const panelH = (p.height - pad * 3) / 2;

      // Top-left: EMF vs time (animated)
  drawAxes(pad, pad, panelW, panelH, "t", "emf");
  plotSine({ x: pad, y: pad, w: panelW, h: panelH, A: emfAmplitude, phi: omega * t, color: p.color(255, 120, 60) });

      // Top-right: Current vs time with phase
  drawAxes(pad * 2 + panelW, pad, panelW, panelH, "t", "i");
  plotSine({ x: pad * 2 + panelW, y: pad, w: panelW, h: panelH, A: I, phi: omega * t - phi, color: p.color(60, 200, 120) });

      // Bottom-left: phasor diagram
      drawAxes(pad, pad * 2 + panelH, panelW, panelH, "phasor", "");
      if (showPhasor) {
        const angleV = omega * t; // rotate with ωt
        const angleI = angleV - phi; // lag/lead
        drawPhasor(pad + panelW / 2, pad * 2 + panelH + panelH / 2, Math.min(panelW, panelH) * 0.35, angleV, angleI);
      }

      // Bottom-right: numbers
      p.push();
      p.translate(pad * 2 + panelW, pad * 2 + panelH);
      p.fill(230);
      p.noStroke();
      p.textSize(14);
      const lines = [
        `ω = ${omega.toFixed(2)} rad/s`,
        `X_L = ${Xl.toFixed(2)} Ω`,
        `X_C = ${Xc.toFixed(2)} Ω`,
        `|Z| = ${Z.toFixed(2)} Ω`,
        `I_rms (approx) = ${(I/Math.SQRT2).toFixed(2)} A`,
        `φ (V leads I) = ${(phi*180/Math.PI).toFixed(1)}°`
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
        <NumberInput label="EMF amplitude (V)" name="emfAmplitude" val={inputs.emfAmplitude} onChange={e => handleInputChange("emfAmplitude", Number(e.target.value))} />
        <NumberInput label="Frequency (Hz)" name="frequency" val={inputs.frequency} onChange={e => handleInputChange("frequency", Math.max(0.1, Number(e.target.value)))} />
        <NumberInput label="Resistance R (Ω)" name="resistance" val={inputs.resistance} onChange={e => handleInputChange("resistance", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Inductance L (H)" name="inductance" val={inputs.inductance} onChange={e => handleInputChange("inductance", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Capacitance C (F)" name="capacitance" val={inputs.capacitance} onChange={e => handleInputChange("capacitance", Math.max(1e-6, Number(e.target.value)))} />
        <CheckboxInput label="Show phasor" name="showPhasor" checked={inputs.showPhasor} onChange={e => handleInputChange("showPhasor", e.target.checked)} />
      </div>
      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}
