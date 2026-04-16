import { cookies } from "next/headers";
import HomeCarousel from "@/components/HomePage/HomeCarousel";
import HomeGrid from "@/components/HomePage/HomeGrid";

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

interface RandomGame {
  externalId: number;
  name: string;
  backgroundImage: string;
  releaseDate: string;
  rating: number;
  ratingsCount: number;
}

interface UserGame {
  externalId: number;
  status: number | null;
  isFavorite: boolean | null;
}

async function getUpcomingAndNewGames(): Promise<HomeGamesResponse> {
  const res = await fetch("http://localhost:5195/api/HomeGames", {
    next: { revalidate: 21600 },
  });
  if (!res.ok) throw new Error("Erro ao buscar jogos da home");
  return res.json();
}

async function getRandomGames(): Promise<RandomGame[]> {
  const res = await fetch("http://localhost:5195/api/HomeGames/random-games", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Erro ao buscar jogos aleatórios");
  return res.json();
}

async function getUserGames(token: string): Promise<UserGame[]> {
  const res = await fetch("http://localhost:5195/api/UserGame", {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isLoggedIn = !!token;

  const [carouselData, randomGames, userGames] = await Promise.all([
    getUpcomingAndNewGames(),
    getRandomGames(),
    isLoggedIn ? getUserGames(token!) : Promise.resolve([]),
  ]);

  return (
    <div className="min-h-screen bg-zinc-900 pt-20 px-4">
      <section className="max-w-2xl mx-auto text-center py-10">
        <h1 className="text-white text-3xl font-bold mb-3">MyGamingList</h1>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Organize sua jornada nos games. Acompanhe o que você já jogou, o que está jogando agora, e descubra novos títulos pra
          adicionar à sua lista.
        </p>
      </section>

      <HomeCarousel
        title="Upcoming"
        games={carouselData.upcoming}
        gradientClass="bg-gradient-to-r from-purple-900 to-zinc-900"
        storageKey="carousel-upcoming"
      />
      <HomeCarousel
        title="New Releases"
        games={carouselData.hotReleases}
        gradientClass="bg-gradient-to-r from-green-700 to-zinc-900"
        storageKey="carousel-releases"
      />

      <section className="mt-6">
        <h2 className="text-white font-bold text-lg px-4 mb-4">Descubra jogos</h2>
        <HomeGrid initialGames={randomGames} isLoggedIn={isLoggedIn} initialUserGames={userGames} />
      </section>
    </div>
  );
}
