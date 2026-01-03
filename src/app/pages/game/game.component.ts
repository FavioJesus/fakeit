import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService, GameSetup } from '../../core/game-state.service';
import { GameEngineService } from '../../core/game-engine.service';

type Screen = 'roundStart' | 'playerReveal' | 'roundReady' | 'clock';

type Assignment = {
  label: string;
  roleText: string;
  isImpostor: boolean;
};

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  setup!: GameSetup;

  round = 1;
  assignments: Assignment[] = [];
  screen: Screen = 'roundStart';
  playerIndex = 0;
speakerStartIndex = 0;
  // ===== Reveal tipo cortina (sin leaks) =====
  revealProgress = 0;     // 0..1
  isRevealing = false;    // el secreto solo existe si true
  canConfirm = false;     // habilita "YA VI"
  private startY: number | null = null;
  private readonly revealPx = 170; // px para llegar a 100%

  constructor(
    private router: Router,
    private state: GameStateService,
    private engine: GameEngineService
  ) {
    this.setup = this.state.getSetup();

    // si no hay setup válido, vuelve al home
    if (!this.setup?.playersCount || this.setup.playersCount < 3) {
      this.router.navigateByUrl('/');
      return;
    }

    this.startNewRound();
  }

  // ===== Navegación / reset =====
  finalizarJuego() {
    this.engine.resetAll();
    this.state.reset();
    this.router.navigateByUrl('/');
  }

  // ===== Rondas =====
  startNewRound() {
    const r = this.engine.createRound(this.setup);
    this.round = r.round;
    this.assignments = r.assignments;
 // ✅ el que empieza a hablar se define por ronda (random)
  this.speakerStartIndex = Math.floor(Math.random() * this.assignments.length);
    this.screen = 'roundStart';
    this.playerIndex = 0;
    this.resetReveal();
  }
get speakerStartLabel(): string {
  return this.assignments?.[this.speakerStartIndex]?.label ?? 'Jugador 1';
}
  irARevelarJugadores() {
    this.screen = 'playerReveal';
    this.playerIndex = 0;
    this.resetReveal();
  }

  iniciarRonda() {
    this.screen = 'clock';
  }

  siguienteRonda() {
    this.startNewRound();
  }

  // ===== Reveal =====
  get current(): Assignment {
    return this.assignments[this.playerIndex];
  }

  get curtainTranslateY(): number {
    // 100% = tapado; 0% = revelado
    return 100 - this.revealProgress * 100;
  }

  onTouchStart(ev: TouchEvent) {
    this.startY = ev.touches?.[0]?.clientY ?? null;

    // desde que toca, permitimos renderizar el secreto (pero tapado por cortina)
    this.isRevealing = true;
    this.revealProgress = 0;
    this.canConfirm = false;
  }

  onTouchMove(ev: TouchEvent) {
      ev.preventDefault();
    if (this.startY == null) return;

    const y = ev.touches?.[0]?.clientY ?? this.startY;
    const delta = this.startY - y; // arriba = positivo

    const p = Math.max(0, Math.min(1, delta / this.revealPx));
    this.revealProgress = p;

    // habilita "YA VI" cuando llegó suficiente
    this.canConfirm = p >= 0.75;
  }

  onTouchEnd() {
    // al soltar: se vuelve a cubrir SIEMPRE
    this.autoHide();
  }

  private autoHide() {
    const start = this.revealProgress;
    const duration = 160;
    const t0 = performance.now();

    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      this.revealProgress = start * (1 - k);

      if (k < 1) requestAnimationFrame(step);
      else {
        this.revealProgress = 0;
        this.isRevealing = false; // el secreto deja de existir en DOM
        this.startY = null;
      }
    };

    requestAnimationFrame(step);
  }

  get selectedCategory(): string {
  return this.setup?.category || '—';
}

  confirmSeen() {
    // pasa al siguiente jugador o termina

    if (this.playerIndex < this.assignments.length - 1) {
      this.playerIndex++;
      this.resetReveal();
    } else {
      this.screen = 'roundReady';
      this.resetReveal();
    }
  }

  private resetReveal() {
    this.revealProgress = 0;
    this.isRevealing = false;
    this.canConfirm = false;
    this.startY = null;
  }
  get secretOpacity(): number {
  const x = (this.revealProgress - 0.15) / 0.35;
  return Math.min(1, Math.max(0, x));
}
onConfirmTap(ev: Event) {
  ev.preventDefault();
  ev.stopPropagation();

  if (!this.canConfirm) return;
  this.confirmSeen();
}

private pointerStartY: number | null = null;

onPointerDown(ev: PointerEvent) {
  if (ev.pointerType !== 'touch') return;

  this.pointerStartY = ev.clientY;
  this.revealProgress = 0;
  this.canConfirm = false;
}

onPointerMove(ev: PointerEvent) {
  if (this.pointerStartY === null) return;
  if (ev.pointerType !== 'touch') return;

  const delta = this.pointerStartY - ev.clientY;
  const p = Math.max(0, Math.min(1, delta / this.revealPx));

  this.revealProgress = p;
  this.canConfirm = p >= 0.75;
}

onPointerUp(ev: PointerEvent) {
  if (ev.pointerType !== 'touch') return;

  this.pointerStartY = null;
  this.autoHide();
}
}
