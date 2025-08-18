import { useState, useRef, useEffect, useCallback } from "react";
import p5 from "p5";

import TopSim from "../../components/TopSim.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import ColorInput from "../../components/inputs/ColorInput.jsx";
import SelectInput from "../../components/inputs/SelectInput.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

// Ball physics helpers (no classes, minimal nesting)
function makeBallState(p, dimsRef, cfg) {
  return {
    cfg: { ...cfg },
    mass: cfg.mass,
    pos: p.createVector(dimsRef.current.w / 2, cfg.size / 2),
    vel: p.createVector(0, 0),
    acc: p.createVector(0, 0),
  };
}

function setBallConfig(ball, cfg) {
  ball.cfg = { ...cfg };
  ball.mass = cfg.mass;
}

function applyForce(ball, f) {
  const force = f.copy().div(ball.mass);
  ball.acc.add(force);
}

function updateBall(p, dimsRef, ball) {
  const { size, color } = ball.cfg;
  ball.vel.add(ball.acc);
  ball.pos.add(ball.vel);
  ball.acc.mult(0);
  p.stroke(0);
  p.strokeWeight(2);
  p.fill(p.color(color));
  p.ellipse(ball.pos.x, ball.pos.y, size);
  if (ball.pos.x < 0 || ball.pos.x > dimsRef.current.w) {
    ball.vel.x *= -1;
    ball.pos.x = p.constrain(ball.pos.x, 0, dimsRef.current.w);
  }
  if (ball.pos.y > dimsRef.current.h) {
    ball.vel.y *= -1;
    ball.pos.y = dimsRef.current.h;
  }
}

function resetBall(p, dimsRef, ball) {
  const { size } = ball.cfg;
  ball.pos = p.createVector(dimsRef.current.w / 2, size / 2);
  ball.vel.mult(0);
  ball.acc.mult(0);
}

// Factory for the p5 sketch to minimize nested functions.
function gravitySketch(p, canvasParent, configRef, bgColor, dimsRef, setIsBlowing) {
  let ball;
  p.setup = () => {
    dimsRef.current.w = canvasParent.current.clientWidth;
    dimsRef.current.h = canvasParent.current.clientHeight;
    p.createCanvas(dimsRef.current.w, dimsRef.current.h).parent(canvasParent.current);
    const style = getComputedStyle(canvasParent.current);
    const rgb = (style.backgroundColor.match(/\d+/g) || []).map(Number);
    bgColor.current = rgb.length === 3 ? rgb : [0, 0, 0];
    ball = makeBallState(p, dimsRef, configRef.current);
  };
  p.draw = () => {
    const { gravity, wind } = configRef.current;
    setBallConfig(ball, configRef.current);
    p.background(...bgColor.current);
    applyForce(ball, p.createVector(0, gravity));
    if (p.mouseIsPressed) {
      applyForce(ball, p.createVector(wind, 0));
    }
    updateBall(p, dimsRef, ball);
  };
  p.mousePressed = () => setIsBlowing(true);
  p.mouseReleased = () => setIsBlowing(false);
  p.windowResized = () => {
    dimsRef.current.w = canvasParent.current.clientWidth;
    dimsRef.current.h = canvasParent.current.clientHeight;
    p.resizeCanvas(dimsRef.current.w, dimsRef.current.h);
    resetBall(p, dimsRef, ball);
  };
}

export function BallGravity() {
  const location = useLocation();
  const [config, setConfig] = useState({
    mass: 5,
    size: 48,
    gravity: 1,
    color: "#7f7f7f",
    wind: 0.1
  });
  const [isBlowing, setIsBlowing] = useState(false); // NEW

  const configRef = useRef(config);
  useEffect(() => { configRef.current = config; }, [config]);

  const canvasParent = useRef(null);
  const p5Instance   = useRef(null);
  const dimsRef = useRef({ w: 0, h: 0 });

  const bgColor = useRef([0, 0, 0]);

  useEffect(() => {
  p5Instance.current = new p5((p) => gravitySketch(p, canvasParent, configRef, bgColor, dimsRef, setIsBlowing), canvasParent.current);

    return () => {
  p5Instance.current.remove();
    };
  }, []);


  const handleChange = useCallback(
    name => e => {
      const val = name === "color" ? e.target.value : +e.target.value;
      setConfig(cfg => ({ ...cfg, [name]: val }));
    },
    []
  );

  const gravityTypes = ((earthG = 1) => [
    { value: 0.000 * earthG, label: "Zero Gravity"                    },
    { value: 0.028 * earthG, label: "Ceres (0.27 m/s²)"               },
    { value: 0.063 * earthG, label: "Pluto (0.62 m/s²)"               },
    { value: 0.165 * earthG, label: "Moon (1.62 m/s²)"                },
    { value: 0.378 * earthG, label: "Mercury (3.70 m/s²)"             },
    { value: 0.379 * earthG, label: "Mars (3.71 m/s²)"                },
    { value: 0.886 * earthG, label: "Uranus (8.69 m/s²)"              },
    { value: 0.904 * earthG, label: "Venus (8.87 m/s²)"               },
    { value: 1.000 * earthG, label: "Earth (9.81 m/s²)"               },
    { value: 1.065 * earthG, label: "Saturn (10.44 m/s²)"             },
    { value: 1.140 * earthG, label: "Neptune (11.15 m/s²)"            },
    { value: 2.528 * earthG, label: "Jupiter (24.79 m/s²)"            }
  ])();

  return (
    <>
      <TopSim/>

      <div ref={canvasParent} className="screen wind-container" style={{ flex: 1 }}>
        <div
          className={`wind-overlay ${isBlowing ? 'blowing' : ''}`}
          aria-hidden="true"
        >
          <svg className="wind-icon" viewBox="0 0 64 32" width="80" height="40">
            <path d="M2 10 Q18 5, 30 10 T62 10" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 20 Q22 15, 34 20 T62 20" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            <circle cx="58" cy="10" r="2" fill="white" />
            <circle cx="56" cy="20" r="2" fill="white" />
          </svg>
        </div>
      </div>


      <div className="inputs-container">
        <NumberInput
          label="Ball Size:"
          val={config.size}
          min={10}
          max={200}
          onChange={handleChange("size")}
        />
        <NumberInput
          label="Mass:"
          val={config.mass}
          min={1}
          max={20}
          onChange={handleChange("mass")}
        />
        <NumberInput
          label="Wind:"
          val={config.wind}
          min={0}
          max={10}
          step={0.1}
          onChange={handleChange("wind")}
        />
        <SelectInput
          label="Gravity Types:"
          options={gravityTypes}
          value={config.gravity}
          onChange={handleChange("gravity")}
        />
        <ColorInput
          label="Ball Color:"
          value={config.color}
          onChange={handleChange("color")}
        />
      </div>

  <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}
