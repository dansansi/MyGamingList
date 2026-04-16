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

interface UserGame {
  externalId: number;
  status: number | null;
  isFavorite: boolean | null;
}

interface HomeGridProps {
  initialGames: Game[];
  isLoggedIn: boolean;
  initialUserGames: UserGame[];
}

export default function HomeGrid({ initialGames, isLoggedIn, initialUserGames }: HomeGridProps) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [userGames, setUserGames] = useState<UserGame[]>(initialUserGames);
  const [loading, setLoading] = useState(false);

  async function fetchRandomGames() {
    setLoading(true);
    try {
      const [gamesRes, userGamesRes] = await Promise.all([
        fetch("/api/random-games", { cache: "no-store" }),
        isLoggedIn ? fetch("/api/userGame", { cache: "no-store" }) : Promise.resolve(null),
      ]);

      if (gamesRes.ok) setGames(await gamesRes.json());
      if (userGamesRes?.ok) setUserGames(await userGamesRes.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 px-4 py-6 justify-items-center">
        {games.map((game) => {
          const userGame = userGames.find((ug) => ug.externalId === game.externalId);
          return (
            <GameCard
              key={game.externalId}
              externalId={game.externalId}
              name={game.name}
              backgroundImage={game.backgroundImage}
              releaseDate={game.releaseDate}
              showActions={true}
              isLoggedIn={isLoggedIn}
              initialFavorite={userGame?.isFavorite ?? false}
              initialStatus={userGame?.status ?? null}
            />
          );
        })}
      </div>

      <button
        onClick={fetchRandomGames}
        disabled={loading}
        className="fixed bottom-12 right-2 z-50 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-white p-4 rounded-full shadow-lg transition-colors"
        aria-label="Buscar novos jogos"
      >
        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
      </button>
    </div>
  );
}
