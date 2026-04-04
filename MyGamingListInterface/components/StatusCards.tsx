interface Game {
  status: number | null;
  isFavorite: boolean;
}

interface StatusCard {
  label: string;
  count: number;
  href: string;
}

interface Props {
  games: Game[];
}

const StatusList = [
  { value: 0, label: "Wishlist" },
  { value: 1, label: "Playing" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Paused" },
  { value: 4, label: "Dropped" },
];

export default function StatusCards({ games }: Props) {
  const cards: StatusCard[] = StatusList.map((status) => ({
    label: status.label,
    count: games.filter((g) => g.status === status.value).length,
    href: `/list?sort=${status.label.toLowerCase()}`,
  }));

  const favoritesCard: StatusCard = {
    label: "Favorites",
    count: games.filter((g) => g.isFavorite).length,
    href: "/list?sort=favorites",
  };

  const allCards = [...cards, favoritesCard];

  return (
    <div className="grid grid-cols-3 gap-4">
      {allCards.map((card) => (
        <a
          key={card.label}
          href={card.href}
          className="bg-zinc-800 rounded-lg p-6 flex flex-col gap-2 hover:bg-zinc-700 transition-colors"
        >
          <span className="text-zinc-400 text-sm">{card.label}</span>
          <span className="text-white text-3xl font-bold">{card.count}</span>
        </a>
      ))}
    </div>
  );
}
