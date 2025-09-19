import { startLoading } from "./screens/loading.js";
import { setupMenuEvents } from "./screens/menu.js";

document.addEventListener("DOMContentLoaded", () => {
  // Inicia el loading
  startLoading(() => {
    // Ocultar loading screen
    document.getElementById("loading-screen").classList.add("hidden");

    // Verificar si venimos de una redirección desde el juego
    const urlParams = new URLSearchParams(window.location.search);
    const fromGame = urlParams.get("fromGame");

    if (fromGame === "true") {
      // Mostrar mensaje de bienvenida de vuelta
      alert("Bienvenido de vuelta al menú principal");
    }

    // Mostrar menú principal
    document.getElementById("menu-screen").classList.remove("hidden");

    // Configurar event listeners para los botones del menú
    setupMenuEvents();
  });
});
