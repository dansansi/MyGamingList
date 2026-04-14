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
        <div className="flex justify-between items-center">
          <span className="text-zinc-400">All games</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{totalGames}</span>
            <div className="relative group">
              <span className="text-zinc-500 border border-dashed border-zinc-500 rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-default">
                ?
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-700 text-zinc-200 text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                All added games, having status or not, favorited or not.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Games on the list</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{totalStatusGames}</span>
            <div className="relative group">
              <span className="text-zinc-500 border border-dashed border-zinc-500 rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-default">
                ?
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-700 text-zinc-200 text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Games with some status defined, regardless of favorite.
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-zinc-400">Favorites</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{totalFavorites}</span>
            <div className="relative group">
              <span className="text-zinc-500 border border-dashed border-zinc-500 rounded-full w-4 h-4 flex items-center justify-center text-xs cursor-default">
                ?
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-700 text-zinc-200 text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Favorited games, regardless of status.
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
