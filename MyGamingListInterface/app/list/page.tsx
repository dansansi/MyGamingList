"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GameStatus } from "@/types/userGame";
import GameListCard from "@/components/GameListCard";

interface UserGame {
  externalId: number;
  gameName: string;
  status: number | null;
  isFavorite: boolean;
  createdAt: string;
  backgroundImage: string | null;
}

export default function ListPage() {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");

  const [games, setGames] = useState<UserGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      const res = await fetch("api/userGame");
      if (res.ok) return;
      const data: UserGame[] = await res.json();
      setGames(data);
      setLoading(false);
    }
    fetchGames();
  }, []);

  function filterAndSort(games: UserGame[]): UserGame[] {
    let filtered = [...games];

    if (sort === "favorites") {
      filtered = filtered.filter((g) => g.isFavorite);
    } else if (sort) {
      const statusKey = sort.charAt(0).toUpperCase() + sort.slice(1);
      const statusValue = GameStatus[statusKey as keyof typeof GameStatus];
      if (statusValue !== undefined) {
        filtered = filtered.filter((g) => g.status === statusValue);
      }
    }

    return filtered.sort((a, b) => a.gameName.localeCompare(b.gameName));
  }

  function handleRemove(externalId: number) {
    setGames((prev) => prev.filter((g) => g.externalId !== externalId));
  }

  const filteredGames = filterAndSort(games);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-zinc-900">
        <p className="text-zinc-400">Carregando lista...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc-(100vh-64px)] bg-zinc-900 py-8">
      <div className="flex flex-col items-center gap-3">
        {filteredGames.length === 0 ? (
          <p className="text-zinc-400 mt-16">Nenhum jogo encontrado</p>
        ) : (
          filteredGames.map((game) => <GameListCard key={game.externalId} game={game} onRemove={handleRemove} />)
        )}
      </div>
    </div>
  );
}
