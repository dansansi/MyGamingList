"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameStatus } from "@/types/userGame";

interface UserGame {
  externalId: number;
  gameName: string;
  status: number | null;
  isFavorite: boolean;
  backgroundImage: string | null;
}

interface Props {
  game: UserGame;
  onRemove: (externalId: number, gameName: string) => void;
}

const Status_List: Record<string, string> = {
  "": "Selecione",
  [GameStatus.Wishlist]: "Wishlist",
  [GameStatus.Playing]: "Playing",
  [GameStatus.Completed]: "Completed",
  [GameStatus.Paused]: "Paused",
  [GameStatus.Dropped]: "Dropped",
};

export default function GameListCard({ game, onRemove }: Props) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(game.isFavorite);
  const [currentStatus, setCurrentStatus] = useState<string>(game.status !== null ? String(game.status) : "");
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFavoriteClick() {
    const newFavorite = !isFavorite;
    const response = await fetch("/api/userGame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: game.externalId,
        status: currentStatus === "" ? null : Number(currentStatus),
        isFavorite: newFavorite,
      }),
    });

    if (!response.ok) {
      showToast("Erro ao atualizar favorito");
    } else {
      setIsFavorite(newFavorite);
      showToast(newFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos");
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (newStatus === currentStatus) return;

    const response = await fetch("/api/userGame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId: game.externalId,
        status: newStatus === "" ? null : Number(newStatus),
        isFavorite: isFavorite,
      }),
    });

    if (!response.ok) {
      showToast("Erro ao atualizar status");
    } else {
      setCurrentStatus(newStatus);
      showToast("Status atualizado");
    }
  }

  async function handleRemove() {
    const response = await fetch(`/api/userGame/${game.externalId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      showToast("Erro ao remover jogo");
    } else {
      onRemove(game.externalId, game.gameName);
    }
  }

  return (
    <div
      className="relative w-[900px] h-[170px] rounded-lg overflow-hidden cursor-pointer shrink-0"
      onClick={() => router.push(`/games/${game.externalId}`)}
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: game.backgroundImage ? `url(${game.backgroundImage})` : undefined,
          backgroundColor: game.backgroundImage ? undefined : "#27272a",
        }}
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Conteudo */}
      <div className="relative z-10 flex items-center justify-between h-full px-6">
        <span className="text-white font-semibold text-lg cursor-pointer hover:underline">{game.gameName}</span>

        <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 cursor-pointer"
          >
            {Object.entries(Status_List).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={handleFavoriteClick}
            className="text-3xl transition-transform hover:scale-110 focus:outline-none"
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFavorite ? (
              <span className="text-yellow-400">★</span>
            ) : (
              <span className="text-zinc-500 hover:text-yellow-400 transition-colors">☆</span>
            )}
          </button>

          <button
            onClick={handleRemove}
            className="text-zinc-500 hover:text-red-400 transition-colors text-xl focus:outline-none"
            aria-label="Remover da lista"
          >
            🗑️
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-700 border border-zinc-600 text-white text-sm px-5 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
