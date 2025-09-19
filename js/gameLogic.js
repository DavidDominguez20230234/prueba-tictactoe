// Combinaciones ganadoras (filas, columnas, diagonales)
const WINNING_COMBINATIONS = [
  // Filas
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columnas
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonales
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Verifica si hay un ganador en el tablero actual
 * @param {Array} board - Array representando el tablero (9 elementos)
 * @returns {string|null} 'X', 'O' si hay ganador, null si no hay ganador
 */
export function checkWinner(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    // Verificar si las tres posiciones tienen el mismo valor y no están vacías
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Retorna 'X' o 'O'
    }
  }

  return null; // No hay ganador
}

/**
 * Verifica si el juego ha terminado en empate
 * @param {Array} board - Array representando el tablero
 * @returns {boolean} True si es empate, False si no
 */
export function checkTie(board) {
  // Verificar si todas las celdas están ocupadas y no hay ganador
  return board.every((cell) => cell !== "") && checkWinner(board) === null;
}

/**
 * Verifica si el juego ha terminado (ya sea por victoria o empate)
 * @param {Array} board - Array representando el tablero
 * @returns {boolean} True si el juego ha terminado, False si no
 */
export function isGameOver(board) {
  return checkWinner(board) !== null || checkTie(board);
}

/**
 * Obtiene las celdas que forman la combinación ganadora
 * @param {Array} board - Array representando el tablero
 * @returns {Array|null} Array con los índices de la combinación ganadora o null si no hay ganador
 */
export function getWinningCombination(board) {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combination; // Retorna la combinación ganadora
    }
  }

  return null; // No hay combinación ganadora
}

/**
 * Realiza una jugada en el tablero
 * @param {Array} board - Array representando el tablero
 * @param {number} index - Índice donde se quiere hacer la jugada (0-8)
 * @param {string} player - Jugador que hace la jugada ('X' o 'O')
 * @returns {Array|null} Nuevo tablero con la jugada realizada, o null si la jugada no es válida
 */
export function makeMove(board, index, player) {
  // Verificar si la jugada es válida
  if (index < 0 || index > 8 || board[index] !== "") {
    return null; // Jugada inválida
  }

  // Crear una copia del tablero para no modificar el original
  const newBoard = [...board];
  newBoard[index] = player;

  return newBoard;
}

/**
 * Obtiene todas las jugadas disponibles (celdas vacías)
 * @param {Array} board - Array representando el tablero
 * @returns {Array} Array con los índices de las celdas vacías
 */
export function getAvailableMoves(board) {
  const availableMoves = [];

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      availableMoves.push(i);
    }
  }

  return availableMoves;
}

/**
 * Evalúa el estado del tablero para un jugador específico
 * @param {Array} board - Array representando el tablero
 * @param {string} player - Jugador para el que se evalúa ('X' o 'O')
 * @returns {number} Puntuación del tablero (10 si gana, -10 si pierde, 0 si empate o no terminado)
 */
export function evaluateBoard(board, player) {
  const winner = checkWinner(board);

  if (winner === player) {
    return 10; // El jugador gana
  } else if (winner !== null) {
    return -10; // El oponente gana
  }

  return 0; // Empate o juego no terminado
}

/**
 * Implementación del algoritmo Minimax para IA
 * @param {Array} board - Array representando el tablero
 * @param {number} depth - Profundidad de la búsqueda
 * @param {boolean} isMaximizing - True si es el turno del maximizador, False del minimizador
 * @param {string} player - Jugador para el que se calcula ('X' o 'O')
 * @returns {number} Mejor valor de evaluación
 */
export function minimax(board, depth, isMaximizing, player) {
  const opponent = player === "X" ? "O" : "X";
  const score = evaluateBoard(board, player);

  // Si el juego terminó, retornar la puntuación
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (getAvailableMoves(board).length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (const move of getAvailableMoves(board)) {
      const newBoard = makeMove(board, move, player);
      const score = minimax(newBoard, depth + 1, false, player);
      bestScore = Math.max(score, bestScore);
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (const move of getAvailableMoves(board)) {
      const newBoard = makeMove(board, move, opponent);
      const score = minimax(newBoard, depth + 1, true, player);
      bestScore = Math.min(score, bestScore);
    }

    return bestScore;
  }
}

/**
 * Encuentra la mejor jugada para la IA usando Minimax
 * @param {Array} board - Array representando el tablero
 * @param {string} player - Jugador de la IA ('X' o 'O')
 * @returns {number} Índice de la mejor jugada
 */
export function findBestMove(board, player) {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (const move of getAvailableMoves(board)) {
    const newBoard = makeMove(board, move, player);
    const score = minimax(newBoard, 0, false, player);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

/**
 * Reinicia el tablero a su estado inicial
 * @returns {Array} Tablero vacío
 */
export function resetBoard() {
  return Array(9).fill("");
}

/**
 * Convierte coordenadas de fila/columna a índice del tablero
 * @param {number} row - Fila (0-2)
 * @param {number} col - Columna (0-2)
 * @returns {number} Índice correspondiente (0-8)
 */
export function coordinatesToIndex(row, col) {
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    throw new Error("Coordenadas inválidas. Deben estar entre 0 y 2.");
  }

  return row * 3 + col;
}

/**
 * Convierte índice del tablero a coordenadas de fila/columna
 * @param {number} index - Índice del tablero (0-8)
 * @returns {Object} Objeto con propiedades row y col
 */
export function indexToCoordinates(index) {
  if (index < 0 || index > 8) {
    throw new Error("Índice inválido. Debe estar entre 0 y 8.");
  }

  return {
    row: Math.floor(index / 3),
    col: index % 3,
  };
}

/**
 * Verifica si una jugada es válida
 * @param {Array} board - Array representando el tablero
 * @param {number} index - Índice donde se quiere hacer la jugada
 * @returns {boolean} True si la jugada es válida, False si no
 */
export function isValidMove(board, index) {
  return index >= 0 && index < 9 && board[index] === "";
}

/**
 * Obtiene el jugador contrario
 * @param {string} player - Jugador actual ('X' o 'O')
 * @returns {string} Jugador contrario
 */
export function getOpponent(player) {
  return player === "X" ? "O" : "X";
}

/**
 * Obtiene el estado actual del juego como texto
 * @param {Array} board - Array representando el tablero
 * @returns {string} Descripción del estado del juego
 */
export function getGameStatus(board) {
  const winner = checkWinner(board);

  if (winner) {
    return `Ganador: ${winner}`;
  } else if (checkTie(board)) {
    return "Empate";
  } else {
    const availableMoves = getAvailableMoves(board);
    return `Jugadas disponibles: ${availableMoves.length}`;
  }
}

/**
 * Crea una representación visual del tablero en formato texto
 * @param {Array} board - Array representando el tablero
 * @returns {string} Representación visual del tablero
 */
export function boardToString(board) {
  let result = "";

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const cell = board[index] || " ";
      result += ` ${cell} `;

      if (j < 2) result += "|";
    }

    if (i < 2) result += "\n---+---+---\n";
  }

  return result;
}

export function getNextStarter(lastStarter = "player2") {
  // Si la última vez empezó player1, ahora le toca player2 y viceversa
  return lastStarter === "player1" ? "player2" : "player1";
}

// Exportar las combinaciones ganadoras por si se necesitan externamente
export { WINNING_COMBINATIONS };
