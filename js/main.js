function openGame(game) {
  window.location.href = "game.html?game=" + encodeURIComponent(game);
}

const slides = document.querySelectorAll(".slide");
const dotsWrap = document.getElementById("dots");
let current = 0;
let timer = null;

function renderDots(){
  if(!dotsWrap || !slides.length) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === current ? " active" : "");
    d.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(d);
  });
}

function goTo(i, resetTimer){
  if(!slides.length) return;
  slides[current].classList.remove("active");
  current = i;
  slides[current].classList.add("active");
  renderDots();
  if(resetTimer) restartAuto();
}

function next(){
  if(!slides.length) return;
  goTo((current + 1) % slides.length, false);
}

function prev(){
  if(!slides.length) return;
  goTo((current - 1 + slides.length) % slides.length, false);
}

function restartAuto(){
  clearInterval(timer);
  if(slides.length) timer = setInterval(next, 3000);
}

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
if(nextBtn) nextBtn.addEventListener("click", () => { next(); restartAuto(); });
if(prevBtn) prevBtn.addEventListener("click", () => { prev(); restartAuto(); });

renderDots();
restartAuto();