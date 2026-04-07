interface User {
  username: string;
  email: string;
}

interface Game {
  status: string | null;
  isFavorite: boolean;
}

interface Props {
  user: User;
  games: Game[];
}

export default function ProfileSidebar({ user, games }: Props) {
  const totalGames = games.length;
  const totalStatusGames = games.filter((g) => g.status !== null).length;
  const totalFavorites = games.filter((g) => g.isFavorite).length;

  return (
    <aside className="w-64 min-h-[calc(100vh-64px)] bg-[#1f1f22] p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-white">{user.username}</h2>
        <p className="text-sm text-zinc-400">{user.email}</p>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-zinc-400">Todos os jogos</span>
          <span className="text-white font-medium">{totalGames}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Jogos na lista</span>
          <span className="text-white font-medium">{totalStatusGames}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-400">Favoritos</span>
          <span className="text-white font-medium">{totalFavorites}</span>
        </div>
      </div>
    </aside>
  );
}
