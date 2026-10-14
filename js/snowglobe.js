/* =========================================================
   snowglobe.js — the shakeable snowglobe glitter jar on the
   hobbies page. Drag across it (or press the button) to shake;
   the glitter swirls through the "liquid" and slowly settles.
   Change GLITTER_COLORS or FLAKES below to restyle it.
   ========================================================= */

(function () {
  const canvas = document.getElementById("snowglobe");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const GLITTER_COLORS = ["#ff1493", "#ff5fae", "#ffb3d9", "#ffd84d", "#ffc400", "#ff8a5c", "#ffffff", "#c9a7ff"];
  const FLAKES = 650;

  // geometry (in canvas units; the canvas is scaled with CSS)
  const W = 340, H = 378;
  const cx = W / 2, cy = 170, R = 150;          // the glass globe
  const inner = R - 8;                          // where glitter bounces off the glass

  // sharp drawing on high-resolution screens
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const flakes = Array.from({ length: FLAKES }, () => {
    const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * inner;
    return {
      x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d,
      vx: 0, vy: 0,
      size: 2 + Math.random() * 3.2,
      color: GLITTER_COLORS[Math.floor(Math.random() * GLITTER_COLORS.length)],
      spin: Math.random() * Math.PI, spinSpeed: (Math.random() - .5) * .3,
      sink: .008 + Math.random() * .012,      // heavier flakes settle faster
    };
  });

  let running = false;

  function stir(strength, dirX = 0, dirY = 0) {
    for (const f of flakes) {
      // a swirl around the centre plus a push in the shake direction
      const dx = f.x - cx, dy = f.y - cy;
      f.vx += -dy * .02 * strength + dirX * (.5 + Math.random()) + (Math.random() - .5) * strength * 2;
      f.vy += dx * .02 * strength + dirY * (.5 + Math.random()) + (Math.random() - .5) * strength * 2 - strength;
    }
    start();
  }

  function step() {
    let moving = 0;
    for (const f of flakes) {
      f.vx *= .975; f.vy *= .975;               // the liquid slows everything down
      f.vy += f.sink;                            // …and gravity slowly pulls it down
      f.x += f.vx; f.y += f.vy;
      f.spin += f.spinSpeed * (Math.abs(f.vx) + Math.abs(f.vy) + .05);
      // stay inside the glass, sliding along it
      const dx = f.x - cx, dy = f.y - cy, d = Math.hypot(dx, dy);
      if (d > inner) {
        const nx = dx / d, ny = dy / d;
        f.x = cx + nx * inner; f.y = cy + ny * inner;
        const dot = f.vx * nx + f.vy * ny;
        if (dot > 0) { f.vx -= 1.6 * dot * nx; f.vy -= 1.6 * dot * ny; }
      }
      if (Math.abs(f.vx) + Math.abs(f.vy) > .03) moving++;
    }
    return moving;
  }

  function drawGlobe() {
    ctx.clearRect(0, 0, W, H);

    // base
    const baseTop = cy + R - 22;
    ctx.fillStyle = "#8a0050";
    roundRect(cx - 112, baseTop, 224, 74, 18); ctx.fill();
    const bg = ctx.createLinearGradient(0, baseTop, 0, baseTop + 70);
    bg.addColorStop(0, "#ff8cc6"); bg.addColorStop(.55, "#ff1493"); bg.addColorStop(1, "#c2006b");
    ctx.fillStyle = bg;
    roundRect(cx - 106, baseTop + 4, 212, 62, 14); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.45)";
    roundRect(cx - 92, baseTop + 9, 184, 10, 5); ctx.fill();
    ctx.fillStyle = "#fcee56";
    ctx.font = "800 20px Dosis, 'Trebuchet MS', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("★ shake me! ★", cx, baseTop + 50);

    // liquid inside the glass
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    const lg = ctx.createRadialGradient(cx - 40, cy - 50, 20, cx, cy, R);
    lg.addColorStop(0, "#fff0f7"); lg.addColorStop(.6, "#ffd6ea"); lg.addColorStop(1, "#ffb3a0");
    ctx.fillStyle = lg;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

    // a little snowy hill with a star on top
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(cx, cy + R - 10, R * .85, 44, 0, Math.PI, 0);
    ctx.fill();
    drawStar(cx, cy + R - 74, 22, 9, "#ffd84d", "#8a0050");

    // glitter
    for (const f of flakes) {
      const glint = .55 + .45 * Math.abs(Math.cos(f.spin));     // flakes catch the light as they turn
      ctx.globalAlpha = glint;
      ctx.fillStyle = f.color;
      ctx.save();
      ctx.translate(f.x, f.y); ctx.rotate(f.spin);
      ctx.fillRect(-f.size / 2, -f.size * .35, f.size, f.size * .7);
      ctx.restore();
      if (glint > .97 && f.size > 3) {                            // the odd sparkle
        ctx.globalAlpha = 1; ctx.fillStyle = "#ffffff";
        ctx.fillRect(f.x - .6, f.y - 3, 1.2, 6); ctx.fillRect(f.x - 3, f.y - .6, 6, 1.2);
      }
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // glass outline + shine
    ctx.lineWidth = 6; ctx.strokeStyle = "#8a0050";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 3; ctx.strokeStyle = "rgba(255,255,255,.9)";
    ctx.beginPath(); ctx.arc(cx, cy, R - 6, Math.PI * 1.08, Math.PI * 1.42); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.beginPath(); ctx.ellipse(cx - 70, cy - 78, 18, 32, -.6, 0, Math.PI * 2); ctx.fill();
  }

  function drawStar(x, y, r1, r2, fill, stroke) {
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const r = k % 2 ? r2 : r1, a = -Math.PI / 2 + k * Math.PI / 5;
      ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
    }
    ctx.closePath();
    ctx.fillStyle = fill; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = stroke; ctx.stroke();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function loop() {
    const moving = step();
    drawGlobe();
    if (moving > 4) requestAnimationFrame(loop);
    else running = false;                       // everything has settled: rest
  }
  function start() {
    if (!running) { running = true; requestAnimationFrame(loop); }
  }

  // shaking: dragging across the globe pushes the glitter that way
  let last = null;
  canvas.addEventListener("pointerdown", e => { last = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); stir(1.2); });
  canvas.addEventListener("pointermove", e => {
    if (!last) return;
    const dx = e.clientX - last.x, dy = e.clientY - last.y;
    last = { x: e.clientX, y: e.clientY };
    if (Math.abs(dx) + Math.abs(dy) > 2) stir(.35, Math.max(-3, Math.min(3, dx * .12)), Math.max(-3, Math.min(3, dy * .12)));
  });
  ["pointerup", "pointercancel"].forEach(t => canvas.addEventListener(t, () => { last = null; }));

  const button = document.getElementById("shake-globe");
  if (button) button.addEventListener("click", () => {
    stir(2.2);
    canvas.classList.remove("wobble"); void canvas.offsetWidth; canvas.classList.add("wobble");
  });

  // start with a gentle swirl so there's something to watch right away
  drawGlobe();
  stir(1.6);
})();
