"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameStatus } from "@/types/userGame";

const Status_Labels: Record<string, string> = {
  "": "Selecione",
  [GameStatus.Wishlist]: "Wishlist",
  [GameStatus.Playing]: "Playing",
  [GameStatus.Completed]: "Completed",
  [GameStatus.Paused]: "Paused",
  [GameStatus.Dropped]: "Dropped",
};

interface GameActionProps {
  isLoggedIn: boolean;
  initialFavorite: boolean;
  initialStatus: string;
  gameId: number;
}

export default function GameActions({ isLoggedIn, initialFavorite, initialStatus, gameId }: GameActionProps) {
  const router = useRouter();

  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [currentStatus, setCurrentStatus] = useState<string>(initialStatus);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFavoriteClick() {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/games/${gameId}`);
      return;
    }
    const newFavorite = !isFavorite;
    const response = await fetch(`/api/userGame/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        externalId: gameId,
        status: currentStatus === "" ? null : Number(currentStatus),
        isFavorite: newFavorite,
      }),
    });

    if (!response.ok) {
      showToast("Erro ao atualizar favorito");
    } else {
      if (newFavorite == true) showToast("Adicionado a lista de favoritos");
      else {
        showToast("Removido da lista de favoritos");
      }
      setIsFavorite(newFavorite);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/games/${gameId}`);
      return;
    }
    if (newStatus === currentStatus) return;

    const response = await fetch(`/api/userGame/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        externalId: gameId,
        status: newStatus === "" ? null : Number(newStatus),
        isFavorite: isFavorite,
      }),
    });

    if (!response.ok) {
      showToast("Erro ao atualizar status do jogo");
    } else {
      setCurrentStatus(newStatus);
      showToast("Status de jogo atualizado.");
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 shrink-0">
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 cursor-pointer"
        >
          {Object.entries(Status_Labels).map(([value, label]) => (
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
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-700 border border-zinc-600 text-white text-sm px-5 py-3 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
