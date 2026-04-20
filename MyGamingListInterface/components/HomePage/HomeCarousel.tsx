"use client";

import { useEffect, useRef, useState } from "react";
import GameCard from "@/components/HomePage/GameCard";

interface Game {
  name: string;
  backgroundImage: string;
  releaseDate: string;
  externalId: number;
}

interface HomeCarouselProps {
  title: string;
  games: Game[];
  gradientClass: string;
  storageKey: string;
}

export default function HomeCarousel({ title, games, gradientClass, storageKey }: HomeCarouselProps) {
  const [isVisible, setIsVisible] = useState(true);
  const storageKeyRef = useRef(storageKey);
  const scrollref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKeyRef.current);
    if (saved !== null) {
      setIsVisible(saved === "true");
    }
  }, []);

  useEffect(() => {
    const el = scrollref.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  function toggleVisibility() {
    const next = !isVisible;
    setIsVisible(next);
    localStorage.setItem(storageKey, String(next));
  }

  return (
    <div className="mb-6">
      <div className={`flex items-center justify-between px-4 py-2 rounded-t-lg ${gradientClass}`}>
        <h2 className="text-white font-bold text-lg">{title}</h2>
        <button onClick={toggleVisibility} className="text-white/60 hover:text-white text-xs transition-colors duration-200">
          {isVisible ? "▲ Recolher" : "▼ Expandir"}
        </button>
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isVisible ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          ref={scrollref}
          className="flex gap-6 overflow-x-auto px-4 py-3 bg-zinc-800/50 rounded-b-lg scrollbar-hide opacity-100"
        >
          {games.map((game) => (
            <GameCard
              key={game.externalId}
              {...game} //spreading
              //   externalId={game.externalId}
              //   name={game.name}
              //   releaseDate={game.releaseDate}
              //   backgroundImage={game.backgroundImage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
