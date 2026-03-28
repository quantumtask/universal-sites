# Websell Website Factory

This project is being updated into a static website generator for local-service businesses.

## Run generator

- `npm run generate` (generates the first matching client or all if `--all`)
- `npm run generate:all` (generates every client config in `client-data`)

Client site output goes to `generated-sites/<client-id>/index.html`.

## Add client data

Create a JSON file in `client-data/` with the schema in `src/types.ts`.

Required fields (with example names):
- `business_name`
- `niche`
- `city`
- `domain`
- `logo_path`
- `phone`
- `email`
- `headline`
- `subheadline`
- `about_text`
- `services` - array of `{title, description}`
- `reviews` - array of `{name, quote, role?}`
- `faqs` - array of `{question, answer}`
- `cta_text`, `cta_url`
- `theme_colors` - `primary`, `secondary`, `accent`, `background`, `text`, `surface`

Missing required fields are validated at generation time and reported as clear errors.

## Template

Edit `templates/master/index.html` and `shared/styles/tokens.css` to update global branding.

## Architecture

- `src/engine` holds rendering and generator core logic.
- `src/data` holds client data loader utilities.
- `client-data` stores client-specific JSON content only.
- `generated-sites` is output only; shouldn’t be hand-edited.
- `templates/master` is template-only, no business content.
- `shared/styles` contains design tokens and shared style system.
- `legacy` stores previous dashboard UI logic for reference; not used in generator.

