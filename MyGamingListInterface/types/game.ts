export interface Game {
  id: number;
  externalId: number;
  name: string;
  description?: string;
  slug: string;
  backgroundImage?: string;
  releaseDate?: string;
  tba: boolean;
  rating?: number;
  createdAt: string;
}
