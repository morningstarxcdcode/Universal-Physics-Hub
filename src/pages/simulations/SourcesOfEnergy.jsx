import { useState, useRef, useEffect, useCallback } from "react";
import Screen from "../../components/Screen.jsx";
import NumberInput from "../../components/inputs/NumberInput.jsx";
import TopSim from "../../components/TopSim.jsx";
import TheoryRenderer from "../../components/theory/TheoryRenderer";
import chapters from "../../data/chapters.js";
import { useLocation } from "react-router-dom";

export function SourcesOfEnergy() {
  const location = useLocation();
  const [inputs, setInputs] = useState({
    demandKWh: 100,
    solarKW: 3,
    windKW: 2,
    hydroKW: 1,
    fossilKW: 2,
    capacityFactorSolar: 0.18,
    capacityFactorWind: 0.30,
    capacityFactorHydro: 0.45,
    capacityFactorFossil: 0.85,
    priceSolar: 0.06,
    priceWind: 0.05,
    priceHydro: 0.04,
    priceFossil: 0.10,
  });

  const inputsRef = useRef(inputs);
  useEffect(() => { inputsRef.current = inputs; }, [inputs]);

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const Sketch = useCallback(p => {
    function bg() {
      const screenEl = document.querySelector('.screen');
      const rgb = window.getComputedStyle(screenEl).backgroundColor.match(/\d+/g).map(Number);
      return rgb;
    }

    p.setup = () => {
      const { clientWidth: w, clientHeight: h } = p._userNode;
      p.createCanvas(w, h);
      p.textFont('sans-serif');
    };

    function bar(x, y, w, h, c) {
      p.push();
      p.translate(x, y);
      p.noStroke();
      p.fill(c);
      p.rect(0, 0, w, -h);
      p.pop();
    }

    p.draw = () => {
      const [r, g, b] = bg();
      p.background(r, g, b);

      const cfg = inputsRef.current;
      const hoursDay = 24;
      const energySolar = cfg.solarKW * cfg.capacityFactorSolar * hoursDay;
      const energyWind = cfg.windKW * cfg.capacityFactorWind * hoursDay;
      const energyHydro = cfg.hydroKW * cfg.capacityFactorHydro * hoursDay;
      const energyFossil = cfg.fossilKW * cfg.capacityFactorFossil * hoursDay;
      const totalEnergy = energySolar + energyWind + energyHydro + energyFossil;

      const cost = energySolar * cfg.priceSolar + energyWind * cfg.priceWind + energyHydro * cfg.priceHydro + energyFossil * cfg.priceFossil;
      const avgPrice = totalEnergy > 0 ? cost / totalEnergy : 0;

      const pad = 24;
      const baseY = p.height - pad;
      const maxH = p.height - pad * 2;
      const scale = maxH / Math.max(cfg.demandKWh, totalEnergy, 1);

      // demand line
      p.stroke(255, 120, 60);
      const demandY = baseY - cfg.demandKWh * scale;
      p.line(pad, demandY, p.width - pad, demandY);
      p.noStroke();
      p.fill(255, 120, 60);
      p.text(`Demand: ${cfg.demandKWh.toFixed(1)} kWh/day`, pad, demandY - 6);

      const labels = [
        { name: 'Solar', val: energySolar, color: p.color(255, 205, 65) },
        { name: 'Wind', val: energyWind, color: p.color(120, 200, 255) },
        { name: 'Hydro', val: energyHydro, color: p.color(80, 180, 220) },
        { name: 'Fossil', val: energyFossil, color: p.color(200, 80, 80) },
      ];

      const barW = (p.width - pad * 2) / (labels.length * 2);
      for (let i = 0; i < labels.length; i++) {
        const lx = pad + i * 2 * barW + barW * 0.5;
        const h = labels[i].val * scale;
        bar(lx, baseY, barW, h, labels[i].color);
        p.fill(230);
        p.text(`${labels[i].name}\n${labels[i].val.toFixed(1)} kWh`, lx, baseY - h - 6);
      }

      // totals
      p.fill(230);
      const status = totalEnergy >= cfg.demandKWh ? "Meets demand" : "Shortfall";
      p.text(`Total supply: ${totalEnergy.toFixed(1)} kWh/day — ${status}`, pad, pad);
      p.text(`Average cost: $${avgPrice.toFixed(3)} per kWh`, pad, pad + 18);
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
        <NumberInput label="Daily demand (kWh)" name="demandKWh" val={inputs.demandKWh} onChange={e => handleInputChange("demandKWh", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Solar capacity (kW)" name="solarKW" val={inputs.solarKW} onChange={e => handleInputChange("solarKW", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Wind capacity (kW)" name="windKW" val={inputs.windKW} onChange={e => handleInputChange("windKW", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Hydro capacity (kW)" name="hydroKW" val={inputs.hydroKW} onChange={e => handleInputChange("hydroKW", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Fossil capacity (kW)" name="fossilKW" val={inputs.fossilKW} onChange={e => handleInputChange("fossilKW", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Solar CF (0-1)" name="capacityFactorSolar" val={inputs.capacityFactorSolar} onChange={e => handleInputChange("capacityFactorSolar", Math.min(1, Math.max(0, Number(e.target.value))))} />
        <NumberInput label="Wind CF (0-1)" name="capacityFactorWind" val={inputs.capacityFactorWind} onChange={e => handleInputChange("capacityFactorWind", Math.min(1, Math.max(0, Number(e.target.value))))} />
        <NumberInput label="Hydro CF (0-1)" name="capacityFactorHydro" val={inputs.capacityFactorHydro} onChange={e => handleInputChange("capacityFactorHydro", Math.min(1, Math.max(0, Number(e.target.value))))} />
        <NumberInput label="Fossil CF (0-1)" name="capacityFactorFossil" val={inputs.capacityFactorFossil} onChange={e => handleInputChange("capacityFactorFossil", Math.min(1, Math.max(0, Number(e.target.value))))} />
        <NumberInput label="Solar price ($/kWh)" name="priceSolar" val={inputs.priceSolar} onChange={e => handleInputChange("priceSolar", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Wind price ($/kWh)" name="priceWind" val={inputs.priceWind} onChange={e => handleInputChange("priceWind", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Hydro price ($/kWh)" name="priceHydro" val={inputs.priceHydro} onChange={e => handleInputChange("priceHydro", Math.max(0, Number(e.target.value)))} />
        <NumberInput label="Fossil price ($/kWh)" name="priceFossil" val={inputs.priceFossil} onChange={e => handleInputChange("priceFossil", Math.max(0, Number(e.target.value)))} />
      </div>

      <TheoryRenderer theory={chapters.find(ch => ch.link === location.pathname)?.theory} />
    </>
  );
}
