import { Injectable } from '@angular/core';
import { GameSetup } from './game-state.service';

type RoundState = {
  round: number;
  usedWords: string[];
};

type PlayerAssignment = {
  label: string;     // "Jugador 1" o nombre
  roleText: string;  // palabra o "IMPOSTOR"
  isImpostor: boolean;
};

const LS_KEY = 'fakeit_state_v1';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  // ✅ lista simple (luego la ampliamos)
  private readonly words = [
  // Objetos cotidianos
  'Plátano', 'Guitarra', 'Reloj', 'Mochila', 'Paraguas',
  'Lámpara', 'Espejo', 'Cuchara', 'Silla', 'Ventilador',

  // Lugares
  'Aeropuerto', 'Hospital', 'Biblioteca', 'Playa', 'Cine',
  'Restaurante', 'Hotel', 'Escuela', 'Estadio', 'Supermercado',

  // Profesiones / roles
  'Doctor', 'Profesor', 'Chef', 'Piloto', 'Bombero',
  'Policía', 'Músico', 'Fotógrafo', 'Arquitecto', 'Pescador',

  // Tecnología / moderno
  'Celular', 'Internet', 'Robot', 'PlayStation', 'Computadora',
  'Audífonos', 'Cámara', 'Control remoto', 'Televisor', 'Impresora',

  // Naturaleza
  'Montaña', 'Río', 'Bosque', 'Desierto', 'Lluvia',
  'Nieve', 'Volcán', 'Playa', 'Isla', 'Selva',

  // Comida (no demasiado obvia)
  'Helado', 'Pizza', 'Hamburguesa', 'Café', 'Chocolate',
  'Pan', 'Arroz', 'Sopa', 'Ensalada', 'Torta',

  // Transporte
  'Taxi', 'Bicicleta', 'Avión', 'Tren', 'Motocicleta',
  'Barco', 'Metro', 'Camión', 'Patineta', 'Helicóptero',

  // Conceptos / cosas abstractas pero jugables
  'Vacaciones', 'Fiesta', 'Cumpleaños', 'Viaje', 'Concierto',
  'Examen', 'Mudanza', 'Reunión', 'Entrenamiento', 'Competencia'
];


  loadRoundState(): RoundState {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { round: 0, usedWords: [] };
    try {
      const parsed = JSON.parse(raw) as Partial<RoundState>;
      return {
        round: Number(parsed.round ?? 0),
        usedWords: Array.isArray(parsed.usedWords) ? parsed.usedWords : []
      };
    } catch {
      return { round: 0, usedWords: [] };
    }
  }

  saveRoundState(state: RoundState): void {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  resetAll(): void {
    localStorage.removeItem(LS_KEY);
  }

  /** Nueva ronda: incrementa round, elige palabra NO repetida, asigna impostores */
  createRound(setup: GameSetup): { round: number; word: string; assignments: PlayerAssignment[] } {
    const state = this.loadRoundState();
    const nextRound = state.round + 1;

    const word = this.pickUnusedWord(state.usedWords);
    const usedWords = [...state.usedWords, word];

    // si ya se agotaron palabras, reiniciamos lista de usadas y empezamos fresco
    const normalizedUsedWords = usedWords.length >= this.words.length ? [word] : usedWords;

    const assignments = this.assignRoles(setup, word);

    this.saveRoundState({ round: nextRound, usedWords: normalizedUsedWords });

    return { round: nextRound, word, assignments };
  }

  private pickUnusedWord(used: string[]): string {
    const remaining = this.words.filter(w => !used.includes(w));
    const pool = remaining.length > 0 ? remaining : this.words;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  private assignRoles(setup: GameSetup, word: string): PlayerAssignment[] {
    const n = setup.playersCount;
    const impostors = this.pickDistinctIndexes(n, setup.impostorsCount);

    const names = (setup.playerNames?.length ?? 0) === n
      ? setup.playerNames
      : Array.from({ length: n }, (_, i) => `Jugador ${i + 1}`);

    return names.map((label, i) => {
      const isImpostor = impostors.has(i);
      return {
        label,
        isImpostor,
        roleText: isImpostor ? 'IMPOSTOR' : word
      };
    });
  }

  private pickDistinctIndexes(total: number, count: number): Set<number> {
    const c = Math.max(1, Math.min(count, total - 1)); // mínimo 1, máximo total-1
    const s = new Set<number>();
    while (s.size < c) {
      s.add(Math.floor(Math.random() * total));
    }
    return s;
  }
}
