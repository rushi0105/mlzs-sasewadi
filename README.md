# Mount Litera Zee School, Sasewadi

A hand-built, static website for Mount Litera Zee School, Sasewadi, Hingoli. No framework, no build step, no dependencies. Open `index.html` and the site works.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home: hero, school facts, introduction, programmes, day-to-day, campus, admissions panel |
| `about.html` | Story, values and the six capabilities behind the curriculum |
| `academics.html` | Nursery to Grade 10, assessment, senior years, learning support |
| `campus.html` | Grounds gallery, facilities, the school year, a normal day |
| `admissions.html` | Process, enquiry form, documents, FAQ |
| `contact.html` | Phone, WhatsApp, address, map, directions, direct message form |

## Running it locally

Double-clicking `index.html` works. If you want a local server (recommended when testing the form and fonts):

```bash
cd mlzs-sasewadi
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Structure

```
mlzs-sasewadi/
  index.html
  about.html
  academics.html
  campus.html
  admissions.html
  contact.html
  favicon.svg
  README.md
  assets/
    css/styles.css      Design tokens, layout, components, responsive rules
    js/main.js          Navigation, reveals, form, lightbox
    fonts/              Newsreader and Manrope, self-hosted woff2
    img/                Representative photography
```

The header and footer are repeated in each page on purpose. There is no templating layer to install or maintain. If you change the phone number or navigation, update all six files.

## The enquiry form

There is no backend. A valid form builds a prefilled WhatsApp message to **+91 77439 32164** and opens it in a new tab. The visitor can edit and send it themselves. If the popup is blocked, the page shows a direct link to the same WhatsApp message plus the phone number.

This is deliberate: it is honest about what happens, it works on a static host, and the school office receives enquiries in the app it already uses.

### Switching to a real form endpoint

If you later want enquiries by email or in a database, point the form at a service such as Formspree, Basin or Netlify Forms:

1. Add `action` and `method` attributes to each `<form data-enquiry-form>` in `admissions.html` and `contact.html`.
2. In `assets/js/main.js`, replace the `window.open(whatsappUrl, ...)` block in the submit handler with a `fetch()` POST to your endpoint.
3. Keep the same validation and status message. Report success and failure separately.
4. Test with a real submission before publishing.

Do not add a fake "message sent" confirmation unless the message is actually sent.

## Photography

The three `school-building*.jpg` files are cropped and colour-graded from the school's own Google Maps listing. They show the real building, entrance and buses, and are used on the home campus section, the campus hero, the about story and the contact map card.

The remaining child, teacher and classroom images are representative stock from Pexels. Replace them with photographs from the school's own album before launch. Keep the filenames, or update the `src` values, and keep roughly the same aspect ratio so the layout does not shift.

| File | Used for | Suggested replacement |
| --- | --- | --- |
| `school-building.jpg` | Home campus, campus hero, social preview | A sharp, current exterior from the school |
| `school-building-portrait.jpg` | About story | The entrance or a recognisable corner of the campus |
| `school-building-wide.jpg` | Contact map card | The front of the school with the buses |
| `why-girl.jpg` | Home hero, square | A current student, portrait or square |
| `hero-children.jpg` | Home hero inset, portrait | Children working together, portrait crop |
| `about-teacher.jpg` | Home intro, admissions hero | A teacher with students, landscape |
| `culture.jpg` | About hero, campus section | A school celebration or assembly, portrait |
| `campus-sports.jpg` | Campus gallery | The real ground or a match |
| `campus-digital.jpg` | Home campus grid, gallery | The computer room in use |
| `early-years.jpg` | Home campus grid, gallery | The early years room |
| `community.jpg` | Home bento, gallery | A gathering, performance or assembly |
| `academics-primary.jpg` | Academics support section | A primary classroom |
| `academics-senior.jpg` | Academics senior section | A senior classroom |
| `hero-map.jpg` | Academics hero | A lesson in progress |

Stock photos are free to use under the Pexels license, but they are not a substitute for photographs of the real school. Parents notice. The Google Maps images are low resolution; ask the school for the original files before printing or using them at full width.

## Content to verify before launch

The site is written to be accurate and restrained, but these details came from a public listing or are standard school practice. Confirm each one with the school office:

- **Admissions year.** The site says 2026-27 in the top bar, hero-adjacent copy and admissions page. Change if the cycle is different.
- **Class range.** The site says Nursery to Grade 10. Confirm the highest class currently running.
- **Facilities.** Library, science and maths rooms, digital learning, art and music, first aid. Remove anything the school does not have.
- **Daily routine.** Assembly, lesson pattern and dismissal described on `campus.html`.
- **Documents list.** Birth certificate, transfer certificate, address proof, photographs, immunisation record.
- **Transport.** The FAQ deliberately avoids promising a route. Replace with the real policy if transport is offered.
- **Fees.** Not published. The FAQ directs parents to the office for a written schedule. Keep it that way unless the school wants fees online.
- **Office hours.** "Opens at 7:00 am" comes from the public listing. Add closing times and weekly holidays if useful.
- **Website link.** The footer points to `mountlitera.com`, the network site. Change it if the school has its own domain.
- **Plus code.** P46W+H5 Sasewadi, Maharashtra, from the public listing.

Nothing on the site invents fees, results, student counts, staff names, affiliations or parent testimonials. Please keep it that way. A short honest site outperforms a longer invented one.

## Design system

Everything lives in `assets/css/styles.css` under `:root`.

- Cream `#f5f2ea`, deep green `#12472e`, darker green `#0c2c1f`, mint `#009d65`, ember `#d98a2b`, ink `#11231b`
- Display: Newsreader, with italic phrases for emphasis. UI and body: Manrope. Both self-hosted, preloaded, `font-display: swap`.
- Radial scale: 0. Every card, input, button and image is square. Depth comes from 1px hairlines (`--line`, `--line-strong`) and full-bleed photography, never from shadows.
- Editorial layout: full-bleed image heroes, 90px-scale display type, hairline-divided grids instead of floating cards.
- One accent, one theme, no dark mode.
- Motion is limited to a short reveal, a header hairline and hover transitions. `prefers-reduced-motion` disables all of it.
- The hero title uses `text-wrap: balance`; body copy is capped at readable measures.

