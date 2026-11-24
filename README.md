# Linda — Lebanese Restaurant

A single-page restaurant website for **Linda Lebanese Restaurant**, built with plain
HTML, CSS and vanilla JavaScript — no frameworks, no build step, no dependencies.

The design keeps the original blue-and-white identity and adds a more polished,
interactive layer: animated dish cards, a dish-detail modal, an optional cedar
cursor, scroll reveals and a validated contact form.

## Features

- **Semantic, accessible markup** — landmarks, a skip link, keyboard-usable
  navigation, visible focus styles, and labelled form fields with linked error
  messages.
- **Dish cards** — six signature dishes. On desktop, hovering lifts the card, zooms
  the photo and reveals a glass overlay with the name, description and price. On
  touch screens the same information is always visible, so nothing depends on hover.
- **Dish modal** — a native `<dialog>` showing the large photo, name, description and
  price. It closes with the button, the Escape key or a click outside, and focus
  returns to the card afterwards. No ingredients are listed, because the menu in the
  project does not document them.
- **Custom cedar cursor** — a small blue cedar mark that reacts over links, buttons
  and cards. Disabled on touch devices, small screens and when the visitor prefers
  reduced motion; the system cursor remains as the fallback.
- **Working navigation** — the header and footer links scroll to the matching
  section, the sticky header never covers a heading, and the active link is
  highlighted while scrolling.
- **Scroll reveals** — IntersectionObserver plus CSS transitions, staggered per card.
  Content is fully visible if JavaScript is disabled or fails to load.
- **Responsive** — one card per row on phones, two on tablets, three on desktop.
- **Reduced-motion support** — smooth scrolling, reveals, the cursor and long
  transitions are switched off for `prefers-reduced-motion: reduce`.

## Technologies

- **HTML5** — semantic sections, `<dialog>`, inline SVG symbols
- **CSS3** — custom properties, grid, flexbox, `clamp()`, `aspect-ratio`,
  `backdrop-filter`, `object-fit`
- **Vanilla JavaScript** — IntersectionObserver, Pointer Events, form validation with
  no libraries
- **Google Fonts** — Bodoni Moda (headings) and Poppins (text)

## Project structure

```
Linda/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
└── images/
    └── optimized/                          (16 web-size JPEGs — the only images the page loads)
```

Everything the page needs is inside `images/optimized/`, about 3 MB in total. The
full-size originals are **not** part of this version and are not needed to run or
deploy the site — keep them somewhere else if you ever want to re-export the photos at
a different size.

## Run it locally

No installation is required.

1. Download or clone the repository.
2. Open `index.html` in a browser.

To match GitHub Pages more closely, serve the folder over HTTP instead:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a repository and push the project:

   ```bash
   git init
   git add .
   git commit -m "Linda Lebanese Restaurant — portfolio version"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`,
   folder **/ (root)**, then **Save**.
4. The site appears at `https://<your-username>.github.io/<repo-name>/` after a
   minute or two.

All asset paths are relative, so the site also works from a sub-folder such as
`/<repo-name>/` without changes.

## Contact form

**The form is a demo.** It validates the input in the browser and then tells the
visitor that nothing was sent. No message leaves the browser — there is no backend
and no email service connected — and the page says so instead of faking a send.

### Adding a real backend later

Pick one of these; the fields stay the same.

- **Formspree / Basin / Getform** — add `action="https://formspree.io/f/<your-id>"`
  and `method="POST"` to the `<form>`, then remove the `preventDefault()` demo branch
  in `script.js` so the browser submits normally.
- **Netlify Forms** — add `data-netlify="true"` to the `<form>` and deploy on Netlify;
  submissions appear in the Netlify dashboard.
- **Your own endpoint** — `fetch()` the values in the submit handler, show a real
  success or error message based on the response, and validate again on the server.

In every case: keep server-side validation, keep the demo notice only while no
endpoint exists, and never store an API key in `script.js`.

## Screenshots

Add images to a `screenshots/` folder and reference them here:

| View | File |
| --- | --- |
| Desktop — hero | `screenshots/desktop-hero.png` |
| Desktop — dish card hover | `screenshots/desktop-cards.png` |
| Mobile — menu | `screenshots/mobile-menu.png` |
| Dish modal | `screenshots/modal.png` |

```markdown
![Desktop hero](screenshots/desktop-hero.png)
```

## Credits

- Food photography belongs to the restaurant owner. This repository includes the
  optimized, web-size copies of the photos, not the full-size originals.
- Fonts are served by Google Fonts under the SIL Open Font License.
- The cedar mark, cursor and icons are hand-written inline SVG — no icon library.
- No CSS or JavaScript libraries are used.

## License

© Linda Restaurant. Code shared for portfolio purposes.
