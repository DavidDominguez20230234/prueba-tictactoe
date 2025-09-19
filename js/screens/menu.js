import {
  saveGameConfig,
  hasGameInProgress,
  loadGameConfig,
  clearAllGameData,
} from "../storage.js";
import { showConfirmationModal } from "../utils/modal.js";
import { setDifficulty } from "../cpu.js";
import { playSound } from "../utils/sounds.js";

/**
 * Inicializa los eventos del menú principal
 */
export function setupMenuEvents() {
  setupModeButtons();
  setupBackButtons();
  setupStartButtons();
  checkForSavedGame();
}

/** Configura los botones de selección de modo */
function setupModeButtons() {
  const cpuBtn = document.querySelector(".btn-cpu");
  const pvpBtn = document.querySelector(".btn-pvp");

  cpuBtn.addEventListener("click", () => handleModeClick("cpu"));
  pvpBtn.addEventListener("click", () => handleModeClick("pvp"));
}

/**
 * Maneja click en modo CPU o PvP
 * @param {"cpu"|"pvp"} mode
 */
function handleModeClick(mode) {
  playSound("menuOn");

  const setupScreenId =
    mode === "cpu" ? "player-setup-cpu" : "player-setup-pvp";

  if (hasGameInProgress()) {
    showConfirmationModal({
      title:
        "Hay una partida guardada. ¿Estas seguro de que quieres sobreescribirla?",
      acceptText: "ACEPTAR",
      onAccept: () => {
        overwriteSavedGame();
        document.getElementById(setupScreenId).classList.remove("hidden");
      },
    });
  } else {
    document.getElementById("menu-screen").classList.add("hidden");
    document.getElementById(setupScreenId).classList.remove("hidden");
  }
}

/** Configura los botones de volver en pantallas de configuración */
function setupBackButtons() {
  const backButtons = document.querySelectorAll(".btn-back");
  backButtons.forEach((button) => {
    button.addEventListener("click", () => {
      playSound("menuOff");

      document.querySelectorAll(".player-setup-screen").forEach((screen) => {
        screen.classList.add("hidden");
      });

      if (!hasGameInProgress()) {
        const continueBtn = document.querySelector(".btn-continue");
        continueBtn && continueBtn.remove();
      }

      document.getElementById("menu-screen").classList.remove("hidden");
    });
  });
}

/** Configura los botones de iniciar partida */
function setupStartButtons() {
  document
    .getElementById("start-cpu")
    .addEventListener("click", startGameVsCpu);
  document.getElementById("start-pvp").addEventListener("click", startGamePvP);
}

/** Revisa si hay partida guardada y crea botón de continuar si existe */
function checkForSavedGame() {
  if (!hasGameInProgress()) return;

  const config = loadGameConfig();
  if (!config) return;

  const continueBtn = document.createElement("button");
  continueBtn.className = "menu-btn btn-continue";
  continueBtn.textContent = "CONTINUAR PARTIDA";
  continueBtn.style.background = "#9C27B0";

  const menuContainer = document.querySelector(".menu-container");
  const pvpButton = document.querySelector(".btn-pvp");
  menuContainer.insertBefore(continueBtn, pvpButton.nextSibling);

  continueBtn.addEventListener("click", () => {
    playSound("menuOn");
    setTimeout(() => (window.location.href = "game.html"), 200);
  });
}

/**
 * Genera iniciales de un nombre
 * @param {string} name
 * @param {boolean} isCpu
 * @returns {string}
 */
function getInitials(name, isCpu = false) {
  if (isCpu) return "CPU";

  const parts = name.trim().split(" ");
  let initials = "";
  if (parts.length > 0) initials += parts[0][0].toUpperCase();
  if (parts.length > 1) initials += parts[1][0].toUpperCase();

  return initials || name[0].toUpperCase();
}

/** Inicia una partida contra la CPU */
function startGameVsCpu() {
  playSound("menuOn");
  setTimeout(() => {
    const playerName =
      document.getElementById("player").value.trim() || "Jugador";
    const difficultySelect = document.getElementById("cpu-difficulty");
    const difficulty = difficultySelect ? difficultySelect.value : "medium";
    setDifficulty(difficulty);

    const gameConfig = {
      mode: "cpu",
      player1: playerName,
      player2: "Computadora",
      player1Initials: getInitials(playerName),
      player2Initials: getInitials("Computadora", true),
      player1Wins: 0,
      player2Wins: 0,
      ties: 0,
      lastStarter: null,
      timestamp: Date.now(),
    };

    saveGameConfig(gameConfig);
    window.location.href = "game.html";
  }, 200);
}

/** Inicia una partida PvP */
function startGamePvP() {
  playSound("menuOn");
  setTimeout(() => {
    const player1Name =
      document.getElementById("player1").value.trim() || "Jugador 1";
    const player2Name =
      document.getElementById("player2").value.trim() || "Jugador 2";

    const gameConfig = {
      mode: "pvp",
      player1: player1Name,
      player2: player2Name,
      player1Initials: getInitials(player1Name),
      player2Initials: getInitials(player2Name),
      player1Wins: 0,
      player2Wins: 0,
      ties: 0,
      lastStarter: null,
      timestamp: Date.now(),
    };

    saveGameConfig(gameConfig);
    window.location.href = "game.html";
  }, 200);
}

/** Sobrescribe la partida guardada y oculta el menú */
function overwriteSavedGame() {
  clearAllGameData();
  document.getElementById("menu-screen").classList.add("hidden");
}
