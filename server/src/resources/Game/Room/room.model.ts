import {Player} from '@/resources/Game/Player/player.model';

export interface Room {
  id: string;
  isPlayerOneTurn: boolean;
  players: Array<Player>;
  newRound: boolean;
  timer: NodeJS.Timeout | null;
  countDown: number;
}
