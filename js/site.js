/* =========================================================
   site.js — builds the shared header/footer and fills in the
   lists from data.js. You shouldn't need to edit this often;
   the menu links are in NAV just below.
   ========================================================= */

// text = the menu button, place = the Kinzville sign shown at the top of that page
const NAV = [
  { page: "home",     text: "Home",     href: "index.html",      place: "the Clubhouse" },
  { page: "webkinz",  text: "Webkinz",  href: "webkinz.html",    place: "the Adoption Center" },
  { page: "research", text: "Research", href: "research.html",   place: "Kinzville Academy" },
  { page: "blog",     text: "Blog",     href: "blog/index.html", place: "Webkinz Newz" },
  { page: "hobbies",  text: "Hobbies",  href: "hobbies.html",    place: "the Curio Shop" },
  { page: "wishlist", text: "Wishlist", href: "wishlist.html",   place: "the Wish Factory" },
];

// Pages in subfolders set data-root="../" (or "../../") on <body> so links still work.
const ROOT = document.body.dataset.root || "";
const CURRENT = document.body.dataset.page || "";

/* ---------- little helpers ---------- */

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]
  ));
}

// Relative links in data.js are written from the site root; fix them up for subfolders.
function url(href) {
  return /^(https?:|mailto:|#|\/)/.test(href) ? href : ROOT + href;
}

function safeUrl(href) {
  const u = String(href ?? "").trim();
  return /^(javascript|data|vbscript):/i.test(u) ? "" : u;
}

function prettyDate(iso) {
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function $(id) { return document.getElementById(id); }

// Small CSV reader that handles quoted cells with commas and line breaks.
function parseCSV(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  const header = (rows.shift() || []).map(h => h.trim().toLowerCase());
  return rows
    .filter(r => r.some(c => c.trim() !== ""))
    .map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

/* ---------- header + footer ---------- */

function renderHeader() {
  const el = $("site-header");
  if (!el) return;
  const buttons = NAV.map(n =>
    `<a class="btn${n.page === CURRENT ? " is-current" : ""}" href="${url(n.href)}"${n.page === CURRENT ? ' aria-current="page"' : ""}>${esc(n.text)}</a>`
  ).join("");
  const place = (NAV.find(n => n.page === CURRENT) || {}).place;
  el.innerHTML = `
    <header class="site-header">
      <a class="logo" href="${url("index.html")}"><span class="star" aria-hidden="true">★</span> ${esc(SITE.name)} <span class="star" aria-hidden="true">★</span></a>
      <p class="tagline">${esc(SITE.tagline)}</p>
      <nav class="nav" aria-label="Main menu">${buttons}</nav>
    </header>
    <div class="ticker" aria-hidden="true"><span>${esc(SITE.ticker)}</span></div>
    ${place ? `<p class="kinz-sign">Welcome to ${esc(place)}!</p>` : ""}`;
}

function renderFooter() {
  const el = $("site-footer");
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      <div class="badges">
        <a class="badge" href="${url("webkinz.html")}">I ♥<br>Webkinz</a>
        <a class="badge" href="${url("blog/index.html")}">read my<br>blog</a>
        <a class="badge" href="${url("research.html")}">research<br>nerd ✨</a>
        <a class="badge" href="${url("wishlist.html")}">gift<br>ideas 🎁</a>
      </div>
      <p>made with ♥ and way too much glitter · ${new Date().getFullYear()}</p>
    </footer>`;
}

/* ---------- sparkle cursor trail ---------- */

function sparkleTrail() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const shapes = ["★", "♥", "✿", "❀", "✦"];
  const colors = ["#ff1493", "#ffd84d", "#ffffff", "#ff8a5c", "#ff8cc6", "#ffb36b"];
  const pick = list => list[Math.floor(Math.random() * list.length)];

  function sparkle(x, y, size, cls, dx, dy) {
    const s = document.createElement("span");
    s.className = cls;
    s.textContent = pick(shapes);
    s.style.left = x + "px";
    s.style.top = y + "px";
    s.style.color = pick(colors);
    s.style.fontSize = size + "px";
    s.style.setProperty("--dx", dx + "px");
    s.style.setProperty("--dy", dy + "px");
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }

  // a trail of tiny stars, hearts and flowers that drift down off the wand tip
  let last = 0;
  document.addEventListener("pointermove", e => {
    if (e.pointerType !== "mouse") return;
    const now = performance.now();
    if (now - last < 40) return;
    last = now;
    sparkle(e.clientX, e.clientY, 10 + Math.random() * 8, "sparkle", (Math.random() - .5) * 24, 18 + Math.random() * 22);
  });

  fireworks();
}

// Every click or tap sets off a little firework: sparks fly out, then fall and fade.
function fireworks() {
  const canvas = document.createElement("canvas");
  canvas.className = "fireworks";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const colors = ["#ff1493", "#ffc400", "#ff6a3d", "#ff5fae", "#09a8ff", "#00c27a", "#b05cff"];
  let sparks = [], running = false, dpr = 1;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
  }
  resize();
  addEventListener("resize", resize);

  function burst(x, y, count, speed, color, life) {
    for (let k = 0; k < count; k++) {
      const angle = (k / count) * Math.PI * 2 + Math.random() * .2;
      const v = speed * (.6 + Math.random() * .5);
      sparks.push({ x, y, px: x, py: y, vx: Math.cos(angle) * v, vy: Math.sin(angle) * v,
        life, age: 0, color: color || colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 1.6, crackle: Math.random() < .25 });
    }
  }

  function frame() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    sparks = sparks.filter(s => s.age < s.life);
    for (const s of sparks) {
      s.px = s.x; s.py = s.y;
      s.vx *= .96; s.vy = s.vy * .96 + .09;   // air drag + gravity
      s.x += s.vx; s.y += s.vy; s.age++;
      const fade = 1 - s.age / s.life;
      const twinkle = s.crackle && s.age > s.life * .5 ? (Math.random() < .5 ? 0 : 1) : 1;
      ctx.globalAlpha = fade * twinkle;
      ctx.strokeStyle = ctx.fillStyle = s.color;
      ctx.shadowColor = s.color === "#ffffff" ? "#ff1493" : "rgba(122, 0, 68, .6)";
      ctx.shadowBlur = 4;
      ctx.lineWidth = s.size;
      ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(s.x, s.y); ctx.stroke();
      ctx.beginPath(); ctx.arc(s.x, s.y, s.size * .9, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (sparks.length) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  document.addEventListener("pointerdown", e => {
    if (e.target.closest("#snowglobe")) return;   // the snowglobe has its own fun
    const main = colors[Math.floor(Math.random() * colors.length)];
    burst(e.clientX, e.clientY, 30, 6.5, main, 70);      // the big ring, one color
    burst(e.clientX, e.clientY, 18, 3.5, null, 55);        // a mixed-color inner ring
    burst(e.clientX, e.clientY, 8, 1.4, "#ffffff", 35);  // a white-hot center
    if (!running) { running = true; requestAnimationFrame(frame); }
  });
}

/* ---------- blog ---------- */

// Who wrote it: a pet's name in "author" shows their picture and a byline.
function authorLine(p) {
  if (!p.author) return "";
  const photo = photoFor({ name: p.author });
  const pic = photo ? `<img class="author-pic" src="${esc(url(photo))}" alt="">` : "✍️";
  return `<span class="author">${pic} by ${esc(p.author)}</span>`;
}

function postItem(p) {
  const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  const series = p.series ? `<span class="series">${esc(p.series)}${p.number ? ` #${esc(p.number)}` : ""}</span> ` : "";
  return `<li>
      <h3>${series}<a href="${esc(url(safeUrl(p.url)))}">${esc(p.title)}</a></h3>
      <div class="meta">${esc(prettyDate(p.date))} ${authorLine(p)} ${tags}</div>
      <p>${esc(p.summary)}</p>
    </li>`;
}

function renderPosts() {
  const all = $("post-list");
  if (all) all.innerHTML = POSTS.length ? POSTS.map(postItem).join("") : "<li>No posts yet, check back soon! ✨</li>";
  // the Connections Collection on the hobbies page (and any other series list)
  document.querySelectorAll("[data-series]").forEach(list => {
    const posts = POSTS.filter(p => p.series === list.dataset.series)
      .sort((a, b) => (Number(a.number) || 0) - (Number(b.number) || 0));
    list.innerHTML = posts.map(postItem).join("") || `<li>${esc(list.dataset.empty || "Nothing here yet ✨")}</li>`;
  });
  const latest = $("latest-posts");
  if (latest) latest.innerHTML = POSTS.slice(0, 3).map(postItem).join("") || "<li>Coming soon ✨</li>";
}

/* ---------- hobbies page shelves ---------- */

function renderCurios() {
  document.querySelectorAll("[data-shelf]").forEach(shelf => {
    const items = CURIOS.filter(c => c.shelf === shelf.dataset.shelf);
    shelf.innerHTML = items.map(c => `<figure>
        ${safeUrl(c.photo) ? `<img src="${esc(url(safeUrl(c.photo)))}" alt="${esc(c.title)}" loading="lazy">` : ""}
        <figcaption><b>${esc(c.title)}</b>${c.note ? `<br>${esc(c.note)}` : ""}</figcaption>
      </figure>`).join("") || `<p>${esc(shelf.dataset.empty)}</p>`;
  });
}

/* ---------- research ---------- */

function renderResearch() {
  const el = $("research-list");
  if (el) {
    el.innerHTML = RESEARCH.map(r => {
      const buttons = [
        ["pdf", "📄 PDF", ""],
        ["doi", "🔗 DOI", "btn-sky"],
        ["link", "✨ More", "btn-peach"],
      ].filter(([key]) => safeUrl(r[key]))
       .map(([key, label, cls]) => `<a class="btn btn-sm ${cls}" href="${esc(url(safeUrl(r[key])))}">${label}</a>`)
       .join("");
      return `<li>
          <h3>${esc(r.title)}</h3>
          <div class="meta"><span class="tag">${esc(r.type)}</span> ${esc(r.authors)} · <em>${esc(r.venue)}</em> · ${esc(r.year)}</div>
          ${r.summary ? `<p>${esc(r.summary)}</p>` : ""}
          ${buttons ? `<div class="actions">${buttons}</div>` : ""}
        </li>`;
    }).join("");
  }
  const prof = $("profile-links");
  if (prof) {
    const labels = { scholar: "🎓 Google Scholar", orcid: "🆔 ORCID", github: "💻 GitHub", cv: "📝 CV" };
    prof.innerHTML = Object.entries(PROFILES)
      .filter(([, href]) => safeUrl(href))
      .map(([key, href]) => `<a class="btn btn-sm btn-peach" href="${esc(url(safeUrl(href)))}">${labels[key] || esc(key)}</a>`)
      .join("");
  }
}

/* ---------- webkinz ---------- */

const GROUP_EMOJI = {
  dog: "🐶", cat: "🐱", dragon: "🐉", prehistoric: "🦕", frog: "🐸", horse: "🐴",
  bird: "🐦", mammal: "🐻", reptile: "🦎", marine: "🐬", bear: "🧸", bunny: "🐰",
};
const SIGN_EMOJI = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

// Turn a row from the Google Sheet (columns like "Pet Name", "Pet Type") into a pet.
// Find a column by any of its likely names (capitals and extra spaces don't matter).
function column(row, ...names) {
  const key = Object.keys(row).find(k => names.includes(k.replace(/\s+/g, " ").trim()));
  return key ? row[key] : "";
}

function petFromSheet(row) {
  return {
    name: column(row, "pet name", "name"),
    type: column(row, "pet type", "type"),
    group: column(row, "pet group", "group"),
    gender: column(row, "gender"),
    birthday: column(row, "birthday", "birth day", "birthdate", "bday"),
    adoptionDay: column(row, "adoption day", "adoption date", "adopted"),
    birthMonth: column(row, "birth month"),
    sign: column(row, "zodiac sign", "sign"),
    element: column(row, "zodiac element", "element"),
    photo: column(row, "photo", "picture"),
  };
}

// A pet's picture: the sheet's Photo column, or PET_PHOTOS in data.js (matched by name).
function photoFor(p) {
  const key = Object.keys(PET_PHOTOS).find(k => k.trim().toLowerCase() === String(p.name).trim().toLowerCase());
  return safeUrl(p.photo || PET_PHOTOS[key]);
}

function petCard(p, isFavorite) {
  const photo = photoFor(p);
  const pic = photo
    ? `<img src="${esc(url(photo))}" alt="${esc(p.name)} the ${esc(p.type)}" loading="lazy">`
    : `<span class="emoji" aria-hidden="true">${GROUP_EMOJI[String(p.group).toLowerCase()] || "🌟"}</span>`;
  const sign = String(p.sign || "").toLowerCase();
  const facts = [
    p.type && `🐾 ${esc(p.type)}`,
    p.gender && `${String(p.gender).toLowerCase() === "girl" ? "♀" : "♂"} ${esc(p.gender)}`,
    (p.birthday || p.adoptionDay) && `🎂 ${esc(p.birthday || p.adoptionDay)}`,
    p.sign && `${SIGN_EMOJI[sign] || "✨"} ${esc(p.sign)}`,
  ].filter(Boolean).map(f => `<li>${f}</li>`).join("");
  return `<div class="pet-card">
      ${isFavorite ? '<span class="ribbon">★ fave</span>' : ""}
      ${pic}
      <h3>${esc(p.name)}</h3>
      <ul class="pet-facts">${facts}</ul>
    </div>`;
}

function renderPetStats(pets) {
  const el = $("pet-stats");
  if (!el) return;
  const count = key => new Set(pets.map(p => p[key]).filter(Boolean)).size;
  const girls = pets.filter(p => String(p.gender).toLowerCase() === "girl").length;
  const boys = pets.filter(p => String(p.gender).toLowerCase() === "boy").length;
  el.innerHTML = [
    [pets.length, "pets adopted"],
    [count("type"), "kinds of pets"],
    [girls, "girls ♀"],
    [boys, "boys ♂"],
  ].map(([n, label]) => `<div class="stat"><b>${n}</b>${label}</div>`).join("");
}

function showPets(pets) {
  const grid = $("pet-grid");
  if (!grid) return;
  const faves = new Set(FAVORITE_PETS);
  const sorted = [...pets].sort((a, b) => faves.has(b.name) - faves.has(a.name));
  grid.innerHTML = sorted.map(p => petCard(p, faves.has(p.name))).join("");
  renderPetStats(pets);
  renderPetCharts(pets);
}

// Load the pets once (from the Google Sheet, or data.js if that fails) and share them.
let petsPromise;
function loadPets() {
  petsPromise ??= (async () => {
    if (PETS_SHEET_ID) {
      const id = encodeURIComponent(PETS_SHEET_ID);
      // The plain CSV export keeps every cell exactly as typed. The gviz link is a backup,
      // told that row 1 is the header (otherwise it sometimes guesses wrong).
      const sources = [
        `https://docs.google.com/spreadsheets/d/${id}/export?format=csv`,
        `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&headers=1`,
      ];
      for (const src of sources) {
        try {
          const res = await fetch(src);
          if (!res.ok) throw new Error(res.status);
          const pets = parseCSV(await res.text()).map(petFromSheet).filter(p => p.name);
          if (pets.length) return pets;
        } catch (err) {
          console.warn("Couldn't load pets from " + src, err);
        }
      }
      console.warn("Couldn't load pets from Google Sheets, using data.js instead.");
    }
    return PETS;
  })();
  return petsPromise;
}

