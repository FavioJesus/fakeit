import { Injectable } from '@angular/core';

export type GameSetup = {
  playersCount: number;
  impostorsCount: number;
  playerNames: string[]; // opcional, puede ir vacío
   category?: string;
};

@Injectable({ providedIn: 'root' })
export class GameStateService {
  private setup: GameSetup = {
    playersCount: 6,
    impostorsCount: 1,
    playerNames: []
  };

  getSetup(): GameSetup {
    return structuredClone(this.setup);
  }

  setSetup(next: GameSetup): void {
    this.setup = structuredClone(next);
  }

  reset(): void {
    this.setup = { playersCount: 6, impostorsCount: 1, playerNames: [] };
  }
}

