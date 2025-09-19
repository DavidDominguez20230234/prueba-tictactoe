const sounds = {
  intro: new Audio("../../assets/sounds/intro.mp3"),
  move: new Audio("../../assets/sounds/move.mp3"),
  menuOff: new Audio("../../assets/sounds/menu-off.mp3"),
  menuOn: new Audio("../../assets/sounds/menu-on.mp3"),
  victory: new Audio("../../assets/sounds/victory.mp3"),
  defeat: new Audio("../../assets/sounds/defeat.mp3"),
  tie: new Audio("../../assets/sounds/tie.mp3"),
};

// Función auxiliar para reproducir un sonido
export function playSound(name) {
  const sound = sounds[name];
  if (sound) {
    sound.currentTime = 0; // Reinicia desde el inicio
    sound.play();
  }
}
