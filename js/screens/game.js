import {
  checkWinner,
  checkTie,
  makeMove,
  isValidMove,
  getOpponent,
  getNextStarter,
} from "../gameLogic.js";

import { makeCpuMove, getDifficulty } from "../cpu.js";
import {
  loadGameConfig,
  loadGameState,
  saveGameState,
  updateGameStats,
  clearAllGameData,
  getGameStats,
  clearGameState,
} from "../storage.js";

import { showConfirmationModal } from "../utils/modal.js";
import { playSound } from "../utils/sounds.js";

/**
 * Clase principal que maneja la lógica del juego Tic Tac Toe
 */
class TicTacToeGame {
  constructor() {
    this.gameConfig = loadGameConfig();
    if (!this.gameConfig) {
      window.location.href = "index.html";
      return;
    }

    this.board = Array(9).fill("");
    this.gameActive = true;
    this.currentPlayer = "X";
    this.currentStarter = null;

    // Actualiza la información de los jugadores en pantalla
    this.updatePlayerInfo();

    // Cargar estado guardado si existe
    this.loadPreviousState();

    // Inicializar eventos
    this.setupCellClickEvents();
    this.setupControlButtons();
  }

  /** Carga estado previo si existe */
  loadPreviousState() {
    const savedState = loadGameState();
    if (savedState) {
      this.board = savedState.board || Array(9).fill("");
      this.currentPlayer = savedState.currentPlayer || "X";
      this.updateBoard();

      if (this.gameConfig.mode === "cpu" && this.currentPlayer === "O") {
        this.gameActive = false;
        setTimeout(() => this.cpuTurn(), 500);
      }
    } else {
      const starter = getNextStarter(this.gameConfig.lastStarter);
      this.currentPlayer = starter === "player1" ? "X" : "O";
      this.currentStarter = starter;
      this.gameConfig.lastStarter = starter;
    }
  }

  /** Configura los eventos de click en cada celda */
  setupCellClickEvents() {
    document
      .querySelectorAll(".cell")
      .forEach((cell) =>
        cell.addEventListener("click", (e) => this.handleCellClick(e))
      );
  }

  /** Configura botones de refrescar, volver, próximo round y salir */
  setupControlButtons() {
    // Reiniciar juego
    document.querySelector(".refresh-button").addEventListener("click", () => {
      playSound("menuOff");
      showConfirmationModal({
        title: "¿Seguro de que quiere reiniciar la partida?",
        acceptText: "REINICIAR PARTIDA",
        showSave: false,
        onAccept: () => this.resetGame(),
      });
    });

    // Volver al menú
    document.querySelector(".back-button").addEventListener("click", () => {
      playSound("menuOff");
      showConfirmationModal({
        title: "¿Seguro de que quiere salir al menú sin guardar el progreso?",
        acceptText: "ACEPTAR",
        showSave: true,
        onAccept: () => this.goBackToMenu(false),
        onSave: () => this.goBackToMenu(true),
      });
    });

    // Próximo round
    document.querySelector(".btn-next-round").addEventListener("click", () => {
      playSound("menuOn");
      this.hideModal();
      this.updateGameStats();
      this.resetGame();
    });

    // Salir desde modal
    document.querySelector(".btn-exit").addEventListener("click", () => {
      playSound("menuOff");
      showConfirmationModal({
        title: "¿Seguro de que quiere salir al menú sin guardar el progreso?",
        acceptText: "ACEPTAR",
        showSave: true,
        fromExit: true,
        onAccept: () => this.goBackToMenu(false),
        onSave: () => this.goBackToMenu(true, true),
      });
    });
  }

  /** Actualiza la información de los jugadores en pantalla */
  updatePlayerInfo() {
    const {
      player1,
      player2,
      player1Initials,
      player2Initials,
      player1Wins,
      player2Wins,
      ties,
    } = this.gameConfig;

    document.querySelector(".player1-name").textContent = player1;
    document.querySelector(".player2-name").textContent = player2;
    document.querySelector(".player1-initials").textContent = player1Initials;
    document.querySelector(".player2-initials").textContent = player2Initials;
    document.querySelector(".player1-score-label").textContent =
      player1Initials;
    document.querySelector(".player2-score-label").textContent =
      player2Initials;
    document.querySelector(
      ".player1-wins"
    ).textContent = `${player1Wins} GANADAS`;
    document.querySelector(
      ".player2-wins"
    ).textContent = `${player2Wins} GANADAS`;
    document.querySelector(".ties-count").textContent = `${ties} EMPATES`;
  }

