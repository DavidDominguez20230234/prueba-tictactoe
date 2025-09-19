import {
  findBestMove,
  getAvailableMoves,
  checkWinner,
  getOpponent,
} from "./gameLogic.js";

/**
 * Realiza un movimiento para la CPU según la dificultad
 * @param {Array} board - Estado actual del tablero
 * @param {string} cpuPlayer - Símbolo de la CPU ('X' o 'O')
 * @param {string} difficulty - Nivel de dificultad ('easy', 'medium', 'hard')
 * @returns {number} Índice de la casilla elegida
 */
export function makeCpuMove(board, cpuPlayer = "O", difficulty = "medium") {
  const availableMoves = getAvailableMoves(board);
  if (!availableMoves.length) return -1;

  switch (difficulty) {
    case "easy":
      return makeEasyMove(availableMoves);
    case "medium":
      return makeMediumMove(board, cpuPlayer, availableMoves);
    case "hard":
      return makeHardMove(board, cpuPlayer);
    default:
      return makeMediumMove(board, cpuPlayer, availableMoves);
  }
}

/** Movimiento fácil: elige una casilla aleatoria */
function makeEasyMove(availableMoves) {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

/**
 * Movimiento medio: intenta ganar o bloquear, sino elige estratégicamente
 */
function makeMediumMove(board, cpuPlayer, availableMoves) {
  const humanPlayer = getOpponent(cpuPlayer);

  // 1. Intentar ganar
  for (const move of availableMoves) {
    if (
      checkWinner([
        ...board.slice(0, move),
        cpuPlayer,
        ...board.slice(move + 1),
      ]) === cpuPlayer
    ) {
      return move;
    }
  }

  // 2. Intentar bloquear al humano
  for (const move of availableMoves) {
    if (
      checkWinner([
        ...board.slice(0, move),
        humanPlayer,
        ...board.slice(move + 1),
      ]) === humanPlayer
    ) {
      return move;
    }
  }

  // 3. Priorizar centro
  if (board[4] === "") return 4;

  // 4. Priorizar esquinas
  const corners = [0, 2, 6, 8].filter((i) => board[i] === "");
  if (corners.length)
    return corners[Math.floor(Math.random() * corners.length)];

  // 5. Elegir aleatorio entre el resto
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

/** Movimiento difícil: usa Minimax para la mejor jugada */
function makeHardMove(board, cpuPlayer) {
  return findBestMove(board, cpuPlayer);
}

/** Devuelve la dificultad configurada en localStorage */
export function getDifficulty() {
  return localStorage.getItem("tictactoe_difficulty") || "medium";
}

/** Guarda la dificultad en localStorage */
export function setDifficulty(difficulty) {
  if (["easy", "medium", "hard"].includes(difficulty)) {
    localStorage.setItem("tictactoe_difficulty", difficulty);
  }
}
