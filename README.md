# ✨ Vienna's World ✨

My sparkly little corner of the internet: Webkinz, research, blog and wishlist.
Plain HTML/CSS/JS, hosted free on GitHub Pages at **https://vnelmgreen.github.io**.

## Where things live

| I want to… | Edit |
|---|---|
| Add a pet, paper, blog post or wishlist item | `js/data.js` |
| Change colors, fonts, glitter, buttons | `css/style.css` (colors are at the very top) |
| Change the words on a page | that page's `.html` file |
| Change the menu | `NAV` at the top of `js/site.js` |
| Add photos | `images/` (pet photos in `images/pets/`) |
| Add PDFs (papers, CV) | `files/` |

## Writing a blog post

1. Copy `blog/posts/2026-10-13-hello-world.html` and rename it, e.g. `2026-11-01-my-trip.html`.
2. Change the title, date and words.
3. Add it to the top of `POSTS` in `js/data.js`.

## Wishlist from a Google Sheet (optional)

Make a sheet with the columns `item, link, price, category, priority, notes`,
then **File → Share → Publish to web → CSV** and paste the link into
`WISHLIST_CSV_URL` in `js/data.js`. After that, editing the sheet updates the site.

## Webkinz pets

The Webkinz page reads your pets live from the same Google Sheet as the Shiny
dashboard (`PETS_SHEET_ID` in `js/data.js`), and the counts and zodiac
charts are worked out from it automatically, so they stay up to date as you add pets. The sheet needs to be shared as
"anyone with the link can view". Add a `Photo` column (e.g. `images/pets/bubblegum.jpg`)
to show pictures instead of emoji. If the sheet can't load, the `PETS` list is used instead.

## Previewing on your computer

Open the folder in a terminal and run:

```
python3 -m http.server
```

then visit http://localhost:8000. (Double-clicking the HTML files works too,
but the Google Sheet pieces only load through a server.)

## Publishing

Push to `main`. In the repo: **Settings → Pages → Build and deployment →
Deploy from a branch → `main` / `(root)`**. Changes go live in about a minute.
