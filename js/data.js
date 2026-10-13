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
};

/* ---------- Webkinz ----------
   The Webkinz page first tries to load every pet straight from your
   Google Sheet, and the zodiac
   charts and counts are worked out from it automatically. If that
   ever fails, it shows the PETS list below instead.
   Set PETS_SHEET_ID to "" to only use the list below. */
const PETS_SHEET_ID = "12-oEkPssDf0Qojl0aef_c2Z426LhV9ThtyhoNF3UV4g";

// Pictures for your pets: "Pet Name": "images/pets/file-name".
// Put the picture files in the images/pets/ folder. (A "Photo" column in
// your Google Sheet works too, and wins if both are set.)
const PET_PHOTOS = {
  "Bubble Gum": "images/pets/bubblegum.webp",
};

// Pets to spotlight at the top of the Webkinz page (use their exact names).
const FAVORITE_PETS = [];

const PETS = [
  // These are examples. Replace them with your real pets.
  { name: "Bubble Gum", type: "Pink Poodle",    group: "Dog",    gender: "girl", birthday: "June 3",   sign: "Gemini", photo: "" },
  { name: "Sir Purrcy", type: "Persian Cat",    group: "Cat",    gender: "boy",  birthday: "July 28",  sign: "Leo",    photo: "" },
  { name: "Glimmer",    type: "Sparkle Dragon", group: "Dragon", gender: "girl", birthday: "March 14", sign: "Pisces", photo: "" },
];

/* ---------- Research ----------
   Leave a link as "" and its button won't show. */
const RESEARCH = [
  {
    title: "An interactive dashboard for global reports on the Ralstonia solanacearum species complex",
    authors: "Elmgreen VN, Ramirez B​, Sharma R, Vinatzer BA, Lowe-Power​ TM, and Pierce-Ward NT",
    venue: "Access Microbiology",
    year: 2025,
    type: "Article",            // Article, Poster, Talk, Thesis, Preprint…
    summary: "We developed an interactive dashboard designed to allow users to explore the diversity and biogeography of the RSSC. The dashboard visualizes data in the form of maps, charts, and tables, with a variety of user-interactive filters for taxonomic, geographic, and host of isolation specifications.",
    pdf: "",
    doi: "https://doi.org/10.1099/acmi.0.001126.v3",                    // e.g. "https://doi.org/10.xxxx/xxxxx"
    link: "https://ralstoniadashboard.shinyapps.io/RalstoniaWiltDashboard/",                   // anything else: slides, code, news story
  },
  {
    title: "Ralstonia Wilt Dashboard",
    authors: "Elmgreen VN, Lowe-Power​ TM, and Pierce-Ward NT",
    venue: "shinyapps.io",
    year: 2025,
    type: "Dashboard",
    summary: "An interactive dashboard for global reports on the RSSC",
    pdf: "",
    doi: "https://doi.org/10.5281/zenodo.16945323",
    link: "https://ralstoniadashboard.shinyapps.io/RalstoniaWiltDashboard/",
  },
  {
    title: "Investigating the Host Range and Genetic Diversity of the Ralstonia solanacearum Species Complex",
    authors: "Elmgreen VN",
    venue: "California Digital Library, University of California",
    year: 2025,
    type: "MS Thesis",
    summary: "The Ralstonia solanacearum species complex (RSSC) is a globally distributed group of gram negative, soil-borne bacteria that cause bacterial wilt disease on a broad range of plant species. Through four distinct projects, I investigated the genetic diversity, host range, and distribution of the RSSC and genes involved in their interactions with plants.",
    pdf: "",
    doi: "",
    link: "https://escholarship.org/uc/item/3fj3h6c2",
  }, 
  {
    title: "Genome Resource Announcement of 19 Tanzanian Phylotype I Ralstonia pseudosolanacearum Draft Genomes",
    authors: "Elmgreen VN, Kanyagha H, Cellier G, Bains S, Green S, Hayes L, Lemus LM, Prasad N, Ramirez B, Vo V, Cowell T, Miller SA, and Lowe-Power​ TM",
    venue: "PhytoFrontiers",
    year: 2025,
    type: "Article",
    summary: "Tomato is a widely cultivated and economically important crop in Tanzania, but bacterial wilt disease caused by the RSSC has become one of the most devastating diseases in tomato-producing regions in Tanzania. To investigate the genomic diversity of RSSC strains isolated from Tanzania, we generated draft genomes of 19 Ralstonia isolates from five villages in four regions.",
    pdf: "",
    doi: "https://doi.org/10.1094/PHYTOFR-11-24-0126-A",
    link: "",
  }, 
  {
    title: "Microbial partner (MiPner) analysis",
    authors: "Bennetzen JL, Fernandez-Canela J, Elmgreen VN, McCann SR, Norris ME, Deng X, and Brailey-Crane P",
    venue: "Frontiers in Microbiomes",
    year: 2025,
    type: "Article",
    summary: "Although a few bacteria have been studied in great depth, relatively little is known about the characteristics of microbe-microbe interactions that occur within ecosystems on a daily basis. A simple, robust technique was developed to set up the foundation for investigating pairwise bacterial-bacterial interactions, using cell-cell binding as a self-selective mechanism to identify interesting bacterial species pairs.",
    pdf: "",
    doi: "https://doi.org/10.3389/frmbi.2024.1500798",
    link: "",
  },
  {
    title: "A Meta-analysis of the known Global Distribution and Host Range of the Ralstonia Species Complex",
    authors: "Lowe-Power​ TM, Avalos J, Bai Y, Munoz MC, Chipman K, Elmgreen VN, Prasad N, Ramirez B, Sandhar A, Tom CE, and Williams D",
    venue: "bioRxiv",
    year: 2020,
    type: "Article",
    summary: "The Ralstonia species complex is a group of genetically diverse plant wilt pathogens. Our goal is to create a database that contains the reported global distribution and host range of Ralstonia clades (e.g. phylotypes and sequevars).",
    pdf: "",
    doi: "https://doi.org/10.1101/2020.07.13.189936",
    link: "",
  },
];

// Profile links shown at the top of the research page ("" hides one).
const PROFILES = {
  scholar: "",   // Google Scholar profile URL
  orcid: "https://orcid.org/0009-0004-5441-6885",     // e.g. "https://orcid.org/0000-0000-0000-0000"
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
  "Favorite colors": "pink, orange, and gold",
  "Favorite snacks": "",
  "Favorite stores": "",
  "Shirt size": "",
  "Shoe size": "",
};
