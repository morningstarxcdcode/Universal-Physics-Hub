// src/pages/pyq.jsx
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BackgroundFX from "../components/BackgroundFX.jsx";
import Chapters from "../data/chapters.js";
import PYQ_BANK from "../data/pyq.js";
import { useMemo, useState } from "react";
import useReveal from "../hooks/useReveal.js";

export function PYQ() {
  const [chapterId, setChapterId] = useState(() => {
    // default to first chapter that has PYQs
    const ids = Object.keys(PYQ_BANK).map(Number);
    return ids.length ? ids[0] : 0;
  });
  const [term, setTerm] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [type, setType] = useState("All");
  const [hideAnswers, setHideAnswers] = useState(false);

  const chapterOptions = useMemo(() => (
    Chapters.filter(c => !!PYQ_BANK[c.id])
      .map(c => ({ id: c.id, name: `${c.id}. ${c.name}` }))
  ), []);

  const items = useMemo(() => {
    const entry = PYQ_BANK[chapterId];
    if (!entry) return [];
    return entry.questions.filter(q => {
      if (term && !q.q.toLowerCase().includes(term.toLowerCase())) return false;
      if (difficulty !== 'All' && q.difficulty !== difficulty) return false;
      if (type !== 'All' && q.type !== type) return false;
      return true;
    });
  }, [chapterId, term, difficulty, type]);

  const types = useMemo(() => {
    const entry = PYQ_BANK[chapterId];
    if (!entry) return [];
    const set = new Set(entry.questions.map(q => q.type));
    return ["All", ...Array.from(set)];
  }, [chapterId]);

  const levels = ["All", "Easy", "Medium", "Hard"];

  const grouped = useMemo(() => {
    const groups = {};
    for (const q of items) {
      const key = q.type || "General";
      if (!groups[key]) groups[key] = [];
      groups[key].push(q);
    }
    // stable order: Numerical, Short, Long, Open, others
    const order = ["Numerical", "Short", "Long", "Open"];
    const keys = Object.keys(groups).sort((a,b)=>{
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return keys.map(k => ({ type: k, items: groups[k] }));
  }, [items]);

  return (
    <>
      <Header onSearch={() => {}} />
      <BackgroundFX variant="particles" />
      <main className="pyq-page cosmic-particles">
        {useReveal()}
        <div className="pyq-hero">
          <h1 className="crazy-bounce neon-brag magnetic-text">PYQ — Practice Questions</h1>
          <p>Chapter-wise, exam-style practice (original questions). Answers are visible by default.</p>
        </div>

        <div className="pyq-layout">
          <aside className="pyq-aside">
            <div className="pyq-aside-head">Chapters</div>
            <ul>
              {chapterOptions.map(opt => (
                <li key={opt.id} className={opt.id === chapterId ? 'active' : ''}>
                  <button onClick={() => setChapterId(opt.id)} title={opt.name}>
                    <span className="id">{opt.id}</span>
                    <span className="name">{opt.name.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="pyq-content">
            <div className="pyq-controls ripple-effect">
              <label>
                <span>Chapter</span>
                <select value={chapterId} onChange={e => setChapterId(Number(e.target.value))}>
                  {chapterOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Search</span>
                <input value={term} onChange={e => setTerm(e.target.value)} placeholder="topic/keyword" />
              </label>
              <label>
                <span>Difficulty</span>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                  {levels.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>
              <label>
                <span>Type</span>
                <select value={type} onChange={e => setType(e.target.value)}>
                  {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label className="toggle">
                <input type="checkbox" checked={hideAnswers} onChange={e => setHideAnswers(e.target.checked)} />
                <span>Hide answers</span>
              </label>
            </div>

            {items.length === 0 && (
              <div className="pyq-empty">No questions found for the selected filters.</div>
            )}

            {grouped.map(group => (
              <section key={group.type} className="pyq-group">
                <h2>{group.type}</h2>
                <ul className="pyq-list">
                  {group.items.map((q, idx) => {
                    const key = `${group.type}-${q.topic || 'General'}-${q.q.slice(0, 36)}-${idx}`;
                    return (
                      <li key={key} className="pyq-card">
                        <div className="meta">
                          <span className="badge topic">{q.topic || 'General'}</span>
                          <span className={`badge diff ${q.difficulty?.toLowerCase() || 'easy'}`}>{q.difficulty}</span>
                        </div>
                        <div className="qtext">{q.q}</div>
                        {q.answer && (
                          <div className={`answer ${hideAnswers ? 'hidden' : ''}`}>{q.answer}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PYQ;
