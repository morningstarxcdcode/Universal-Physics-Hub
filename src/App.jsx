import { Route, BrowserRouter, Routes } from "react-router-dom"
import { Suspense, lazy } from "react"

const Home = lazy(() => import("./pages/home.jsx").then(m => ({ default: m.Home })));
const ErrorPage = lazy(() => import("./pages/error.jsx").then(m => ({ default: m.Error })));

const BouncingBall = lazy(() => import("./pages/simulations/BouncingBall.jsx").then(m => ({ default: m.BouncingBall })));
const VectorsOperations = lazy(() => import("./pages/simulations/VectorsOperations.jsx").then(m => ({ default: m.VectorsOperations })));
const BallAcceleration = lazy(() => import("./pages/simulations/BallAcceleration.jsx").then(m => ({ default: m.BallAcceleration })));
const BallGravity = lazy(() => import("./pages/simulations/BallGravity.jsx").then(m => ({ default: m.BallGravity })));
const ProjectileMotion = lazy(() => import("./pages/simulations/ProjectileMotion.jsx").then(m => ({ default: m.ProjectileMotion })));
const SimpleHarmonicMotion = lazy(() => import("./pages/simulations/SimpleHarmonicMotion.jsx").then(m => ({ default: m.SimpleHarmonicMotion })));
const Pendulum = lazy(() => import("./pages/simulations/Pendulum.jsx").then(m => ({ default: m.Pendulum })));
const CircularMotion = lazy(() => import("./pages/simulations/CircularMotion.jsx").then(m => ({ default: m.CircularMotion })));
const ElasticCollision1D = lazy(() => import("./pages/simulations/ElasticCollision1D.jsx").then(m => ({ default: m.ElasticCollision1D })));
const InclinedPlane = lazy(() => import("./pages/simulations/InclinedPlane.jsx").then(m => ({ default: m.InclinedPlane })));
const WaveInterference = lazy(() => import("./pages/simulations/WaveInterference.jsx").then(m => ({ default: m.WaveInterference })));
const Refraction = lazy(() => import("./pages/simulations/Refraction.jsx").then(m => ({ default: m.Refraction })));
const ElectricField = lazy(() => import("./pages/simulations/ElectricField.jsx").then(m => ({ default: m.ElectricField })));
const OrbitSimulator = lazy(() => import("./pages/simulations/OrbitSimulator.jsx").then(m => ({ default: m.OrbitSimulator })));
const DampedOscillator = lazy(() => import("./pages/simulations/DampedOscillator.jsx").then(m => ({ default: m.DampedOscillator })));
const CenterOfMass = lazy(() => import("./pages/simulations/CenterOfMass.jsx").then(m => ({ default: m.CenterOfMass })));
const TorqueRotation = lazy(() => import("./pages/simulations/TorqueRotation.jsx").then(m => ({ default: m.TorqueRotation })));
const WorkEnergy = lazy(() => import("./pages/simulations/WorkEnergy.jsx").then(m => ({ default: m.WorkEnergy })));
const ImpulseMomentum = lazy(() => import("./pages/simulations/ImpulseMomentum.jsx").then(m => ({ default: m.ImpulseMomentum })));
const DampedBouncingBall = lazy(() => import("./pages/simulations/DampedBouncingBall.jsx").then(m => ({ default: m.DampedBouncingBall })));
const ProjectileWithDrag = lazy(() => import("./pages/simulations/ProjectileWithDrag.jsx").then(m => ({ default: m.ProjectileWithDrag })));
const TwoBodyGravity = lazy(() => import("./pages/simulations/TwoBodyGravity.jsx").then(m => ({ default: m.TwoBodyGravity })));
const ThreeBodyRestricted = lazy(() => import("./pages/simulations/ThreeBodyRestricted.jsx").then(m => ({ default: m.ThreeBodyRestricted })));
const HookesLawLab = lazy(() => import("./pages/simulations/HookesLawLab.jsx").then(m => ({ default: m.HookesLawLab })));
const StandingWaves = lazy(() => import("./pages/simulations/StandingWaves.jsx").then(m => ({ default: m.StandingWaves })));
const DopplerEffect = lazy(() => import("./pages/simulations/DopplerEffect.jsx").then(m => ({ default: m.DopplerEffect })));
const LensMaker = lazy(() => import("./pages/simulations/LensMaker.jsx").then(m => ({ default: m.LensMaker })));
const RCCircuit = lazy(() => import("./pages/simulations/RCCircuit.jsx").then(m => ({ default: m.RCCircuit })));
const MagneticLoop = lazy(() => import("./pages/simulations/MagneticLoop.jsx").then(m => ({ default: m.MagneticLoop })));
const ThermalMotion = lazy(() => import("./pages/simulations/ThermalMotion.jsx").then(m => ({ default: m.ThermalMotion })));
const OhmsLawLab = lazy(() => import("./pages/simulations/OhmsLawLab.jsx").then(m => ({ default: m.OhmsLawLab })));
const MirrorLab = lazy(() => import("./pages/simulations/MirrorLab.jsx").then(m => ({ default: m.MirrorLab })));
const HumanEyeColorfulWorld = lazy(() => import("./pages/simulations/HumanEyeColorfulWorld.jsx").then(m => ({ default: m.HumanEyeColorfulWorld })));
const MagneticFieldWire = lazy(() => import("./pages/simulations/MagneticFieldWire.jsx").then(m => ({ default: m.MagneticFieldWire })));
const About = lazy(() => import("./pages/about.jsx").then(m => ({ default: m.About })));
const Contribution = lazy(() => import("./pages/contribution.jsx").then(m => ({ default: m.Contribution })));
const MotionStraightLine = lazy(() => import("./pages/simulations/MotionStraightLine.jsx").then(m => ({ default: m.MotionStraightLine })));
const EMInductionAC = lazy(() => import("./pages/simulations/EMInductionAC.jsx").then(m => ({ default: m.EMInductionAC })));
const SourcesOfEnergy = lazy(() => import("./pages/simulations/SourcesOfEnergy.jsx").then(m => ({ default: m.SourcesOfEnergy })));
const Pyq = lazy(() => import("./pages/pyq.jsx").then(m => ({ default: m.PYQ })));

