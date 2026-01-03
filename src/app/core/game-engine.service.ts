import { Injectable } from '@angular/core';
import { GameSetup } from './game-state.service';

type RoundState = {
  round: number;
  usedWordsByCategory: Record<string, string[]>;
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


  private readonly wordsByCategory: Record<string, string[]> = {
   'Objetos': [
  'Plátano', 'Guitarra', 'Reloj', 'Mochila', 'Paraguas',
  'Lámpara', 'Espejo', 'Cuchara', 'Silla', 'Ventilador',
  'Botella', 'Llave', 'Cepillo', 'Tijeras', 'Bolígrafo',
  'Cuaderno', 'Caja', 'Linterna', 'Martillo', 'Destornillador',
  'Almohada', 'Cobija', 'Colchón', 'Televisor', 'Control remoto',
  'Radio', 'Altavoz', 'Audífonos', 'Micrófono', 'Cámara',
  'Impresora', 'Teclado', 'Mouse', 'Monitor', 'Computadora',
  'Celular', 'Tablet', 'Cargador', 'Batería', 'Enchufe',
  'Regla', 'Calculadora', 'Carpeta', 'Archivador', 'Sobre',
  'Taza', 'Plato', 'Vaso', 'Olla', 'Sartén',
  'Cuchillo', 'Tenedor', 'Espátula', 'Abrelatas', 'Termo',
  'Maletín', 'Bolso', 'Billetera', 'Monedero', 'Candado',
  'Ropa', 'Camisa', 'Pantalón', 'Chaqueta', 'Zapatos',
  'Gorra', 'Sombrero', 'Bufanda', 'Guantes', 'Cinturón',
  'Reloj despertador', 'Calendario', 'Agenda', 'Cuadro', 'Marco',
  'Escoba', 'Trapeador', 'Balde', 'Jabón', 'Esponja'
],

'Lugares': [
  'Aeropuerto', 'Hospital', 'Biblioteca', 'Playa', 'Cine',
  'Escuela', 'Universidad', 'Instituto', 'Guardería', 'Colegio',
  'Restaurante', 'Cafetería', 'Bar', 'Discoteca', 'Heladería',
  'Hotel', 'Hostal', 'Motel', 'Resort', 'Albergue',
  'Supermercado', 'Mercado', 'Bodega', 'Tienda', 'Centro comercial',
  'Banco', 'Cajero automático', 'Oficina', 'Edificio', 'Fábrica',
  'Parque', 'Plaza', 'Jardín', 'Zoológico', 'Acuario',
  'Estadio', 'Gimnasio', 'Piscina', 'Cancha', 'Coliseo',
  'Museo', 'Galería', 'Teatro', 'Auditorio', 'Sala de conciertos',
  'Iglesia', 'Catedral', 'Templo', 'Capilla', 'Monasterio',
  'Comisaría', 'Cuartel', 'Estación de bomberos', 'Municipalidad', 'Juzgado',
  'Terminal terrestre', 'Estación de tren', 'Puerto', 'Muelle', 'Marina',
  'Carretera', 'Autopista', 'Puente', 'Túnel', 'Intersección',
  'Barrio', 'Urbanización', 'Condominio', 'Vecindario', 'Residencial',
  'Casa', 'Departamento', 'Edificio', 'Azotea', 'Sótano',
  'Desierto', 'Bosque', 'Selva', 'Montaña', 'Valle'
],

'Profesiones': [
  'Doctor', 'Profesor', 'Chef', 'Piloto', 'Bombero',
  'Enfermero', 'Cirujano', 'Pediatra', 'Dentista', 'Psicólogo',
  'Arquitecto', 'Ingeniero', 'Programador', 'Analista', 'Desarrollador',
  'Diseñador', 'Ilustrador', 'Fotógrafo', 'Camarógrafo', 'Editor',
  'Abogado', 'Juez', 'Fiscal', 'Notario', 'Asesor legal',
  'Contador', 'Auditor', 'Economista', 'Administrador', 'Financiero',
  'Carpintero', 'Albañil', 'Electricista', 'Gasfitero', 'Soldador',
  'Mecánico', 'Técnico', 'Operador', 'Supervisor', 'Inspector',
  'Policía', 'Militar', 'Guardia', 'Detective', 'Investigador',
  'Periodista', 'Reportero', 'Locutor', 'Presentador', 'Comunicador',
  'Actor', 'Actriz', 'Director', 'Productor', 'Guionista',
  'Músico', 'Cantante', 'Compositor', 'DJ', 'Instrumentista',
  'Pintor', 'Escultor', 'Artista', 'Artesano', 'Ceramista',
  'Panadero', 'Pastelero', 'Carnicero', 'Pescadero', 'Repostero',
  'Agricultor', 'Ganadero', 'Granjero', 'Horticultor', 'Apicultor',
  'Chofer', 'Conductor', 'Taxista', 'Transportista', 'Mensajero',
  'Vendedor', 'Comerciante', 'Cajero', 'Atención al cliente', 'Asesor comercial'
],

  'Tecnología': [
  'Celular', 'Internet', 'Robot', 'PlayStation', 'Computadora',
  'Laptop', 'Tablet', 'Smartwatch', 'Televisor', 'Monitor',
  'Teclado', 'Mouse', 'Impresora', 'Escáner', 'Router',
  'Módem', 'Servidor', 'Nube', 'WiFi', 'Bluetooth',
  'Aplicación', 'Software', 'Sistema operativo', 'Programa', 'Archivo',
  'Base de datos', 'Algoritmo', 'Código', 'Script', 'Compilador',
  'Inteligencia artificial', 'Machine learning', 'Big data', 'Blockchain', 'Criptomoneda',
  'Videojuego', 'Consola', 'Control', 'Joystick', 'Realidad virtual',
  'Realidad aumentada', 'Pantalla', 'Sensor', 'Cámara', 'Micrófono',
  'Altavoz', 'Audífonos', 'Tarjeta gráfica', 'Procesador', 'Memoria RAM',
  'Disco duro', 'SSD', 'USB', 'Cable', 'Adaptador',
  'Cargador', 'Batería', 'Fuente de poder', 'Placa madre', 'Chip',
  'Firewall', 'Antivirus', 'Encriptación', 'Contraseña',
  'Correo electrónico', 'Navegador', 'Página web', 'Plataforma', 'Red social',
  'Streaming', 'Podcast', 'Videollamada', 'Chat', 'Mensajería',
  'Automatización', 'Domótica', 'Internet de las cosas', 'Smart TV', 'Asistente virtual'
],

'Naturaleza': [
  'Montaña', 'Río', 'Bosque', 'Desierto', 'Volcán',
  'Playa', 'Mar', 'Océano', 'Lago', 'Laguna',
  'Isla', 'Archipiélago', 'Cascada', 'Arroyo', 'Manantial',
  'Valle', 'Colina', 'Meseta', 'Cañón', 'Glaciar',
  'Selva', 'Sabana', 'Pradera', 'Tundra', 'Pantano',
  'Nieve', 'Hielo', 'Granizo', 'Lluvia', 'Tormenta',
  'Huracán', 'Ciclón', 'Tornado', 'Viento', 'Brisa',
  'Nube', 'Neblina', 'Arcoíris', 'Relámpago', 'Trueno',
  'Sol', 'Luna', 'Estrella', 'Cielo', 'Atmósfera',
  'Arena', 'Roca', 'Piedra', 'Mineral', 'Cristal',
  'Tierra', 'Suelo', 'Barro', 'Lodo', 'Arcilla',
  'Árbol', 'Hoja', 'Rama', 'Raíz', 'Tronco',
  'Flor', 'Planta', 'Hierba', 'Musgo', 'Hongo',
  'Coral', 'Alga', 'Reef', 'Manglar', 'Estuario',
  'Fuego', 'Agua', 'Aire', 'Energía', 'Gravedad'
],

'Comida': [
  'Helado', 'Pizza', 'Hamburguesa', 'Café', 'Ensalada',
  'Arroz', 'Pollo', 'Carne', 'Pescado', 'Sopa',
  'Pan', 'Tostada', 'Sandwich', 'Empanada', 'Tamale',
  'Pasta', 'Espagueti', 'Lasaña', 'Ravioles', 'Ñoquis',
  'Papas fritas', 'Puré', 'Arroz chaufa', 'Ceviche', 'Tiradito',
  'Sushi', 'Ramen', 'Udon', 'Tempura', 'Gyoza',
  'Taco', 'Burrito', 'Quesadilla', 'Nachos', 'Enchilada',
  'Asado', 'Parrilla', 'Chorizo', 'Salchicha', 'Anticucho',
  'Huevo', 'Omelette', 'Tortilla', 'Quiche', 'Frittata',
  'Queso', 'Yogur', 'Mantequilla', 'Crema', 'Leche',
  'Chocolate', 'Caramelo', 'Galleta', 'Bizcocho', 'Torta',
  'Pastel', 'Cupcake', 'Brownie', 'Donut', 'Churro',
  'Fruta', 'Manzana', 'Plátano', 'Naranja', 'Fresa',
  'Uva', 'Mango', 'Piña', 'Sandía', 'Melón',
  'Salsa', 'Mayonesa', 'Ketchup', 'Mostaza', 'Ají',
  'Sazonador', 'Sal', 'Azúcar', 'Miel', 'Vinagre'
],

  'Transporte': [
  'Taxi', 'Bicicleta', 'Avión', 'Tren', 'Helicóptero',
  'Automóvil', 'Carro', 'Camioneta', 'SUV', 'Sedán',
  'Motocicleta', 'Scooter', 'Patineta', 'Monopatín', 'Segway',
  'Bus', 'Autobús', 'Microbús', 'Minivan', 'Colectivo',
  'Metro', 'Subte', 'Tranvía', 'Trolebús', 'Ferrocarril',
  'Camión', 'Camión cisterna', 'Camión de carga', 'Furgón', 'Tráiler',
  'Barco', 'Bote', 'Lancha', 'Yate', 'Velero',
  'Ferry', 'Crucero', 'Submarino', 'Catamarán', 'Muelle',
  'Avioneta', 'Jet', 'Aeronave', 'Planeador', 'Dron',
  'Cohete',  'Satélite', 'Estación espacial', 'Lanzadera',
  'Carreta', 'Carroza', 'Carruaje', 'Trineo', 'Bicicleta eléctrica',
  'Mototaxi', 'Taxi colectivo', 'Teleférico', 
  'Ascensor',  
  'Monorriel',  'Tren bala', 'Alta velocidad',
  'Remolque', 'Semirremolque', 'Tolva', 'Grúa', 'Montacargas',
  'Ambulancia', 'Camión de bomberos', 'Patrulla', 'Todo terreno'
],

    'Eventos': [
  'Cumpleaños', 'Boda', 'Concierto', 'Reunión', 'Examen',
  'Fiesta', 'Festival', 'Ceremonia', 'Graduación', 'Desfile',
  'Carnaval', 'Feria', 'Convención', 'Congreso', 'Simposio',
  'Conferencia', 'Charla', 'Taller', 'Seminario', 'Capacitación',
  'Competencia', 'Torneo', 'Campeonato', 'Final', 'Clasificatoria',
  'Inauguración', 'Clausura', 'Presentación', 'Exposición', 'Muestra',
  'Estreno', 'Proyección', 'Función', 'Gala', 'Premiación',
  'Homenaje', 'Aniversario', 'Celebración', 'Brindis', 'Banquete',
  'Mitin', 'Manifestación', 'Marcha', 'Protesta', 'Asamblea',
  'Elección', 'Votación', 'Debate', 'Audiencia', 'Juicio',
  'Audición', 'Casting', 'Ensayo', 'Grabación', 'Transmisión',
  'Lanzamiento', 'Publicación', 'Anuncio', 'Convocatoria', 'Citación',
  'Inscripción', 'Registro', 'Matricula', 'Evaluación', 'Prueba',
  'Simulación', 'Ensayo', 'Ensayo', 'Reencuentro', 'Velorio',
  'Funeral', 'Entierro', 'Misa', 'Retiro', 'Campamento',
  'Viaje', 'Excursión', 'Paseo', 'Tour', 'Salida'
],

  'Deportes': [
  'Fútbol', 'Tenis', 'Básquet', 'Natación', 'Ciclismo',
  'Voleibol', 'Handball', 'Rugby', 'Béisbol', 'Softbol',
  'Atletismo', 'Gimnasia', 'Parkour', 'Escalada', 'Senderismo',
  'Boxeo', 'Karate', 'Judo', 'Taekwondo', 'Lucha',
  'Esgrima', 'Arquería', 'Tiro', 'Pentatlón', 'Triatlón',
  'Surf', 'Bodyboard', 'Windsurf', 'Kitesurf', 'Remo',
  'Canotaje', 'Kayak', 'Vela', 'Buceo', 'Snorkel',
  'Hockey', 'Patinaje', 'Curling', 'Bobsleigh', 'Skeleton',
  'Snowboard', 'Esquí', 'Motocross', 'Automovilismo', 'Karting',
  'Futsal', 'Pádel', 'Squash', 'Bádminton', 'Frontón',
  'Cricket', 'Lacrosse', 'Polo', 'Equitación', 'Hipismo',
  'Rodeo', 'Charrería', 'Pesca', 'Caza', 'Paintball',
  'Airsoft', 'Golf', 'Minigolf', 'Bowling', 'Billar',
  'Snooker', 'Dardos', 'Ajedrez', 'Damas',
  'Esports', 'Speedrun', 'Maratón', 'Ultramaratón', 'Crossfit',
  'Calistenia', 'Powerlifting', 'Fisicoculturismo', 'Spinning', 'Yoga'
],

   'Animales': [
  'Perro', 'Gato', 'Caballo', 'Vaca', 'Toro',
  'Oveja', 'Cabra', 'Cerdo', 'Burro', 'Mula',
  'León', 'Tigre', 'Pantera', 'Leopardo', 'Jaguar',
  'Elefante', 'Rinoceronte', 'Hipopótamo', 'Jirafa', 'Cebra',
  'Mono', 'Gorila', 'Chimpancé', 'Orangután', 'Mandril',
  'Oso', 'Panda', 'Koala', 'Perezoso', 'Nutria',
  'Lobo', 'Zorro', 'Coyote', 'Chacal', 'Hiena',
  'Venado', 'Alce', 'Ciervo', 'Antílope', 'Bisonte',
  'Ratón', 'Rata', 'Hámster', 'Cobaya', 'Erizo',
  'Conejo', 'Liebre', 'Murciélago', 'Ardilla', 'Castor',
  'Águila', 'Halcón', 'Búho', 'Lechuza', 'Cóndor',
  'Loro', 'Guacamayo', 'Perico', 'Canario', 'Jilguero',
  'Pingüino', 'Gaviota', 'Pelícano', 'Flamenco', 'Avestruz',
  'Serpiente', 'Boa', 'Pitón', 'Cobra', 'Víbora',
  'Lagarto', 'Iguana', 'Camaleón', 'Gecko', 'Cocodrilo',
  'Tortuga', 'Galápago', 'Rana', 'Sapo', 'Salamandra',
  'Pez', 'Tiburón', 'Delfín', 'Ballena', 'Orca'
]

  };

 // ✅ para llenar el combo
  getCategories(): string[] {
    return Object.keys(this.wordsByCategory);
  }

  private getWordsForCategory(category: string): string[] {
    return this.wordsByCategory[category] ?? [];
  }

loadRoundState(): RoundState {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { round: 0, usedWordsByCategory: {} };
    try {
      const parsed = JSON.parse(raw) as Partial<RoundState>;
      return {
        round: Number(parsed.round ?? 0),
        usedWordsByCategory:
          parsed.usedWordsByCategory && typeof parsed.usedWordsByCategory === 'object'
            ? parsed.usedWordsByCategory
            : {}
      };
    } catch {
      return { round: 0, usedWordsByCategory: {} };
    }
  }

  saveRoundState(state: RoundState): void {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  resetAll(): void {
    localStorage.removeItem(LS_KEY);
  }

  /** Nueva ronda por categoría */
  createRound(setup: GameSetup): { round: number; word: string; assignments: PlayerAssignment[] } {
    const state = this.loadRoundState();
    const nextRound = state.round + 1;

    const categories = this.getCategories();
    const category = setup.category && categories.includes(setup.category)
      ? setup.category
      : categories[0];

    const usedForCategory = state.usedWordsByCategory[category] ?? [];

    const word = this.pickUnusedWord(this.getWordsForCategory(category), usedForCategory);

    const nextUsedForCategory =
      usedForCategory.length + 1 >= this.getWordsForCategory(category).length
        ? [word] // si se agotó esa categoría, reinicia usados de esa categoría
        : [...usedForCategory, word];

    const usedWordsByCategory = {
      ...state.usedWordsByCategory,
      [category]: nextUsedForCategory
    };

    const assignments = this.assignRoles(setup, word);

    this.saveRoundState({ round: nextRound, usedWordsByCategory });

    return { round: nextRound, word, assignments };
  }

   private pickUnusedWord(pool: string[], used: string[]): string {
    const remaining = pool.filter(w => !used.includes(w));
    const bag = remaining.length > 0 ? remaining : pool;
    return bag[Math.floor(Math.random() * bag.length)];
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
