/* =========================================================
   ✨ data.js — the file you'll edit most ✨
   Add pets, papers, blog posts and wishlist items here.
   Each list is just copy-paste-an-entry-and-change-it.
   Watch your commas: every entry ends with "},"
   ========================================================= */

const SITE = {
  name: "Vienna's World",
  tagline: "pets ♥ research ♥ thoughts ♥ wishes",
  // the scrolling message under the menu
  ticker: "✨ Welcome to my little corner of the internet! ✨ Say hi to my Webkinz ♥ Check out my research ♥ Peek at my wishlist before birthdays 🎁 ✨",
  // your Shiny dashboard (shown on the Webkinz page)
  dashboardUrl: "https://viennaelmgreen.shinyapps.io/Webkinz/",
};

/* ---------- Webkinz ----------
   The Webkinz page first tries to load every pet straight from your
   Google Sheet (the same one the Shiny dashboard reads). If that
   ever fails, it shows the PETS list below instead.
   Set PETS_SHEET_ID to "" to only use the list below. */
const PETS_SHEET_ID = "1qV1gZpJbnjeP6cPLxpVRqQSA2jTnBP8aPhSSSwzpEDU";

// Pets to spotlight at the top of the Webkinz page (use their exact names).
const FAVORITE_PETS = [];

const PETS = [
  // These are examples. Replace them with your real pets.
  { name: "Bubblegum",  type: "Pink Poodle",    group: "Dog",    gender: "girl", birthday: "June 3",   sign: "Gemini", photo: "" },
  { name: "Sir Purrcy", type: "Persian Cat",    group: "Cat",    gender: "boy",  birthday: "July 28",  sign: "Leo",    photo: "" },
  { name: "Glimmer",    type: "Sparkle Dragon", group: "Dragon", gender: "girl", birthday: "March 14", sign: "Pisces", photo: "" },
  // photo: "images/pets/bubblegum.jpg"  ← put pictures in images/pets/
];

/* ---------- Research ----------
   Leave a link as "" and its button won't show. */
const RESEARCH = [
  {
    title: "Title of your paper goes here",
    authors: "Elmgreen V, Coauthor A, Coauthor B",
    venue: "Journal Name",
    year: 2025,
    type: "Article",            // Article, Poster, Talk, Thesis, Preprint…
    summary: "One or two friendly sentences about what you found, for family who aren't in your field.",
    pdf: "",
    doi: "",                    // e.g. "https://doi.org/10.xxxx/xxxxx"
    link: "",                   // anything else: slides, code, news story
  },
  {
    title: "Webkinz dashboard: an interactive look at my pet collection",
    authors: "Elmgreen V",
    venue: "shinyapps.io",
    year: 2025,
    type: "Project",
    summary: "An R Shiny dashboard of my Webkinz by zodiac sign, element and pet group.",
    pdf: "",
    doi: "",
    link: "https://viennaelmgreen.shinyapps.io/Webkinz/",
  },
];

// Profile links shown at the top of the research page ("" hides one).
const PROFILES = {
  scholar: "",   // Google Scholar profile URL
  orcid: "",     // e.g. "https://orcid.org/0000-0000-0000-0000"
  github: "https://github.com/vnelmgreen",
  cv: "",        // e.g. "files/cv.pdf"
};

/* ---------- Blog ----------
   1. Copy blog/posts/2026-10-13-hello-world.html to a new file
   2. Write your post in it
   3. Add an entry here (newest first) */
const POSTS = [
  {
    title: "Hello, world! ✨",
    date: "2026-10-13",
    url: "blog/posts/2026-10-13-hello-world.html",
    summary: "My website is alive! Here's what you'll find around here.",
    tags: ["life"],
  },
];

/* ---------- Wishlist ----------
   Option A (easiest to keep updated): make a Google Sheet with the columns
     item | link | price | category | priority | notes
   then File → Share → Publish to web → CSV, and paste that link below.
   Option B: leave WISHLIST_CSV_URL as "" and edit the WISHLIST list instead.
   priority: 3 = really want, 2 = would love, 1 = nice to have */
const WISHLIST_CSV_URL = "";

const WISHLIST = [
  { item: "A new Webkinz plush (any pink one!)", link: "", price: "$15", category: "Webkinz", priority: 3, notes: "Check my Webkinz page so you don't get one I already have" },
  { item: "Cozy fuzzy socks",                    link: "", price: "$10", category: "Cozy",    priority: 2, notes: "" },
  { item: "A book you loved",                    link: "", price: "",    category: "Books",   priority: 1, notes: "Write a note inside the cover!" },
];

// The "cheat sheet" box on the wishlist page. Delete anything you'd rather not share.
const FAVORITES = {
  "Favorite colors": "pink, sparkly pink, and lilac",
  "Favorite snacks": "",
  "Favorite stores": "",
  "Shirt size": "",
  "Shoe size": "",
};