export default function App() {
  return (
    <BrowserRouter basename="/Universal-Physics-Hub/">
      <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
        <Routes>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contribution" element={<Contribution />} />
            <Route path="pyq" element={<Pyq />} />
            <Route path="BouncingBall" element={<BouncingBall />} />
            <Route path="VectorsOperations" element={<VectorsOperations />} />
            <Route path="BallAcceleration" element={<BallAcceleration />} />
            <Route path="BallGravity" element={<BallGravity />} />
            <Route path="ProjectileMotion" element={<ProjectileMotion />} />
            <Route path="SimpleHarmonicMotion" element={<SimpleHarmonicMotion />} />
            <Route path="Pendulum" element={<Pendulum />} />
            <Route path="CircularMotion" element={<CircularMotion />} />
            <Route path="ElasticCollision1D" element={<ElasticCollision1D />} />
            <Route path="InclinedPlane" element={<InclinedPlane />} />
            <Route path="WaveInterference" element={<WaveInterference />} />
            <Route path="Refraction" element={<Refraction />} />
            <Route path="ElectricField" element={<ElectricField />} />
            <Route path="OrbitSimulator" element={<OrbitSimulator />} />
            <Route path="DampedOscillator" element={<DampedOscillator />} />
            <Route path="CenterOfMass" element={<CenterOfMass />} />
            <Route path="TorqueRotation" element={<TorqueRotation />} />
            <Route path="WorkEnergy" element={<WorkEnergy />} />
            <Route path="ImpulseMomentum" element={<ImpulseMomentum />} />
            <Route path="DampedBouncingBall" element={<DampedBouncingBall />} />
            <Route path="ProjectileWithDrag" element={<ProjectileWithDrag />} />
            <Route path="TwoBodyGravity" element={<TwoBodyGravity />} />
            <Route path="ThreeBodyRestricted" element={<ThreeBodyRestricted />} />
            <Route path="HookesLawLab" element={<HookesLawLab />} />
            <Route path="StandingWaves" element={<StandingWaves />} />
            <Route path="DopplerEffect" element={<DopplerEffect />} />
            <Route path="LensMaker" element={<LensMaker />} />
            <Route path="RCCircuit" element={<RCCircuit />} />
            <Route path="MagneticLoop" element={<MagneticLoop />} />
            <Route path="ThermalMotion" element={<ThermalMotion />} />
            <Route path="OhmsLawLab" element={<OhmsLawLab />} />
            <Route path="MirrorLab" element={<MirrorLab />} />
            <Route path="HumanEyeColorfulWorld" element={<HumanEyeColorfulWorld />} />
            <Route path="MagneticFieldWire" element={<MagneticFieldWire />} />
            <Route path="MotionStraightLine" element={<MotionStraightLine />} />
            <Route path="EMInductionAC" element={<EMInductionAC />} />
            <Route path="SourcesOfEnergy" element={<SourcesOfEnergy />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
