/* =========================================================
   site.js — builds the shared header/footer and fills in the
   lists from data.js. You shouldn't need to edit this often;
   the menu links are in NAV just below.
   ========================================================= */

const NAV = [
  { page: "home",     text: "Home",     href: "index.html" },
  { page: "webkinz",  text: "Webkinz",  href: "webkinz.html" },
  { page: "research", text: "Research", href: "research.html" },
  { page: "blog",     text: "Blog",     href: "blog/index.html" },
  { page: "wishlist", text: "Wishlist", href: "wishlist.html" },
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
  el.innerHTML = `
    <header class="site-header">
      <a class="logo" href="${url("index.html")}"><span class="star" aria-hidden="true">★</span> ${esc(SITE.name)} <span class="star" aria-hidden="true">★</span></a>
      <p class="tagline">${esc(SITE.tagline)}</p>
      <nav class="nav" aria-label="Main menu">${buttons}</nav>
    </header>
    <div class="ticker" aria-hidden="true"><span>${esc(SITE.ticker)}</span></div>`;
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
  const shapes = ["✦", "✧", "★", "♥", "·"];
  const colors = ["#ff1493", "#ffd84d", "#ffffff", "#c9a7ff", "#ff8cc6"];
  let last = 0;
  document.addEventListener("pointermove", e => {
    const now = performance.now();
    if (now - last < 45) return;
    last = now;
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    s.style.left = e.clientX + "px";
    s.style.top = e.clientY + "px";
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.fontSize = 10 + Math.random() * 12 + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 800);
  });
}

/* ---------- blog ---------- */

function postItem(p) {
  const tags = (p.tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join("");
  return `<li>
      <h3><a href="${esc(url(safeUrl(p.url)))}">${esc(p.title)}</a></h3>
      <div class="meta">${esc(prettyDate(p.date))} ${tags}</div>
      <p>${esc(p.summary)}</p>
    </li>`;
}

function renderPosts() {
  const all = $("post-list");
  if (all) all.innerHTML = POSTS.length ? POSTS.map(postItem).join("") : "<li>No posts yet, check back soon! ✨</li>";
  const latest = $("latest-posts");
  if (latest) latest.innerHTML = POSTS.slice(0, 3).map(postItem).join("") || "<li>Coming soon ✨</li>";
}

/* ---------- research ---------- */

function renderResearch() {
  const el = $("research-list");
  if (el) {
    el.innerHTML = RESEARCH.map(r => {
      const buttons = [
        ["pdf", "📄 PDF", ""],
        ["doi", "🔗 DOI", "btn-sky"],
        ["link", "✨ More", "btn-lilac"],
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
      .map(([key, href]) => `<a class="btn btn-sm btn-lilac" href="${esc(url(safeUrl(href)))}">${labels[key] || esc(key)}</a>`)
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
function petFromSheet(row) {
  return {
    name: row["pet name"],
    type: row["pet type"],
    group: row["pet group"],
    gender: row["gender"],
    birthday: row["birthday"] || [row["birth month"]].filter(Boolean).join(" "),
    sign: row["zodiac sign"],
    element: row["zodiac element"],
    photo: row["photo"] || "",
  };
}

function petCard(p, isFavorite) {
  const photoKey = Object.keys(PET_PHOTOS).find(k => k.trim().toLowerCase() === String(p.name).trim().toLowerCase());
  const photo = safeUrl(p.photo || PET_PHOTOS[photoKey]);
  const pic = photo
    ? `<img src="${esc(url(photo))}" alt="${esc(p.name)} the ${esc(p.type)}" loading="lazy">`
    : `<span class="emoji" aria-hidden="true">${GROUP_EMOJI[String(p.group).toLowerCase()] || "🌟"}</span>`;
  const sign = String(p.sign || "").toLowerCase();
  const facts = [
    p.type && `🐾 ${esc(p.type)}`,
    p.gender && `${String(p.gender).toLowerCase() === "girl" ? "♀" : "♂"} ${esc(p.gender)}`,
    p.birthday && `🎂 ${esc(p.birthday)}`,
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

async function renderPets() {
  if (!$("pet-grid")) return;
  if (PETS_SHEET_ID) {
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/${encodeURIComponent(PETS_SHEET_ID)}/gviz/tq?tqx=out:csv`);
      if (!res.ok) throw new Error(res.status);
      const pets = parseCSV(await res.text()).map(petFromSheet).filter(p => p.name);
      if (pets.length) return showPets(pets);
    } catch (err) {
      console.warn("Couldn't load pets from Google Sheets, using data.js instead.", err);
    }
  }
  showPets(PETS);
}

/* ---------- webkinz charts (built from the same pet list as the cards) ---------- */

const ZODIAC = [
  ["Aries", "fire"], ["Taurus", "earth"], ["Gemini", "air"], ["Cancer", "water"],
  ["Leo", "fire"], ["Virgo", "earth"], ["Libra", "air"], ["Scorpio", "water"],
  ["Sagittarius", "fire"], ["Capricorn", "earth"], ["Aquarius", "air"], ["Pisces", "water"],
];
const ELEMENTS = [
  { key: "fire",  name: "Fire",  emoji: "🔥", color: "#f24000" },
  { key: "earth", name: "Earth", emoji: "🌱", color: "#00a070" },
  { key: "air",   name: "Air",   emoji: "🌬️", color: "#e09000" },
  { key: "water", name: "Water", emoji: "💧", color: "#007ba5" },
];
const elementOf = sign => (ZODIAC.find(([s]) => s.toLowerCase() === String(sign).trim().toLowerCase()) || [])[1];
const elementInfo = key => ELEMENTS.find(e => e.key === key);
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
    `<li><span class="swatch" style="--c:${e.color}"></span>${e.emoji} ${e.name}</li>`).join("")}</ul>`;
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
          <span class="hbar-label">${e.emoji} ${e.name}</span>
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
renderPets();
renderWishlist();
renderFavorites();
