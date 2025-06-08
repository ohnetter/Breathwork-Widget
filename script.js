const circle = document.getElementById("circle");
const pulseRing = document.querySelector(".pulse-ring");
const ripple = document.querySelector(".ripple");
const music = document.getElementById("bg-music");

let isBreathing = false;
let animationTimeouts = [];

const durations = {
  inhale: 4000,
  hold: 7000,
  exhale: 8000,
};

function clearAnimations() {
  animationTimeouts.forEach((timeout) => clearTimeout(timeout));
  animationTimeouts = [];
  circle.style.transform = "scale(1)";
  pulseRing.style.transform = "scale(1)";
}

function startRipple() {
  ripple.classList.add("show");
}

function breatheAnimation() {
  if (!isBreathing) return;

  circle.textContent = "Inhale";
  circle.style.transform = "scale(1.4)";
  pulseRing.style.transform = "scale(1.4)";

  const inhaleTimeout = setTimeout(() => {
    if (!isBreathing) return;

    circle.textContent = "Hold";

    const holdTimeout = setTimeout(() => {
      if (!isBreathing) return;

      circle.textContent = "Exhale";
      circle.style.transform = "scale(1)";
      pulseRing.style.transform = "scale(1)";

      const exhaleTimeout = setTimeout(() => {
        if (!isBreathing) return;

        // Check if music is almost done (within ~5s of end)
        const timeLeft = music.duration - music.currentTime;
        if (timeLeft <= 5) {
          isBreathing = false;
          clearAnimations();
          ripple.classList.remove("show");
          circle.innerHTML = `<span class="stacked">Let<br>calm linger</span>`;

          setTimeout(() => {
            circle.innerHTML = `<span class="stacked">Just<br>Breathe</span>`;
          }, 15000); // Wait 15 seconds before returning to "Just Breathe"
        } else {
          breatheAnimation(); // continue breathing cycle
        }
      }, durations.exhale);

      animationTimeouts.push(exhaleTimeout);
    }, durations.hold);

    animationTimeouts.push(holdTimeout);
  }, durations.inhale);

  animationTimeouts.push(inhaleTimeout);
}

circle.addEventListener("click", () => {
  isBreathing = !isBreathing;

  if (isBreathing) {
    music.play();
    circle.textContent = "Inhale";
    startRipple();
    breatheAnimation();
  } else {
    music.pause();
    music.currentTime = 0;
    clearAnimations();
    ripple.classList.remove("show");
    circle.innerHTML = `<span class="stacked">Just<br>Breathe</span>`;
  }
});
