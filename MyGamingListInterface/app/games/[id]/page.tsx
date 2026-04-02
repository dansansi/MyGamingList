import { Game } from "@/types/game";
import Image from "next/image";
import GameActions from "./GameActions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  const response = await fetch(`http://localhost:5195/api/Game/${id}`);
  const game: Game = await response.json();

  return (
    <main>
      <div className="relative w-1/2 mx-auto h-[48vh] mt-4">
        {game.backgroundImage ? (
          <Image src={game.backgroundImage} alt={`Foto do jogo ${game.name}`} fill className="object-fill" />
        ) : (
          <Image src="/assets/gameNotFound1.jpg" alt="Placeholder de foto não encontrada" fill className="object-fill" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-5 flex items-end justify-between gap-4">
          <h1 className="text-3xl pt-4 font-semibold text-white">{game.name}</h1>
          <GameActions />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div
          className="text-xl text-zinc-400 leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: game.description ?? "" }}
        />
      </div>
    </main>
  );
}
