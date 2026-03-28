# How to Build a New Site

Three things to change per client: **logo**, **colours**, **images**.
Everything else is just filling in the JSON.

---

## Step 1 — Copy the template

Duplicate `client-data/_new-site-template.json` and rename it using the format:

```
business-name-city.json
```

Examples: `rapid-clean-glasgow.json`, `volt-spark-leeds.json`

> The filename becomes the site's folder name in `generated-sites/`.

---

## Step 2 — Fill in the JSON

Open your new file and replace every placeholder value.

### Identity

```json
"id":            "rapid-clean-glasgow",
"business_name": "Rapid Clean",
"niche":         "Commercial Cleaning",
"city":          "Glasgow",
"domain":        "rapidclean.co.uk",
"logo_path":     "assets/logo.svg"
```

| Field           | What to write                                    |
|-----------------|--------------------------------------------------|
| `id`            | kebab-case, matches the filename (no `.json`)    |
| `business_name` | Exactly as it appears on the site and logo       |
| `niche`         | The service category — used in headings and SEO  |
| `city`          | Primary city — drives all location text          |
| `domain`        | Domain name only, no `https://`                  |
| `logo_path`     | Always `assets/logo.svg` — drop the file there   |

---

## Step 3 — Change the logo

1. Export or create the logo as an **SVG file**
2. Save it as `assets/logo.svg` inside the client's generated folder, or put it next to the JSON

> The engine reads `logo_path` — you can also use an absolute URL if the logo is hosted:
> ```json
> "logo_path": "https://cdn.yourdomain.com/logo.svg"
> ```

---

## Step 4 — Change the colour scheme

Edit the `theme_colors` block. All six values are required.

```json
"theme_colors": {
  "primary":    "#0e3d60",
  "secondary":  "#1978a8",
  "accent":     "#fca311",
  "background": "#f0f7fc",
  "text":       "#0a2850",
  "surface":    "#ffffff"
}
```

| Key          | Used for                                                  |
|--------------|-----------------------------------------------------------|
| `primary`    | Dark nav, footer background, standard card backgrounds    |
| `secondary`  | Buttons, hover states, form accents                       |
| `accent`     | CTA highlights, icon tints, badge borders, star colour    |
| `background` | Page background (keep light — off-white or pale tint)     |
| `text`       | Main body text colour                                     |
| `surface`    | Card / panel background (almost always `#ffffff`)         |

### Quick colour presets

| Theme       | primary    | secondary  | accent     | background |
|-------------|------------|------------|------------|------------|
| Blue/Gold   | `#0e3d60`  | `#1978a8`  | `#fca311`  | `#f0f7fc`  |
| Forest/Lime | `#1a3a2a`  | `#2d6a4f`  | `#95d44a`  | `#f2f8f4`  |
| Slate/Pink  | `#2d1b4e`  | `#6b3fa0`  | `#f472b6`  | `#faf5ff`  |
| Charcoal/Teal | `#1c2b30` | `#2e6b75` | `#2dd4bf`  | `#f0fafa`  |
| Crimson/White | `#7b1d1d` | `#c0392b` | `#e8c96a`  | `#fdf5f5`  |

> **Tip:** Pick your accent colour first — it should contrast well against both the dark primary and the light background.

---

## Step 5 — Change the images

All four images accept **any URL** — Unsplash, your own CDN, or local paths.

```json
"images": {
  "banner":     "URL to hero / footer background photo",
  "about_main": "URL to large about-section photo",
  "about_side": "URL to small overlapping about photo",
  "footer_bg":  "URL to footer background (often same as banner)"
}
```

| Key          | Where it appears              | Recommended size |
|--------------|-------------------------------|------------------|
| `banner`     | Hero fullscreen + form section | 1920 × 1080px   |
| `about_main` | Left side of about section     | 900 × 600px     |
| `about_side` | Small overlapping photo        | 400 × 300px     |
| `footer_bg`  | Footer background              | 1920 × 600px    |

### Free photo sources

- **Unsplash** — unsplash.com — use the direct image URL with `?w=1920&q=85&auto=format`
- **Pexels** — pexels.com
- **Pixabay** — pixabay.com

### Unsplash URL format

```
https://images.unsplash.com/photo-PHOTOID?w=1920&q=85&auto=format
```

Change `w=` for the width you need. `q=85` keeps quality high while loading fast.

---

## Step 6 — Run the generator

Open a terminal in the `universal sites` folder and run:

### Generate one site

```bash
npm run generate -- aqua-rescue-birmingham
```

Replace `aqua-rescue-birmingham` with your site's `id` value.

### Generate all sites at once

```bash
npm run generate:all
```

### Run quality checks

```bash
npm run qa
```

All checks should show **OK: All QC checks passed** before you ship.

### Preview a site in the browser

```bash
npm run preview -- aqua-rescue-birmingham
```

---

## Where the output goes

Every generated site is a single self-contained HTML file:

```
generated-sites/
  aqua-rescue-birmingham/
    index.html          ← open this in a browser or upload to any host
```

No build tools, no server required — just upload the `index.html` file to any static host (Netlify, Vercel, Cloudflare Pages, cPanel file manager).

---

## Optional fields

These can be left out entirely — the engine handles missing values gracefully.

| Field              | What it adds to the site            |
|--------------------|--------------------------------------|
| `pricing`          | A full pricing tiers section          |
| `gallery`          | A photo gallery grid section          |
| `trust_proof`      | Custom proof-strip badges (defaults to review names if omitted) |
| `hero_cta_text`    | Different CTA label on the hero button vs nav |
| `hero_cta_url`     | Different CTA URL on the hero button  |
| `metadata.title`   | Custom `<title>` tag (auto-generated if omitted) |
| `metadata.description` | Custom meta description          |
| `metadata.opening_hours` | Schema-ready hours string      |
| `metadata.address` | Service area address text             |
| `jobs_count`       | Stat shown in About section (`500+`)  |
| `jobs_text`        | Label below the stat                  |

---

## Common mistakes

- **`id` doesn't match the filename** — the generator uses the filename, not the `id` field. Keep them identical.
- **Hex colours with wrong format** — always use 6-digit hex: `#0e3d60` not `#039`.
- **Logo path wrong** — if using a local file, it must be relative to where the HTML is served from. Using an absolute URL is safest.
- **Missing required fields** — `business_name`, `niche`, `city`, `phone`, `email`, `headline`, `subheadline`, `about_text`, `services`, `reviews`, `faqs`, `cta_text`, `cta_url`, `theme_colors` are all required.
