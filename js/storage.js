// Claves de localStorage
const CONFIG_KEY = "tictactoe_game_config";
const STATE_KEY = "tictactoe_game_state";

/**
 * Guarda la configuración general del juego
 * @param {Object} gameConfig
 */
export function saveGameConfig(gameConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(gameConfig));
}

/**
 * Carga la configuración general del juego
 * @returns {Object|null}
 */
export function loadGameConfig() {
  const config = localStorage.getItem(CONFIG_KEY);
  return config ? JSON.parse(config) : null;
}

/**
 * Guarda el estado actual de la partida
 * @param {Object} gameState
 */
export function saveGameState(gameState) {
  localStorage.setItem(STATE_KEY, JSON.stringify(gameState));
}

/**
 * Carga el estado actual de la partida
 * @returns {Object|null}
 */
export function loadGameState() {
  const state = localStorage.getItem(STATE_KEY);
  return state ? JSON.parse(state) : null;
}

/** Elimina únicamente el estado del juego (configuración intacta) */
export function clearGameState() {
  localStorage.removeItem(STATE_KEY);
}

/** Elimina toda la información del juego (configuración y estado) */
export function clearAllGameData() {
  localStorage.removeItem(CONFIG_KEY);
  localStorage.removeItem(STATE_KEY);
}

/** Verifica si hay una partida en curso */
export function hasGameInProgress() {
  return !!localStorage.getItem(CONFIG_KEY);
}

/** Obtiene las estadísticas de victorias y empates */
export function getGameStats() {
  const config = loadGameConfig();
  if (!config) return { player1Wins: 0, player2Wins: 0, ties: 0 };

  return {
    player1Wins: config.player1Wins || 0,
    player2Wins: config.player2Wins || 0,
    ties: config.ties || 0,
  };
}

/**
 * Actualiza las estadísticas después de una partida
 * @param {'X'|'O'|'tie'} winner
 * @returns {Object} Config actualizada
 */
export function updateGameStats(winner) {
  const config = loadGameConfig();
  if (!config) return null;

  switch (winner) {
    case "X":
      config.player1Wins = (config.player1Wins || 0) + 1;
      break;
    case "O":
      config.player2Wins = (config.player2Wins || 0) + 1;
      break;
    case "tie":
      config.ties = (config.ties || 0) + 1;
      break;
  }

  saveGameConfig(config);
  return config;
}
