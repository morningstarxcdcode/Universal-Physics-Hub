// src/pages/home.jsx
import { useState, useEffect } from 'react';
import Header from "../components/Header.jsx";
import BackgroundFX from "../components/BackgroundFX.jsx";
import Footer from "../components/Footer.jsx";
import Chapter from "../components/Chapter.jsx";
import Chapters from "../data/chapters.js";
import useReveal from "../hooks/useReveal.js";

export function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChapters = Chapters.filter((chap) => {
    const term = searchTerm.toLowerCase();

    const matchesName = chap.name.toLowerCase().includes(term);

    const matchesTags = chap.tags.some((tag) =>
      tag.name.toLowerCase().includes(term)
    );

    return matchesName || matchesTags;
  });

  return (
    <>
      <Header onSearch={setSearchTerm} />
  <BackgroundFX variant="particles" />
      <main className="cosmic-particles">
        {useReveal()}
        {filteredChapters.map((chap) => (
          <Chapter
            key={chap.id}
            id={chap.id}
            name={chap.name}
            desc={chap.desc}
            link={chap.link}
            tags={chap.tags}
          />
        ))}
      </main>
      <Footer />
    </>
  );
}
