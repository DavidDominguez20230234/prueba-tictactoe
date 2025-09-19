import { playSound } from "../utils/sounds.js";
export function startLoading(callback) {
  const progressBar = document.querySelector(".progress-bar");
  let progress = 0;

  const interval = setInterval(() => {
    progress += 5;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(interval);
      if (callback) {
        playSound("intro");
        callback();
      }
    }
  }, 100);
}
