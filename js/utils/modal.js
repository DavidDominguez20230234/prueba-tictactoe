import { playSound } from "./sounds.js";

/**
 * Muestra un modal de confirmación con opciones de aceptar, cancelar y guardar.
 * @param {Object} options
 * @param {string} options.title - Título del modal
 * @param {string} [options.acceptText] - Texto del botón aceptar
 * @param {boolean} [options.fromExit] - Indica si se llama desde el modal de salida
 * @param {boolean} [options.showSave] - Mostrar botón de guardar
 * @param {Function} [options.onAccept] - Callback al aceptar
 * @param {Function} [options.onSave] - Callback al guardar
 */
export function showConfirmationModal({
  title,
  acceptText = "ACEPTAR",
  fromExit = false,
  showSave = false,
  onAccept,
  onSave,
}) {
  showModal();

  const modal = document.getElementById("modal-confirmation");
  const modalContent = modal.querySelector(".modal-confirmation-content");
  const titleEl = modal.querySelector(".modal-confirmation-title");
  const acceptBtn = modal.querySelector(".btn-accept");
  const cancelBtn = modal.querySelector(".btn-cancel");
  const saveBtn = modal.querySelector(".btn-save");

  // Configuración del modal
  titleEl.textContent = title;
  acceptBtn.textContent = acceptText;
  saveBtn.classList.toggle("hidden", !showSave);

  // Eventos
  acceptBtn.onclick = () => handleAction(onAccept);
  saveBtn.onclick = () => handleAction(onSave);
  cancelBtn.onclick = () => {
    playSound("menuOff");
    if (fromExit) {
      document.getElementById("modal-game").classList.remove("hidden");
    }
    hideModal();
  };
}

/** Maneja la acción de aceptar o guardar */
function handleAction(callback) {
  playSound("menuOn");
  setTimeout(() => {
    callback && callback();
    hideModal();
  }, 200);
}

/** Muestra el modal */
function showModal() {
  const modal = document.getElementById("modal-confirmation");
  const modalContent = modal.querySelector(".modal-confirmation-content");

  modal.classList.remove("hidden");
  modal.classList.add("show");

  // Forzar reflow para animación
  modalContent.offsetHeight;
  modalContent.classList.add("show");
}

/** Oculta el modal */
function hideModal() {
  const modal = document.getElementById("modal-confirmation");
  const modalContent = modal.querySelector(".modal-confirmation-content");

  modalContent.classList.remove("show");
  modal.classList.remove("show");

  setTimeout(() => modal.classList.add("hidden"), 300);
}

/**
 * Carga dinámicamente el HTML del modal desde un partial
 */
export async function loadModal() {
  try {
    const response = await fetch("partials/modal.html");
    const modalHtml = await response.text();
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  } catch (error) {
    console.error(" Error al cargar el modal:", error);
  }
}