async function renderPets() {
  if (!$("pet-grid")) return;
  showPets(await loadPets());
}

/* ---------- birthday banner (home page) ---------- */

const MONTHS = ["january", "february", "march", "april", "may", "june", "july",
  "august", "september", "october", "november", "december"];

// Understands "June 3", "Jun 3rd", "3 June", "Oct-15", "10/15", "10/15/2009", "10/15/2009 0:00:00"
// and "2009-10-15".
function parseBirthday(text) {
  const t = String(text || "").trim().toLowerCase();
  if (!t) return null;
  let m = t.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return { month: +m[2], day: +m[3] };
  m = t.match(/^(\d{1,2})[\/.-](\d{1,2})(?![\d])/);
  if (m) return { month: +m[1], day: +m[2] };
  const month = MONTHS.findIndex(name => t.includes(name.slice(0, 3))) + 1;
  const day = t.match(/(?:^|[^\d])(\d{1,2})(?:st|nd|rd|th)?(?![\d])/);
  return month && day ? { month, day: +day[1] } : null;
}

// A pet's birthday: the Birthday column when it can be read, otherwise the Adoption Day.
function birthdayOf(p) {
  return parseBirthday(p.birthday) || parseBirthday(p.adoptionDay);
}

// Visit the home page with ?birthdays on the end to see how every birthday was read.
function showBirthdayCheck(el, pets) {
  const rows = pets.map(p => {
    const b = birthdayOf(p);
    return `<tr><td>${esc(p.name)}</td><td>${esc(p.birthday)}</td><td>${esc(p.adoptionDay)}</td>
      <td>${b ? esc(MONTHS[b.month - 1].replace(/^./, c => c.toUpperCase()) + " " + b.day) : "⚠️ couldn't read"}</td></tr>`;
  }).join("");
  el.insertAdjacentHTML("afterend", `<section class="window"><h2 class="window-title">Birthday check</h2>
    <div class="window-body"><table class="check-table"><tr><th>Pet</th><th>Birthday cell</th><th>Adoption Day cell</th><th>Read as</th></tr>${rows}</table></div></section>`);
}

