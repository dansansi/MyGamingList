"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameStatus } from "@/types/userGame";

type CompletedState = "none" | "other" | "completed";

function resolveCompletedState(status: string): CompletedState {
  if (status === String(GameStatus.Completed)) return "completed";
  if (status !== "") return "other";
  return "none";
}

interface GameCardProps {
  externalId: number;
  name: string;
  backgroundImage: string;
  releaseDate?: string;
  showActions: boolean;
  isLoggedIn?: boolean;
  initialFavorite?: boolean;
  initialStatus?: string;
}

export default function GameCard({
  externalId,
  name,
  backgroundImage,
  releaseDate,
  showActions = false,
  isLoggedIn = false,
  initialFavorite = false,
  initialStatus = "",
}: GameCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [completedState, setCompletedState] = useState<CompletedState>(resolveCompletedState(initialStatus));
  const [toast, setToast] = useState<string | null>(null);

  const formattedDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Data desconhecida";

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function handleFavoriteClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push(`/login?redirect=/games/${externalId}`);
      return;
    }

    const getOrCreate = await fetch(`/api/game/ensure/${externalId}`);
    if (!getOrCreate.ok) {
      showToast("Erro ao buscar jogo");
      return;
    }
    const newFavorite = !isFavorite;
    const response = await fetch("/api/userGame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId,
        status: initialStatus ? Number(GameStatus.Completed) : null,
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

  async function handleCompletedClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push(`/login?redirect=/games/${externalId}`);
      return;
    }

    const getOrCreate = await fetch(`/api/game/ensure/${externalId}`);
    if (!getOrCreate.ok) {
      showToast("Erro ao buscar jogo");
      return;
    }

    const sendCompleted = completedState !== "completed";

    const response = await fetch("/api/userGame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        externalId,
        status: sendCompleted ? Number(GameStatus.Completed) : null,
        isFavorite,
      }),
    });
    if (!response.ok) showToast("Erro ao atualizar status");
    else {
      setCompletedState(sendCompleted ? "completed" : "none");
      showToast(sendCompleted ? "Marcado como concluído" : "Removido dos concluídos");
    }
  }

  return (
    <>
      <Link href={`/games/${externalId}`}>
        <div className="flex-shrink-0 w-78 rounded-lg overflow-hidden bg-zinc-800 hover:scale-105 transition-transform duration-200">
          <div className="relative w-full h-48">
            <Image
              alt={`Imagem do jogo ${name}`}
              src={backgroundImage || "/assets/gameNotFound1.jpg"}
              fill
              className="object-cover"
            />
            {showActions && (
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  onClick={handleCompletedClick}
                  className="text-lg leading-none p-1 rounded-md bg-zinc-900/70 hover:bg-zinc-900 transition-colors"
                  aria-label="Marcar como concluído"
                >
                  {completedState === "completed" && <span className="text-green-400">✔</span>}
                  {completedState === "other" && <span className="text-yellow-400">✔</span>}
                  {completedState === "none" && <span className="text-zinc-500 hover:text-green-400 transition-colors">✔</span>}
                </button>
                <button
                  onClick={handleFavoriteClick}
                  className="text-lg leading-none p-1 rounded-md bg-zinc-900/70 hover:bg-zinc-900 transition-colors"
                  aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                >
                  {isFavorite ? (
                    <span className="text-yellow-400">★</span>
                  ) : (
                    <span className="text-zinc-500 hover:text-yellow-400 transition-colors">☆</span>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="p-2">
            <p className="text-white text-xs font-medium truncate">{name}</p>
            <p className="text-zinc-400 text-xs mt-1">{formattedDate}</p>
          </div>
        </div>
      </Link>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-700 border-zinc-600 text-white text-sm px-5 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
