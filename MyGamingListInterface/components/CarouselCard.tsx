import Image from "next/image";
import Link from "next/link";

interface CarouselCardProps {
  name: string;
  releaseDate: string;
  backgroundImage: string;
  externalId: number;
}

export default function CarouselCard({ name, releaseDate, backgroundImage, externalId }: CarouselCardProps) {
  const formatDate = releaseDate
    ? new Date(releaseDate).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Data desconhecida";

  return (
    <Link href={`/games/${externalId}`}>
      <div className="flex-shrink-0 w-62 rounded-lg overflow-hidden bg-zinc-800 hover:scale-105 transition-transform duration-200">
        <div className="relative w-full h-36">
          <Image src={backgroundImage || "/assets/gameNotFound1.jpg"} alt={`Foto do jogo + ${name}`} fill />
        </div>
        <div className="p-2">
          <p className="text-white text-xs font-medium truncate">{name}</p>
          <p className="text-zinc-400 text-xs mt-1">{formatDate}</p>
        </div>
      </div>
    </Link>
  );
}