async function renderBirthdays() {
  const el = $("birthday-banner");
  if (!el) return;
  const today = new Date();
  const pets = (await loadPets()).filter(p => {
    const b = birthdayOf(p);
    return b && b.month === today.getMonth() + 1 && b.day === today.getDate();
  });
  if (location.search.includes("birthdays")) showBirthdayCheck(el, await loadPets());
  if (!pets.length) return;
  const names = pets.map(p => esc(p.name));
  const list = names.length === 1 ? names[0] : names.slice(0, -1).join(", ") + " and " + names.at(-1);
  const pics = pets.map(p => {
    const photo = photoFor(p);
    return photo
      ? `<img src="${esc(url(photo))}" alt="${esc(p.name)}">`
      : `<span class="emoji" aria-hidden="true">${GROUP_EMOJI[String(p.group).toLowerCase()] || "🌟"}</span>`;
  }).join("");
  const flags = Array.from({ length: 13 }, (_, k) => `<span class="flag f${k % 5}"></span>`).join("");
  const confetti = Array.from({ length: 24 }, (_, k) =>
    `<i style="left:${(k * 37) % 100}%;animation-delay:${(k * .37) % 3}s;animation-duration:${3 + (k % 4)}s"></i>`).join("");
  el.innerHTML = `
    <section class="bday bday-${esc(SITE.birthdayStyle || "ribbon")}" aria-live="polite">
      <div class="bunting" aria-hidden="true">${flags}</div>
      <div class="confetti" aria-hidden="true">${confetti}</div>
      <div class="ribbon"><span>It's ${pets.length === 1 ? "my" : "our"} birthday!</span></div>
      <div class="birthday-pics">${pics}</div>
      <p class="birthday-text">🎂 Happy birthday, ${list}! 🎂</p>
    </section>`;
}

