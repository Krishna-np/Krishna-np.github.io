# Krishnendu Nandakumar Padmapriya — Portfolio

A Calenne-inspired portfolio site: warm off-white background, Lora + Instrument
Sans typography, restrained editorial components, and scroll-linked motion
(sticky project stack, mask reveals, scroll-linked process rail, parallax).

## Structure

```
portfolio/
│
├── index.html                     Homepage
├── about.html                     Full About page
│
├── projects/
│   ├── project-01.html            Enterprise Sales & Commercial Analytics
│   ├── project-02.html            M&A Target Screening & Valuation Intelligence
│   ├── project-03.html            Macy's Store Portfolio Strategy
│   ├── project-04.html            Retail Customer & Marketing Analytics
│   └── project-05.html            Institutional Transaction Cost Analysis
│
├── assets/
│   ├── css/
│   │   └── styles.css             Shared stylesheet for every page
│   │
│   ├── js/
│   │   └── main.js                Shared behavior for every page
│   │                               (nav, reveal animations, sticky work
│   │                               stack, approach progress rail, marquee,
│   │                               contact drawer, copy-email)
│   │
│   ├── images/
│   │   ├── portrait/
│   │   │   └── portrait.jpg       Placeholder — replace with your photo
│   │   │
│   │   └── projects/
│   │       ├── project-01/ … project-05/   Drop dashboard screenshots here
│   │
│   └── documents/
│       ├── resume-placeholder.pdf
│       └── publication-certificate-placeholder.pdf
│
└── README.md
```

## Run locally

1. Extract the zip.
2. Open the `portfolio` folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.
4. The site works immediately — no build step, no dependencies to install.

It also works by simply double-clicking `index.html` (all asset paths are
relative), and is ready to deploy as-is to **GitHub Pages** (push the
contents of `portfolio/` to a repo and enable Pages on the default branch).

## Replacing placeholders

| What | Replace this file | Referenced from |
|---|---|---|
| Your photo | `assets/images/portrait/portrait.jpg` | Homepage hero, About page |
| Résumé | `assets/documents/resume-placeholder.pdf` | Nav, hero, contact drawer (every page) |
| Publication certificate | `assets/documents/publication-certificate-placeholder.pdf` | About page → Publication section |
| Project dashboards | `assets/images/projects/project-0X/…` | `projects/project-0X.html` (each placeholder frame has an HTML comment showing the exact `<img>` tag to drop in) |
| About copy | The `[ABOUT COPY — FINAL TEXT TO BE ADDED]` line in `about.html` | About page |

Keep filenames as-is and the existing links keep working — or rename the
files and update the matching `href`/`src` in the HTML.

## Design system

- **Colors, spacing, type scale, buttons, badges, icons, cards, sticky
  sections, scroll-linked animation, mask reveals, and the contact drawer**
  are unchanged from the original design and defined once in
  `assets/css/styles.css` — every page (`index.html`, `about.html`, and each
  `projects/project-0X.html`) shares the same file, so there is only one
  place to edit styling.
- **One typographic exception:** the homepage hero positioning line —
  *"Finance · Commercial Analytics · Business Intelligence"* — uses
  **Cormorant Garamond** (italic) via the `.hero__accent-line` class, loaded
  from Google Fonts alongside Lora and Instrument Sans. This is the only
  line on the site using that font; everything else (name, headings, nav,
  body copy, buttons, project titles, labels) still uses the original
  Lora / Instrument Sans system.

## Contact links used throughout

- Email: `krishnendu.knp@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/krishnendu-np/`
- GitHub: `https://github.com/Krishna-np`
- Publication: `https://www.iosrjournals.org/iosr-jbm/papers/Vol25-issue10/Ser-4/B2510041014.pdf`
