import { Game } from "./game";

export interface UserGame {
  userId: string;
  gameId: number;
  game: Game;
  status: GameStatus;
  createdAt: string;
  isFavorite: boolean;
}

export enum GameStatus {
  "Wishlist" = 0,
  "Playing" = 1,
  "Completed" = 2,
  "Paused" = 3,
  "Dropped" = 4,
}