## Accessibility

- Skip link on every page.
- Visible focus rings, including on form fields.
- Mobile menu: `aria-expanded`, focus moved into the panel, focus trapped, Escape closes, background scroll locked.
- Gallery: native `<dialog>` lightbox with a labelled close button and focus restoration.
- Accordions and FAQ use native `<details>` and `<summary>`.
- Form errors are announced inline, tied to inputs with `aria-describedby`, and the status message uses `role="status"`.
- Colour contrast is designed for WCAG AA. Recheck if you change the palette.
- Decorative images have empty or descriptive alt text as appropriate. Replace alt text along with photographs.

## Performance notes

- No JavaScript libraries, no web fonts from a third party, no analytics.
- Fonts are preloaded; images below the fold use `loading="lazy"`.
- The header state uses `IntersectionObserver`, not a scroll handler.
- The map iframe is the heaviest element and is only on the contact page.

## Deploying

**Live site:** https://themountliterazeeschool.netlify.app

Hosted on Netlify as a dropped static site. There is no build step, so the publish
directory is the repository root and every file is uploaded as-is.

**Redeploying:**

- **Netlify:** open the project, go to *Dropped files*, and drag the `mlzs-deploy`
  folder (or a zip of it) onto the drop area. Do not drop files onto the agent chat
  box; that only attaches them to a conversation.
- **GitHub Pages:** push the folder to a repository and enable Pages on the main branch.

**Packaging note:** build the zip with forward-slash paths. Windows'
`Compress-Archive` in PowerShell 5.1 writes backslashes, which Netlify stores as
literal filenames (`assets\css\styles.css`), so every asset 404s and the site renders
unstyled. Use Python's `zipfile`, 7-Zip, or drag the folder itself instead.

**Free-plan badge:** the Netlify account is on the free tier, so Netlify injects a
"Powered by Netlify" badge into the page. The HUD script states the badge cannot be
hidden or dismissed on the free tier. Hiding it needs a paid plan, or host the same
folder somewhere without a badge (GitHub Pages, Cloudflare Pages).

Other static hosts:

- **Vercel:** import the folder as a static project. No framework preset.
- **Cloudflare Pages:** upload the folder, no build command.

After deployment:

1. Update the placeholder `https://mountlitera.com` URL in the JSON-LD block on `index.html` and in the footer if a dedicated domain is used.
2. Make `og:image` an absolute URL if link previews matter to you.
3. Submit the site to Google Search Console.
4. Run Lighthouse once on the live domain. The site should score well without tuning.

## Fonts and licensing

Newsreader and Manrope are open-source typefaces under the SIL Open Font License. The woff2 files are included for self-hosting. Keep the licence files with the fonts if you redistribute the project.

The child and classroom photographs are from Pexels and used under the Pexels license. The building photographs come from the school's Google Maps listing. Replace both with the school's own photography and the licence question disappears.
