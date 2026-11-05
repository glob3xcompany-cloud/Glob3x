# Glob3x Group — corporate website

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript strict. Runs on **http://localhost:3001** next to the
Reeds Towers microsite (`../glob3x-web`, port 3000).

```bash
npm install
npm run dev        # http://localhost:3001  → redirects to /sq, /en … by browser language
npm run build && npm start
npm run typecheck && npm run lint
```

## Structure

| Path | Purpose |
| --- | --- |
| `app/[lang]/` | Pages: home (`/`), `group`, `projects`, `projects/[slug]`, `projects/reeds-towers` (rich flagship page), `towers`, `construction`, `contact` |
| `lib/projects.ts` | **Single source of truth for the portfolio** – sector, typology, status, role, country, facts (numbers), media, distances |
| `lib/site.ts` | Company data: phones, WhatsApp, addresses per language, Skela Flex, sales agents |
| `lib/i18n.ts` | Locales, negotiation (`Accept-Language` → exact → base language → `en`), RTL, native names |
| `dictionaries/*.json` | Hand-written copy: `sq`, `en`, `it`, `de`, `fr`, `es` – all mirror `en.json` key-for-key (typed) |
| `dictionaries/generated/` | Machine-translated extra locales written by `npm run translate` |
| `proxy.ts` | Adds the locale prefix, remembers the choice in a `lang` cookie for a year |
| `scripts/translate.mjs` | DeepL pipeline for additional languages |
| `scripts/animate.mjs` | Higgsfield image-to-video pipeline for project hero clips |
| `public/media/projects/<slug>/` | Optimised WebP stills, floor plans, films (`hero-loop.mp4`, `motion.mp4`) |

### Editing content

* **Numbers** (heights, areas, units, distances) live in `lib/projects.ts` and are formatted per locale with `Intl`;
  labels for them live under `common.fact.*` / `common.programme.*` in the dictionaries.
* **Copy** (names, kickers, taglines, intros, paragraphs) lives in `dictionaries/<locale>.json` under
  `projects.items.<slug>`. Adding a project = one entry in `lib/projects.ts` + one entry per core dictionary.
* "Glob3x Group" is the company name and must never be translated or declined; the translate script protects it.

## Languages

Core (hand-written): Albanian `sq`, English `en`, Italian `it`, German `de`, French `fr`, Spanish `es`.

Any other visitor language is served from `dictionaries/generated/<locale>.json` when such a file exists, otherwise
English. To generate or refresh the extra languages:

```bash
DEEPL_API_KEY=xxxx npm run translate            # default list, see .env.example
DEEPL_API_KEY=xxxx npm run translate el tr nl   # explicit locales
```

The script protects brand, project and street names, requests the formal register, validates the structure of every
file against `en.json` and refuses to publish a locale that fails, and regenerates `dictionaries/generated/index.ts`.
Pages in a generated locale carry a short "machine translated" note; review the JSON when a market matters.

## Project motion clips (Higgsfield)

`npm run animate` turns one still per project (list in `scripts/animate.mjs`) into a 5-second camera move with
Kling 2.5 via the Higgsfield API and stores it as `public/media/projects/<slug>/motion.mp4`. Project pages use the
clip automatically when the file exists and fall back to the Ken Burns still otherwise.

```bash
HF_API_KEY=... HF_API_SECRET=... npm run animate              # all missing clips
npm run animate -- --env ../content-social/.env glow-tower    # credentials from a dotenv file, one project
npm run animate -- --model hailuo --force lorden-residence    # other model, regenerate
```

The account needs credits on https://console.higgsfield.ai (the API returns `not_enough_credits` otherwise).

## Deployment

Static-friendly Next.js app: any Node host (Docker, a small VPS with `npm run build && npm start` behind nginx, or
Vercel). Set `NEXT_PUBLIC_REEDS_URL` to the public Reeds Towers domain and `LEAD_WEBHOOK_URL` for the contact form.
