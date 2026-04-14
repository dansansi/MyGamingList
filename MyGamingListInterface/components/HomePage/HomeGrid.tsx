"use client";

import { useState } from "react";
import GameCard from "@/components/HomePage/GameCard";
import { RefreshCw } from "lucide-react";

interface Game {
  externalId: number;
  name: string;
  backgroundImage: string;
  releaseDate: string;
  rating: number;
  ratingsCount: number;
}

interface HomeGridProps {
  initialGames: Game[];
  isLoggedIn: boolean;
}

export default function HomeGrid({ initialGames, isLoggedIn }: HomeGridProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [loading, setLoading] = useState(false);

  async function fetchRandomGames() {
    setLoading(true);
    try {
      const res = await fetch("/api/random-games", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setGames(data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4 py-6">
        {games.map((game) => (
          <GameCard
            key={game.externalId}
            externalId={game.externalId}
            name={game.name}
            backgroundImage= {game.backgroundImage}
            releaseDate={game.releaseDate}
            showActions={true}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>

      <button
        onClick={fetchRandomGames}
        disabled={loading}
        className="fixed bottom-6 right-6 z-50 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="Buscar novos jogos"
      >
        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
