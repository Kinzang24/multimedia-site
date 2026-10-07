/* Chime button (plays the same audio file from the start) */
const player = document.getElementById("player");
document.getElementById("playNote").addEventListener("click", () => {
  player.currentTime = 0;
  player.play();
});

/* Interactive canvas */
const cv = document.getElementById("cv"), ctx = cv.getContext("2d");
let hue = 180, parts = [];
function resize() { cv.width = cv.clientWidth; cv.height = cv.clientHeight; }
addEventListener("resize", resize); resize();

function spawn(x, y, count = 3, speed = 2) {
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2, s = Math.random() * speed;
    parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 60, h: hue });
  }
  hue = (hue + 4) % 360;
}
function pos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }

cv.addEventListener("pointermove", e => spawn(...pos(e)));
cv.addEventListener("pointerdown", e => spawn(...pos(e), 60, 6));
document.getElementById("clear").addEventListener("click", () => { hue = 180; parts = []; });

(function loop() {
  ctx.fillStyle = "rgba(18,48,58,.25)";
  ctx.fillRect(0, 0, cv.width, cv.height);
  parts = parts.filter(p => p.life > 0);
  parts.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life--;
    ctx.fillStyle = `hsla(${p.h},90%,60%,${p.life / 60})`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill();
  });
  requestAnimationFrame(loop);
})();
