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
    photo: row["photo"] || "",
  };
}

function petCard(p, isFavorite) {
  const pic = safeUrl(p.photo)
    ? `<img src="${esc(url(safeUrl(p.photo)))}" alt="${esc(p.name)} the ${esc(p.type)}">`
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

function renderDashboard() {
  const frame = $("dashboard");
  if (frame) frame.src = SITE.dashboardUrl;
  const link = $("dashboard-link");
  if (link) link.href = SITE.dashboardUrl;
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
renderDashboard();
renderWishlist();
renderFavorites();