/* ---------- webkinz charts (built from the same pet list as the cards) ---------- */

const ZODIAC = [
  ["Aries", "fire"], ["Taurus", "earth"], ["Gemini", "air"], ["Cancer", "water"],
  ["Leo", "fire"], ["Virgo", "earth"], ["Libra", "air"], ["Scorpio", "water"],
  ["Sagittarius", "fire"], ["Capricorn", "earth"], ["Aquarius", "air"], ["Pisces", "water"],
];
const ELEMENTS = [
  { key: "fire",  name: "Fire",  icon: "images/icons/fire.gif", color: "#f24000" },
  { key: "earth", name: "Earth", icon: "images/icons/earth.gif", color: "#00a070" },
  { key: "air",   name: "Air",   icon: "images/icons/air.gif", color: "#e09000" },
  { key: "water", name: "Water", icon: "images/icons/water.gif", color: "#007ba5" },
];
const elementOf = sign => (ZODIAC.find(([s]) => s.toLowerCase() === String(sign).trim().toLowerCase()) || [])[1];
const elementInfo = key => ELEMENTS.find(e => e.key === key);
const elementIcon = e => `<img class="el-icon" src="${url(e.icon)}" alt="" aria-hidden="true">`;
const plural = n => `${n} pet${n === 1 ? "" : "s"}`;

