import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/game-state.service';
import { GameEngineService } from '../../core/game-engine.service'; // ✅
@Component({
  selector: 'app-prev-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prev-setup.component.html',
  styleUrls: ['./prev-setup.component.scss']
})
export class PrevSetupComponent {
  playersCount = 6;
  impostorsCount = 1;
  useNames = false;
  playerNames: string[] = [];
  categories: string[] = [];
  categorySelected = '';
  constructor(
    private router: Router,
    private gameState: GameStateService,
        private engine: GameEngineService // ✅
  ) {

    this.categories = this.engine.getCategories();
    this.categorySelected = this.categories[0] ?? '';
  }

  get maxImpostors(): number {
    return Math.max(1, Math.floor(this.playersCount / 4));
  }

  volver() {
    this.router.navigateByUrl('/');
  }

  toggleNames() {
    this.useNames = !this.useNames;
    this.useNames ? this.syncNames() : (this.playerNames = []);
  }

 syncNames() {
  const target = Number(this.playersCount) || 0;

  // si está vacío, inicializa
  if (!Array.isArray(this.playerNames)) this.playerNames = [];

  // agranda sin perder referencia
  while (this.playerNames.length < target) {
    this.playerNames.push('');
  }

  // recorta sin perder referencia
  while (this.playerNames.length > target) {
    this.playerNames.pop();
  }
}


   guardarYContinuar() {
    this.gameState.setSetup({
      playersCount: this.playersCount,
      impostorsCount: Math.min(this.impostorsCount, this.maxImpostors),
      category: this.categorySelected, // ✅
      playerNames: this.useNames ? this.playerNames.map(n => n.trim()) : []
    });

    this.router.navigateByUrl('/game');
  }
  trackByIndex(index: number) {
  return index;
}
}
