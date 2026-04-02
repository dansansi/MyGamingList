"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameStatus } from "@/types/userGame";

const STATUS_LABELS: Record<string, string> = {
  "": "Selecione",
  [GameStatus.Wishlist]: "Wishlist",
  [GameStatus.Playing]: "Playing",
  [GameStatus.Completed]: "Completed",
  [GameStatus.Paused]: "Paused",
  [GameStatus.Dropped]: "Dropped",
};

// Mock — depois vem do backend
const MOCK_IS_FAVORITE = false;
const MOCK_STATUS = "";

export default function GameActions() {
  const router = useRouter();
  const isLoggedIn = false; // depois vira useAuth() ou cookie check

  const [isFavorite, setIsFavorite] = useState(MOCK_IS_FAVORITE);
  const [currentStatus, setCurrentStatus] = useState<string>(MOCK_STATUS);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleFavoriteClick() {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    // TODO: chamar API de toggle favorite
    setIsFavorite((prev) => !prev);
  }

  function handleStatusChange(value: string) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (value === currentStatus) return;
    setPendingStatus(value);
    setShowModal(true);
  }

  function handleConfirmStatus() {
    if (pendingStatus === null) return;
    // TODO: chamar API de status
    setCurrentStatus(pendingStatus);
    setPendingStatus(null);
    setShowModal(false);
    showToast("Lista atualizada com sucesso!");
  }

  function handleCancelStatus() {
    setPendingStatus(null);
    setShowModal(false);
  }

  const pendingLabel = pendingStatus !== null ? (STATUS_LABELS[pendingStatus] ?? pendingStatus) : "";

  return (
    <>
      <div className="flex items-center gap-3 shrink-0">
        {/* Dropdown de status */}
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 cursor-pointer"
        >
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {/* Estrela de favorito */}
        <button
          onClick={handleFavoriteClick}
          className="text-2xl transition-transform hover:scale-110 focus:outline-none"
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          {isFavorite ? (
            <span className="text-yellow-400">★</span>
          ) : (
            <span className="text-zinc-500 hover:text-yellow-400 transition-colors">☆</span>
          )}
        </button>
      </div>

      {/* Modal de confirmação */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-2">Alterar status</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Deseja mover este jogo para <span className="text-white font-medium">{pendingLabel}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={handleCancelStatus} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Cancelar
              </button>
              <button
                onClick={handleConfirmStatus}
                className="px-4 py-2 text-sm bg-zinc-600 hover:bg-zinc-500 text-white rounded-md transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-700 border border-zinc-600 text-white text-sm px-5 py-3 rounded-lg shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </>
  );
}
