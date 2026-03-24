import HomeCarousel from "@/components/HomeCarousel";

interface Game {
  externalId: number;
  name: string;
  releaseDate: string;
  backgroundImage: string;
}

interface HomeGamesResponse {
  upcoming: Game[];
  hotReleases: Game[];
}

async function getUpcomingAndNewGames(): Promise<HomeGamesResponse> {
  const res = await fetch("http://localhost:5195/api/HomeGames", {
    next: { revalidate: 20 },
  });
  if (!res.ok) throw new Error("Erro ao buscar jogos da home");
  return res.json();
}

export default async function Home() {
  const data = await getUpcomingAndNewGames();

  return (
    <div className="min-h-screen bg-zinc-900 pt-20 px-4">
      <HomeCarousel
        title="Upcoming"
        games={data.upcoming}
        gradientClass="bg-gradient-to-r from-purple-900 to-zinc-900"
        storageKey="carousel-upcoming"
      />
      <HomeCarousel
        title="New Releases"
        games={data.hotReleases}
        gradientClass="bg-gradient-to-r from-green-700 to-zinc-900"
        storageKey="carousel-releases"
      />
    </div>
  );
}