// Round the top of the chart up to a tidy number and pick gridline spacing.
function niceScale(max) {
  const step = max <= 5 ? 1 : max <= 10 ? 2 : max <= 25 ? 5 : 10;
  return { top: Math.max(step, Math.ceil(max / step) * step), step };
}

function countBy(pets, keyFn) {
  const counts = new Map();
  pets.forEach(p => {
    const k = keyFn(p);
    if (k) counts.set(k, (counts.get(k) || 0) + 1);
  });
  return counts;
}

function dataTable(caption, rows) {
  return `<details class="chart-table"><summary>See the numbers</summary>
      <table><caption>${esc(caption)}</caption>
        <thead><tr><th scope="col">${esc(rows.head[0])}</th><th scope="col">Pets</th></tr></thead>
        <tbody>${rows.body.map(([k, n]) => `<tr><th scope="row">${esc(k)}</th><td>${n}</td></tr>`).join("")}</tbody>
      </table></details>`;
}

function elementLegend() {
  return `<ul class="legend">${ELEMENTS.map(e =>
    `<li><span class="swatch" style="--c:${e.color}"></span>${elementIcon(e)} ${e.name}</li>`).join("")}</ul>`;
}

function renderSignChart(pets) {
  const el = $("sign-chart");
  if (!el) return;
  const counts = countBy(pets, p => {
    const match = ZODIAC.find(([s]) => s.toLowerCase() === String(p.sign).trim().toLowerCase());
    return match && match[0];
  });
  const { top, step } = niceScale(Math.max(1, ...counts.values()));
  const ticks = [];
  for (let t = 0; t <= top; t += step) ticks.push(`<span class="tick" style="bottom:${t / top * 100}%">${t}</span>`);
  const bars = ZODIAC.map(([sign, elem]) => {
    const n = counts.get(sign) || 0;
    const e = elementInfo(elem);
    return `<div class="bar-col" tabindex="0" data-tip="${sign}: ${plural(n)}" aria-label="${sign}, ${e.name}: ${plural(n)}">
        <div class="bar-track"><div class="bar" style="height:${n / top * 100}%;--c:${e.color}"></div></div>
        <span class="bar-label"><span class="sym" aria-hidden="true">${SIGN_EMOJI[sign.toLowerCase()]}</span><span class="name">${sign}</span></span>
      </div>`;
  }).join("");
  el.innerHTML = `${elementLegend()}
    <div class="column-chart" role="group" aria-label="Number of pets for each zodiac sign">
      <div class="ticks" aria-hidden="true">${ticks.join("")}</div>
      <div class="bars">${bars}</div>
    </div>
    ${dataTable("Pets per zodiac sign", { head: ["Sign"], body: ZODIAC.map(([s]) => [s, counts.get(s) || 0]) })}`;
}

