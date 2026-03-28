"use client";

import { useRef, useState } from "react";
import CarouselCard from "@/components/CarouselCard";

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
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? saved === "true" : true;
  });

  const scrollref = useRef<HTMLDivElement>(null);

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    if (scrollref.current) {
      scrollref.current.scrollLeft += e.deltaY;
    }
  }

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
          onWheel={handleWheel}
          className="flex gap-6 overflow-x-auto px-4 py-3 bg-zinc-800/50 rounded-b-lg scrollbar-hide opacity-100"
        >
          {games.map((game) => (
            <CarouselCard
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
