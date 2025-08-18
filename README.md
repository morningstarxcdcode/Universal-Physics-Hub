<div align="center">
   <img src="./public/Thumbnail.png" width="60%" alt="Universal Physics Hub" />
   <h1>Universal Physics Hub</h1>
   <h3><em>Interactive physics simulations with clear, exam‑ready theory.</em></h3>
   <p>
      <img src="https://img.shields.io/github/contributors/morningstarxcdcode/Universal-Physics-Hub?style=plastic" alt="Contributors">
      <img src="https://img.shields.io/github/forks/morningstarxcdcode/Universal-Physics-Hub" alt="Forks">
      <img src="https://img.shields.io/github/stars/morningstarxcdcode/Universal-Physics-Hub" alt="Stars">
      <img src="https://img.shields.io/github/repo-size/morningstarxcdcode/Universal-Physics-Hub" alt="Repository Size">
   </p>
</div>

## About

Universal Physics Hub is a curated set of interactive physics simulations built with React + p5.js. Each chapter pairs a lightweight canvas experiment with concise theory blocks: formulas, notes, examples, and quick labs. It aims to make concepts feel tangible without sacrificing correctness, suitable for school learners and curious adults alike.

Highlights
- 30+ simulations across mechanics, rotation, waves, optics, electricity & magnetism, and thermal physics
- Clean UI with consistent controls and responsive layout
- Theory that maps to popular syllabi (CBSE/ISC/IGCSE style)
- Data‑driven content; easy to add new chapters (`src/data/chapters.js`)

## Link

Clone the project locally or try the web app on the original site: https://morningstarxcdcode.github.io/Universal-Physics-Hub/

## Steps to run it locally

1. Clone the repository to your computer <br>
   ``` bash
   git clone https://github.com/morningstarxcdcode/Universal-Physics-Hub.git
2. Navigate to the app directory <br>
   ``` bash
   cd Universal-Physics-Hub
3. Install the necessary dependencies <br>
   ```bash
    npm install
    # or
    yarn install
    ```
4. Start the local development server <br>
   ```bash
   npm run dev
5. Open your browser to  http://localhost:5174/

---

**6. Temporary Sharing (while running locally):**

If you don’t want to deploy yet, you can easily tunnel your localhost so others can access your running app:

- **Install ngrok (free):**
  ```bash
  brew install ngrok/ngrok/ngrok
  ```
- **Start ngrok to tunnel your dev server (default Vite port is 5174):**
  ```bash
  ngrok http 5174
  ```
- ngrok will provide you with a link like:
  ```
  https://randomstring.ngrok.io
  ```
- Share this link with others; they can open your local server temporarily in their browsers.



<br>
<hr>

### Contributors

<table>
   <tr>
       <td align="center">
         <img src="./screenshots/Contributors/Screenshot 2025-08-18 at 10.59.50 AM.png" width="160" alt="Contributors screenshot" />
         <br />
         <a href="https://github.com/morningstarxcdcode">morningstarxcdcode</a>
      </td>
   </tr>
</table>


### Supporters

<table>
   <tr>
      <td align="center">
         <img src="./screenshots/Supporters/Screenshot 2025-08-18 at 10.53.26 AM.png" width="200" alt="Supporters screenshot" />
         <br />
         <a href="https://github.com/MStarRobotics">Robotics</a>
      </td>
   </tr>
</table>

<!-- Community/Discord section removed as requested -->

### Syllabus mapping (quick index)

- Class 10: Light (Reflection & Refraction), Human Eye & Colourful World, Electricity, Magnetic Effects of Current, Sources of Energy
- Class 11: Units & Measurements; Motion in a Straight Line/Plane; Laws of Motion; Work–Energy–Power; System of Particles & Rotation; Gravitation; Properties of Bulk Matter; Thermodynamics; Kinetic Theory; Oscillations; Waves
- Class 12: Electrostatics; Current Electricity; Magnetic Effects of Current & Magnetism; Electromagnetic Induction & AC; Electromagnetic Waves; Optics (Ray/Wave); Dual Nature; Atoms & Nuclei; Electronic Devices

See `src/data/chapters.js` for implemented topics and open an issue for the rest.

### Performance

Route‑level code splitting (React.lazy + Suspense) reduces initial bundle size. Rollup may still warn about large chunks depending on what’s preloaded—informational only. Further tuning can split rarely used utilities into separate chunks.


### License

<img src="https://img.shields.io/github/license/morningstarxcdcode/Universal-Physics-Hub" alt="Licence">