  /** Actualiza el tablero en pantalla */
  updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, index) => {
      cell.innerHTML = "";
      const value = this.board[index];
      if (!value) return;

      const img = document.createElement("img");
      img.classList.add("cell-symbol");

      if (value === "X") {
        img.src = "../../assets/icons/ios-close.png";
        img.alt = "X";
      } else {
        img.src = "../../assets/icons/circle.png";
        img.alt = "O";
      }

      cell.appendChild(img);
    });
  }

  /** Maneja el click en una celda */
  handleCellClick(event) {
    const cell = event.target.closest(".cell");
    if (!cell || !this.gameActive) return;
    if (this.gameConfig.mode === "cpu" && this.currentPlayer === "O") return;

    const index = parseInt(cell.dataset.index);
    if (!isValidMove(this.board, index)) return;

    playSound("move");
    this.board = makeMove(this.board, index, this.currentPlayer);
    this.updateBoard();

    const winner = checkWinner(this.board);
    if (winner) return this.handleWin(winner);
    if (checkTie(this.board)) return this.handleTie();

    // Cambiar turno
    this.currentPlayer = getOpponent(this.currentPlayer);
    saveGameState({ board: this.board, currentPlayer: this.currentPlayer });

    if (this.gameConfig.mode === "cpu" && this.currentPlayer === "O") {
      this.gameActive = false;
      setTimeout(() => this.cpuTurn(), 500);
    }
  }

  /** Turno de la CPU */
  cpuTurn() {
    const cpuMove = makeCpuMove(this.board, "O", getDifficulty());
    playSound("move");

    if (cpuMove === -1) return;

    this.board = makeMove(this.board, cpuMove, "O");
    this.updateBoard();

    const winner = checkWinner(this.board);
    if (winner) return this.handleWin(winner);
    if (checkTie(this.board)) return this.handleTie();

    this.currentPlayer = "X";
    this.gameActive = true;
    saveGameState({ board: this.board, currentPlayer: this.currentPlayer });
  }

  /** Maneja la victoria */
  handleWin(winner) {
    this.gameActive = false;
    const modal = document.getElementById("modal-game");
    const winnerNameDiv = modal.querySelector(".modal-winner-name");

    // Configurar modal según el resultado
    if (this.gameConfig.mode === "cpu" && winner === "O") {
      setTimeout(() => {
        this.showModal();
        playSound("defeat");
      }, 300);
      modal.querySelector(".modal-trophy").classList.add("hidden");
      modal.querySelector(".modal-face").classList.remove("hidden");
      modal.querySelector(".modal-title").textContent = "PERDISTE";
      winnerNameDiv.textContent = this.gameConfig.player1;
    } else {
      setTimeout(() => {
        this.showModal();
        playSound("victory");
      }, 300);
      modal.querySelector(".modal-trophy").classList.remove("hidden");
      modal.querySelector(".modal-face").classList.add("hidden");
      modal.querySelector(".modal-title").textContent = "VICTORIA";
      winnerNameDiv.textContent =
        winner === "X" ? this.gameConfig.player1 : this.gameConfig.player2;
    }

    winnerNameDiv.classList.remove("hidden");

    // Actualizar estadísticas
    const config = updateGameStats(winner);
    modal.querySelector(".modal-player1-score-label").textContent =
      config.player1Initials;
    modal.querySelector(".modal-player2-score-label").textContent =
      config.player2Initials;
    modal.querySelector(
      ".modal-player1-wins"
    ).textContent = `${config.player1Wins} GANADAS`;
    modal.querySelector(
      ".modal-player2-wins"
    ).textContent = `${config.player2Wins} GANADAS`;
    modal.querySelector(
      ".modal-ties-count"
    ).textContent = `${config.ties} EMPATES`;

    this.gameConfig.lastStarter = this.currentStarter;
    saveGameState({ board: this.board, currentPlayer: this.currentPlayer });
  }

  /** Maneja empate */
  handleTie() {
    this.gameActive = false;
    setTimeout(() => {
      this.showModal();
      playSound("tie");
    }, 300);

    const modal = document.getElementById("modal-game");
    modal.querySelector(".modal-trophy").classList.add("hidden");
    modal.querySelector(".modal-face").classList.remove("hidden");
    modal.querySelector(".modal-title").textContent = "EMPATE";
    modal.querySelector(".modal-winner-name").classList.add("hidden");

    const config = updateGameStats("tie");
    modal.querySelector(".modal-player1-score-label").textContent =
      config.player1Initials;
    modal.querySelector(".modal-player2-score-label").textContent =
      config.player2Initials;
    modal.querySelector(
      ".modal-player1-wins"
    ).textContent = `${config.player1Wins} GANADAS`;
    modal.querySelector(
      ".modal-player2-wins"
    ).textContent = `${config.player2Wins} GANADAS`;
    modal.querySelector(
      ".modal-ties-count"
    ).textContent = `${config.ties} EMPATES`;

    this.gameConfig.lastStarter = this.currentStarter;
    saveGameState({ board: this.board, currentPlayer: this.currentPlayer });
  }

  /** Actualiza estadísticas en pantalla */
  updateGameStats() {
    const stats = getGameStats();
    document.querySelector(
      ".player1-wins"
    ).textContent = `${stats.player1Wins} GANADAS`;
    document.querySelector(
      ".player2-wins"
    ).textContent = `${stats.player2Wins} GANADAS`;
    document.querySelector(".ties-count").textContent = `${stats.ties} EMPATES`;
  }

  /** Reinicia el juego */
  resetGame() {
    this.board = Array(9).fill("");
    const starter = getNextStarter(this.gameConfig.lastStarter);
    this.currentPlayer = starter === "player1" ? "X" : "O";
    this.currentStarter = starter;
    this.gameConfig.lastStarter = starter;
    this.gameActive = true;
    this.updateBoard();

    if (this.gameConfig.mode === "cpu" && this.currentPlayer === "O") {
      this.gameActive = false;
      setTimeout(() => this.cpuTurn(), 500);
    }
  }

  /** Regresa al menú, opcionalmente guardando partida */
  goBackToMenu(saveGame, fromExit) {
    if (!saveGame) clearAllGameData();
    if (fromExit) clearGameState();

    window.location.href = "index.html";
  }

  /** Muestra el modal de resultado */
  showModal() {
    const modal = document.getElementById("modal-game");
    const modalContent = modal.querySelector(".modal-content");

    modal.classList.remove("hidden");
    modal.classList.add("show");

    // Forzar reflow para animación
    modalContent.offsetHeight;
    modalContent.classList.add("show");
  }

  /** Oculta el modal de resultado */
  hideModal() {
    const modal = document.getElementById("modal-game");
    const modalContent = modal.querySelector(".modal-content");

    modalContent.classList.remove("show");
    modal.classList.remove("show");

    setTimeout(() => modal.classList.add("hidden"), 300);
  }
}

// Inicializar juego
document.addEventListener("DOMContentLoaded", () => {
  new TicTacToeGame();
});
