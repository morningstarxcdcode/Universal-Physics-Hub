// src/pages/about.jsx
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackgroundFX from "../components/BackgroundFX.jsx";
import useReveal from "../hooks/useReveal.js";
// Static asset imports for credits (Vite will bundle these)
import contributorShot from "../../screenshots/Contributors/Screenshot 2025-08-18 at 10.59.50 AM.png";
import supporterShot from "../../screenshots/Supporters/Screenshot 2025-08-18 at 10.53.26 AM.png";

export function About() {
  useReveal();
  return (
    <>
      <Header onSearch={() => {}} />
      <BackgroundFX variant="aurora" />
      <main className="cosmic-particles" style={{ maxWidth: 960, margin: "0 auto", paddingTop: "7rem", paddingBottom: "2rem" }}>
        <h1 className="crazy-bounce neon-brag magnetic-text" style={{ marginBottom: "0.5rem" }}>About</h1>
        <p style={{ opacity: 0.9, marginBottom: "1.25rem" }}>
          Universal Physics Hub is a lightweight collection of interactive physics simulations
          paired with concise, exam‑ready theory. It’s built with React and p5.js, and designed
          to be fast, readable, and easy to extend.
        </p>

        <h2 className="reveal-element" style={{ margin: "1.5rem 0 0.5rem" }}>Connect</h2>
        <ul className="reveal-element" style={{ listStyle: "none", paddingLeft: 0, lineHeight: 1.9 }}>
          <li>
            <a className="ripple-effect" href="https://x.com/morningstarxcd" target="_blank" rel="noreferrer">X (Twitter): @morningstarxcd</a>
          </li>
          <li>
            <a className="ripple-effect" href="https://www.linkedin.com/in/sourav-rajak-6294682b2" target="_blank" rel="noreferrer">LinkedIn: sourav‑rajak</a>
          </li>
          <li>
            <a className="ripple-effect" href="https://github.com/morningstarxcdcode" target="_blank" rel="noreferrer">GitHub: @morningstarxcdcode</a>
          </li>
        </ul>

        <h2 className="reveal-element" style={{ margin: "1.5rem 0 0.5rem" }}>What’s inside</h2>
        <ul className="reveal-element" style={{ paddingLeft: "1.25rem" }}>
          <li>Canvas‑based experiments powered by p5.js (instance mode)</li>
          <li>Data‑driven chapters and theory blocks</li>
          <li>Route‑level code splitting for quick loads</li>
        </ul>
      </main>
      <section className="reveal-element" style={{ maxWidth: 960, margin: "0 auto", paddingBottom: "2rem" }}>
        <h2 style={{ margin: "1.5rem 0 0.5rem" }}>Credits</h2>
        <p style={{ opacity: 0.9 }}>A big thanks to contributors and supporters of this project.</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <figure style={{ margin: 0 }}>
            <img src={contributorShot} alt="Contributors" style={{ maxWidth: 320, borderRadius: 8, border: '1px solid var(--border)' }} />
            <figcaption style={{ textAlign: 'center', fontSize: 12, marginTop: 6, opacity: 0.8 }}>Contributors</figcaption>
          </figure>
          <figure style={{ margin: 0 }}>
            <img src={supporterShot} alt="Supporters" style={{ maxWidth: 320, borderRadius: 8, border: '1px solid var(--border)' }} />
            <figcaption style={{ textAlign: 'center', fontSize: 12, marginTop: 6, opacity: 0.8 }}>Supporters</figcaption>
          </figure>
        </div>
      </section>
      <Footer />
    </>
  );
}