function renderElementChart(pets) {
  const el = $("element-chart");
  if (!el) return;
  const counts = countBy(pets, p => (String(p.element || "").trim().toLowerCase()) || elementOf(p.sign));
  const max = Math.max(1, ...ELEMENTS.map(e => counts.get(e.key) || 0));
  el.innerHTML = `<div class="hbar-chart">${ELEMENTS.map(e => {
      const n = counts.get(e.key) || 0;
      return `<div class="hbar-row" tabindex="0" data-tip="${e.name}: ${plural(n)}">
          <span class="hbar-label">${elementIcon(e)} ${e.name}</span>
          <div class="hbar-track"><div class="hbar" style="width:${n / max * 100}%;--c:${e.color}"></div></div>
          <span class="hbar-value">${n}</span>
        </div>`;
    }).join("")}</div>
    ${dataTable("Pets per zodiac element", { head: ["Element"], body: ELEMENTS.map(e => [e.name, counts.get(e.key) || 0]) })}`;
}

function renderGroupTiles(pets) {
  const el = $("group-tiles");
  if (!el) return;
  const counts = [...countBy(pets, p => String(p.group || "").trim()).entries()].sort((a, b) => b[1] - a[1]);
  el.innerHTML = counts.map(([group, n]) =>
    `<div class="stat"><span class="stat-emoji" aria-hidden="true">${GROUP_EMOJI[group.toLowerCase()] || "🌟"}</span><b>${n}</b>${esc(group)}</div>`
  ).join("") || "<p>Add a group to each pet to see this ✨</p>";
}

