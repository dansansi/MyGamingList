import { Game } from "@/types/game";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GamePage({ params }: Props) {
  const { id } = await params;
  const response = await fetch(`http://localhost:5195/api/Game/${id}`);
  const game: Game = await response.json();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">{game.name}</h1>
      <div
        className="text-zinc-400 mt-12"
        dangerouslySetInnerHTML={{ __html: game.description ?? "" }}
      />
    </main>
  );
}
