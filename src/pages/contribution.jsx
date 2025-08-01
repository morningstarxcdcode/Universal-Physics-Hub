// src/pages/contribution.jsx
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackgroundFX from "../components/BackgroundFX.jsx";
import useReveal from "../hooks/useReveal.js";

export function Contribution() {
  useReveal();
  return (
    <>
      <Header onSearch={() => {}} />
      <BackgroundFX variant="waves" />
      <main className="cosmic-particles" style={{ maxWidth: 960, margin: "0 auto", paddingTop: "7rem", paddingBottom: "2rem" }}>
        <h1 className="crazy-bounce neon-brag magnetic-text" style={{ marginBottom: "0.5rem" }}>Contribution</h1>
        <p style={{ opacity: 0.9 }}>
          We welcome small, focused pull requests—typos, theory clarifications, new simulations,
          performance tweaks, or UI polish. Please skim the React contribution guidelines for
          general etiquette and workflow:
          {" "}
          <a className="ripple-effect" href="https://legacy.reactjs.org/docs/how-to-contribute.html" target="_blank" rel="noreferrer">How to Contribute to React</a>.
        </p>

  <h2 className="reveal-element" style={{ margin: "1.5rem 0 0.5rem" }}>Project specifics</h2>
  <ol className="reveal-element" style={{ paddingLeft: "1.25rem", lineHeight: 1.8 }}>
          <li>
            Fork and create a feature branch. Keep changes scoped (one feature/fix per PR).
          </li>
          <li>
            Run locally: install deps, <code>npm run dev</code>, and verify pages load.
          </li>
          <li>
            Lint before commit: <code>npm run lint</code>. Avoid unused vars and nested ternaries.
          </li>
          <li>
            Adding a simulation? Create a component in <code>src/pages/simulations/</code>, lazy‑load it in <code>src/App.jsx</code>, and add a chapter entry in <code>src/data/chapters.js</code> with theory blocks.
          </li>
          <li>
            Write concise theory: formulas, short notes, and 1–2 experiments. Keep tone clear and human.
          </li>
          <li>
            Open a PR with a short description and screenshots; mention affected chapters/routes.
          </li>
        </ol>

  <h2 className="reveal-element" style={{ margin: "1.5rem 0 0.5rem" }}>Development tips</h2>
  <ul className="reveal-element" style={{ paddingLeft: "1.25rem" }}>
          <li>Prefer small components and pure functions inside sketches.</li>
          <li>Use instance‑mode p5 to avoid global collisions.</li>
          <li>Keep imports minimal; code‑split new routes if heavy.</li>
        </ul>
      </main>
      <Footer />
    </>
  );
}
