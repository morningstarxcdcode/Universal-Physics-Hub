# Universal Physics Hub

Interactive physics simulations with clear, exam‑ready theory.

![Universal Physics Hub banner](public/Thumbnail.png)

![Contributors](https://img.shields.io/github/contributors/morningstarxcdcode/Universal-Physics-Hub?style=plastic)
![Forks](https://img.shields.io/github/forks/morningstarxcdcode/Universal-Physics-Hub)
![Stars](https://img.shields.io/github/stars/morningstarxcdcode/Universal-Physics-Hub)
![Repository Size](https://img.shields.io/github/repo-size/morningstarxcdcode/Universal-Physics-Hub)
[![Deploy to GitHub Pages](https://github.com/morningstarxcdcode/Universal-Physics-Hub/actions/workflows/gh-pages.yml/badge.svg?branch=main)](https://github.com/morningstarxcdcode/Universal-Physics-Hub/actions/workflows/gh-pages.yml)
[![Website status](https://img.shields.io/website?url=https%3A%2F%2Fmorningstarxcdcode.github.io%2FUniversal-Physics-Hub%2F&label=website&up_message=online&down_message=offline)](https://morningstarxcdcode.github.io/Universal-Physics-Hub/)
![Vite](https://img.shields.io/badge/build-Vite-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)

## About

Universal Physics Hub is a curated set of interactive physics simulations built with React + p5.js. Each chapter pairs a lightweight canvas experiment with concise theory blocks: formulas, notes, examples, and quick labs. It aims to make concepts feel tangible without sacrificing correctness, suitable for school learners and curious adults alike.

Highlights

- 30+ simulations across mechanics, rotation, waves, optics, electricity & magnetism, and thermal physics
- Clean UI with consistent controls and responsive layout
- Theory that maps to popular syllabi (CBSE/ISC/IGCSE style)
- Data‑driven content; easy to add new chapters (`src/data/chapters.js`)

## Link

Clone the project locally or try the web app on the original site: <https://morningstarxcdcode.github.io/Universal-Physics-Hub/>

## Steps to run it locally

1. Clone the repository to your computer

   ```bash
   git clone https://github.com/morningstarxcdcode/Universal-Physics-Hub.git
   ```

2. Navigate to the app directory

   ```bash
   cd Universal-Physics-Hub
   ```

3. Install the necessary dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the local development server

   ```bash
   npm run dev
   ```

5. Open your browser to <http://localhost:5174/>

---

**6. Temporary Sharing (while running locally):**

If you don’t want to deploy yet, you can easily tunnel your localhost so others can access your running app:

- Install ngrok (free):

    ```bash
    brew install ngrok/ngrok/ngrok
    ```

- Start ngrok to tunnel your dev server (default Vite port is 5174):

    ```bash
    ngrok http 5174
    ```

- ngrok will provide you with a link like:

    ```text
    https://randomstring.ngrok.io
    ```

- Share this link with others; they can open your local server temporarily in their browsers.



---

### Contributors

| Contributor | Preview |
| --- | --- |
| [@morningstarxcdcode](https://github.com/morningstarxcdcode) | ![Contributors screenshot](./screenshots/Contributors/Screenshot%202025-08-18%20at%2010.59.50%E2%80%AFAM.png) |


### Supporters

| Supporter | Preview |
| --- | --- |
| [Robotics](https://github.com/MStarRobotics) | ![Supporters screenshot](./screenshots/Supporters/Screenshot%202025-08-18%20at%2010.53.26%E2%80%AFAM.png) |

<!-- Community/Discord section removed as requested -->

### Syllabus mapping (quick index)

- Class 10: Light (Reflection & Refraction), Human Eye & Colourful World, Electricity, Magnetic Effects of Current, Sources of Energy
- Class 11: Units & Measurements; Motion in a Straight Line/Plane; Laws of Motion; Work–Energy–Power; System of Particles & Rotation; Gravitation; Properties of Bulk Matter; Thermodynamics; Kinetic Theory; Oscillations; Waves
- Class 12: Electrostatics; Current Electricity; Magnetic Effects of Current & Magnetism; Electromagnetic Induction & AC; Electromagnetic Waves; Optics (Ray/Wave); Dual Nature; Atoms & Nuclei; Electronic Devices

See `src/data/chapters.js` for implemented topics and open an issue for the rest.

### Performance

Route‑level code splitting (React.lazy + Suspense) reduces initial bundle size. Rollup may still warn about large chunks depending on what’s preloaded—informational only. Further tuning can split rarely used utilities into separate chunks.


### License

![License](https://img.shields.io/github/license/morningstarxcdcode/Universal-Physics-Hub)
