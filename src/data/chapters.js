import { TAGS } from "./tags";

const chapters = [
  {
    id: 1,
    name: "Bouncing Ball",
    desc: "Simulation of the ball bouncing off the walls.",
    link: "/BouncingBall",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.COLLISION, TAGS.ANIMATIONS]
  },
  {
    id: 2,
    name: "Vector Operations",
    desc: "Vector Operations in real time.",
    link: "/VectorsOperations",
    tags: [TAGS.MEDIUM, TAGS.MATH, TAGS.VECTORS, TAGS.PHYSICS]
  },
  {
    id: 3,
    name: "Ball Acceleration",
    desc: "Ball accelerating to the mouse direction.",
    link: "/BallAcceleration",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.ACCELERATION]
  },
  {
    id: 4,
    name: "Ball Gravity",
    desc: "Ball fall and bounce on the ground.",
    link: "/BallGravity",
    tags: [TAGS.EASY, TAGS.VECTORS, TAGS.GRAVITY]
  },
  {
    id: 5,
    name: "Projectile Motion",
    desc: "Launch a ball with angle and speed; observe parabolic flight and bounces.",
    link: "/ProjectileMotion",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.PROJECTILES, TAGS.VECTORS]
  },
  {
    id: 6,
    name: "Simple Harmonic Motion",
    desc: "Mass–spring oscillator with damping.",
    link: "/SimpleHarmonicMotion",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.WAVES]
  },
  {
    id: 7,
    name: "Pendulum",
    desc: "Simple pendulum with adjustable length and damping.",
    link: "/Pendulum",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.ROTATION]
  },
  {
    id: 8,
    name: "Circular Motion",
    desc: "Uniform circular motion with velocity and centripetal vectors.",
    link: "/CircularMotion",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.ROTATION, TAGS.VECTORS]
  },
  {
    id: 9,
    name: "1D Elastic Collision",
    desc: "Two masses colliding elastically on a line.",
    link: "/ElasticCollision1D",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.COLLISION, TAGS.MATH]
  },
  {
    id: 10,
    name: "Inclined Plane",
    desc: "Block on a slope with static and kinetic friction.",
    link: "/InclinedPlane",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS]
  },
  {
    id: 11,
    name: "Wave Interference",
    desc: "Sum of two sinusoidal waves with phase shift.",
    link: "/WaveInterference",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.WAVES]
  },
  {
    id: 12,
    name: "Refraction (Snell's Law)",
    desc: "Ray refraction between two media.",
    link: "/Refraction",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.OPTICS]
  },
  {
    id: 13,
    name: "Electric Field (2 charges)",
    desc: "Vector field from two point charges.",
    link: "/ElectricField",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.ELECTRICITY, TAGS.VECTORS]
  },
  {
    id: 14,
    name: "Orbit Simulator",
    desc: "Keplerian orbit around a fixed mass.",
    link: "/OrbitSimulator",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.ORBITS]
  },
  {
    id: 15,
    name: "Damped Driven Oscillator",
    desc: "Harmonic oscillator with external sinusoidal drive.",
    link: "/DampedOscillator",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.WAVES]
  },
  {
    id: 16,
    name: "Center of Mass",
    desc: "Compute center of mass of a system and visualize motion.",
    link: "/CenterOfMass",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.VECTORS]
  },
  {
    id: 17,
    name: "Torque and Rotation",
    desc: "Rigid body rotation under applied torque.",
    link: "/TorqueRotation",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.ROTATION]
  },
  {
    id: 18,
    name: "Work and Energy",
    desc: "Work–energy theorem with variable force.",
    link: "/WorkEnergy",
    tags: [TAGS.EASY, TAGS.PHYSICS]
  },
  {
    id: 19,
    name: "Impulse and Momentum",
    desc: "Impulse changes momentum; visualize collisions.",
    link: "/ImpulseMomentum",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS]
  },
  {
    id: 20,
    name: "Damped Bouncing Ball",
    desc: "Bounces with restitution < 1 and optional air drag.",
    link: "/DampedBouncingBall",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.COLLISION]
  },
  {
    id: 21,
    name: "Projectile with Drag",
    desc: "Quadratic drag projectile motion and range reduction.",
    link: "/ProjectileWithDrag",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.PROJECTILES]
  },
  {
    id: 22,
    name: "Two-body Gravity",
    desc: "Mutual gravitation of two moving masses.",
    link: "/TwoBodyGravity",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.ORBITS]
  },
  {
    id: 23,
    name: "3-Body (Restricted)",
    desc: "Restricted three-body problem (μ ≪ 1).",
    link: "/ThreeBodyRestricted",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.ORBITS]
  },
  {
    id: 24,
    name: "Hooke’s Law Lab",
    desc: "Measure k from force vs extension graph.",
    link: "/HookesLawLab",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.WAVES]
  },
  {
    id: 25,
    name: "Standing Waves",
    desc: "1D standing wave on a string with nodes/antinodes.",
    link: "/StandingWaves",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.WAVES]
  },
  {
    id: 26,
    name: "Doppler Effect",
    desc: "Perceived frequency shift due to relative motion.",
    link: "/DopplerEffect",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.WAVES]
  },
  {
    id: 27,
    name: "Lens Maker",
    desc: "Thin lens equation and image formation.",
    link: "/LensMaker",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.OPTICS]
  },
  {
    id: 28,
    name: "RC Circuit",
    desc: "Charging and discharging of a capacitor.",
    link: "/RCCircuit",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.ELECTRICITY]
  },
  {
    id: 29,
    name: "Magnetic Field (Loop)",
    desc: "B-field around a current loop (Biot–Savart).",
    link: "/MagneticLoop",
    tags: [TAGS.ADVANCED, TAGS.PHYSICS, TAGS.ELECTRICITY]
  },
  {
    id: 30,
    name: "Thermal Motion (2D)",
    desc: "Random walk model for Brownian-like motion.",
    link: "/ThermalMotion",
    tags: [TAGS.EASY, TAGS.PHYSICS]
  },
  {
    id: 31,
    name: "Ohm's Law Lab",
    desc: "Explore V=IR with series/parallel combinations.",
    link: "/OhmsLawLab",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.ELECTRICITY]
  },
  {
    id: 32,
    name: "Light: Reflection and Mirrors",
    desc: "Spherical mirrors lab (concave/convex) with ray diagram.",
    link: "/MirrorLab",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.OPTICS]
  },
  {
    id: 33,
    name: "The Human Eye and the Colourful World",
    desc: "Eye model with myopia/hyperopia and prism dispersion.",
    link: "/HumanEyeColorfulWorld",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.OPTICS]
  },
  {
    id: 34,
    name: "Magnetic Effects of Electric Current",
    desc: "Field lines around a long straight wire (right‑hand rule).",
    link: "/MagneticFieldWire",
    tags: [TAGS.EASY, TAGS.PHYSICS, TAGS.ELECTRICITY]
  },
  {
    id: 35,
    name: "Motion in a Straight Line",
    desc: "s–t, v–t and a–t relations with constant acceleration.",
    link: "/MotionStraightLine",
    tags: [TAGS.EASY, TAGS.PHYSICS]
  },
  {
    id: 36,
    name: "Electromagnetic Induction & AC (RLC)",
    desc: "EMF sine source driving an RLC; phasors and phase angle.",
    link: "/EMInductionAC",
    tags: [TAGS.MEDIUM, TAGS.PHYSICS, TAGS.ELECTRICITY]
  },
  {
    id: 37,
    name: "Sources of Energy",
    desc: "Mix solar, wind, hydro, and fossil to meet daily demand and see cost.",
    link: "/SourcesOfEnergy",
    tags: [TAGS.EASY, TAGS.PHYSICS]
  }
];

export default chapters;