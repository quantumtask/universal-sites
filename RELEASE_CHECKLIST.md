# Local Release Quality Checklist

Use this checklist before shipping generated local-service pages.

## 1. Generate/Build
- [ ] npm run lint (no ESLint errors)
- [ ] npm run build (TypeScript compile passes)
- [ ] npm run generate:all (all client sites generated without throw)

## 2. QA checks
- [ ] npm run qa (all site-level checks pass)
  - checks required fields in client configs
  - validates theme values are correct hex codes
  - confirms site assets and links are present or warned
  - detects template tokens still present ({{...}} must be replaced)
  - validates required on-page markup: title, meta description, h1, h2
  - verifies internal anchor IDs and section IDs exist

## 3. Manual spot-check
- [ ] open generated site in browser, confirm layout, hero, CTA, and content are present
- [ ] confirm that the generated site path is `generated-sites/<client-id>/index.html`
- [ ] confirm `assets/logo.svg` or assets are deployed with site for the brand

## 4. Optional preflight
- [ ] check server log for 404s of referenced files, and add missing ones
- [ ] verify JSON-LD schema appears in `<head>`

## 5. Deploy guard
- [ ] update deployment target with `generated-sites/` only (not template source)
- [ ] use versioned client config snapshot from repo commit

## Usage
- run `npm run check` to run all checks in one command.
- for focused issues, run `npm run qa`.