function renderPetCharts(pets) {
  renderSignChart(pets);
  renderElementChart(pets);
  renderGroupTiles(pets);
}

/* ---------- wishlist ---------- */

let wishItems = [];

function wishItem(w) {
  const stars = "★".repeat(Math.max(0, Math.min(3, Number(w.priority) || 0)));
  const link = safeUrl(w.link);
  return `<li>
      <h3>${link ? `<a href="${esc(link)}" target="_blank" rel="noopener">${esc(w.item)}</a>` : esc(w.item)}</h3>
      <div class="meta">
        ${w.category ? `<span class="tag">${esc(w.category)}</span>` : ""}
        ${w.price ? `<span class="wish-price">${esc(w.price)}</span>` : ""}
        ${stars ? `<span class="wish-priority" title="how much I want it">${stars}</span>` : ""}
      </div>
      ${w.notes ? `<p>${esc(w.notes)}</p>` : ""}
    </li>`;
}

function showWishes(category) {
  const list = $("wish-list");
  const items = category === "All" ? wishItems : wishItems.filter(w => w.category === category);
  list.innerHTML = items.map(wishItem).join("") || "<li>Nothing here right now ✨</li>";
  document.querySelectorAll(".wish-filters .btn").forEach(b => {
    b.classList.toggle("is-current", b.dataset.cat === category);
    b.setAttribute("aria-pressed", b.dataset.cat === category);
  });
}

async function renderWishlist() {
  if (!$("wish-list")) return;
  wishItems = WISHLIST;
  if (WISHLIST_CSV_URL) {
    try {
      const res = await fetch(WISHLIST_CSV_URL);
      if (!res.ok) throw new Error(res.status);
      wishItems = parseCSV(await res.text()).filter(w => w.item);
    } catch (err) {
      console.warn("Couldn't load the wishlist sheet, using data.js instead.", err);
    }
  }
  wishItems = [...wishItems].sort((a, b) => (Number(b.priority) || 0) - (Number(a.priority) || 0));
  const cats = ["All", ...new Set(wishItems.map(w => w.category).filter(Boolean))];
  const filters = $("wish-filters");
  filters.innerHTML = cats.map(c => `<button type="button" class="btn btn-sm" data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  filters.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (b) showWishes(b.dataset.cat);
  });
  showWishes("All");
}

function renderFavorites() {
  const el = $("favorites");
  if (!el) return;
  el.innerHTML = Object.entries(FAVORITES)
    .filter(([, v]) => v)
    .map(([k, v]) => `<li><b>${esc(k)}:</b> ${esc(v)}</li>`)
    .join("");
}

/* ---------- go! ---------- */

renderHeader();
renderFooter();
sparkleTrail();
renderPosts();
renderResearch();
renderCurios();
renderPets();
renderBirthdays();
renderWishlist();
renderFavorites();
