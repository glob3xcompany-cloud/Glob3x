#!/usr/bin/env node
/**
 * Machine-translates the English dictionary into additional locales with DeepL and registers them so the
 * proxy can serve visitors whose browser language is not one of the hand-written core locales
 * (sq, en, it, de, fr, es). Output: dictionaries/generated/<locale>.json + dictionaries/generated/index.ts.
 *
 * Usage
 *   DEEPL_API_KEY=... node scripts/translate.mjs                 # locales from EXTRA_LOCALES (default list below)
 *   DEEPL_API_KEY=... node scripts/translate.mjs el tr nl        # explicit locales (DeepL target codes, lower-case)
 *   node scripts/translate.mjs --list                            # show what is generated right now
 *   node scripts/translate.mjs --doh ...                          # resolve DNS over HTTPS (locked-down networks)
 *
 * Quality controls
 *   • Brand and project names are protected with DeepL's XML tag handling (<keep>…</keep>) so "Glob3x Group",
 *     "Reeds Towers", street names etc. are never translated or declined.
 *   • Formality is set to "prefer_more" where DeepL supports it (business register).
 *   • Numbers and units come from lib/projects.ts and are formatted by Intl at render time, so they are never
 *     part of the translated text.
 *   • Every translated file is validated against the English structure before it is written; a locale that
 *     fails validation is skipped and reported instead of being published.
 *   • Pages for generated locales show a short "machine translated" note (layout.tsx) – no machine translation
 *     can be guaranteed error-free, so a human review of generated/<locale>.json is still recommended.
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DICTS = path.join(ROOT, "dictionaries");
const OUT = path.join(DICTS, "generated");
const CORE = ["sq", "en", "it", "de", "fr", "es"];
const DEFAULT_EXTRA = ["el", "tr", "nl", "pt-br", "pl", "ru", "uk", "ar", "zh-hans", "ja", "ko"];

/** Terms that must survive translation untouched. Longest first so "Glob3x Group" wins over "Glob3x". */
const PROTECTED = [
  "Glob3x Construction",
  "Glob3x Real Estate",
  "Glob3x Group",
  "Glob3x",
  "Skela Flex",
  "Reeds Towers",
  "Glow Tower",
  "Urban Millefeuille",
  "Lorden Residence",
  "New Corner Residence",
  "Avi Residence Boulevard",
  "Art Residence",
  "Luxury Villas Drymades",
  "Luxury Hotel Pezë",
  "Skopje East Gate",
  "Sochi 2014",
  "East Gate",
  "Drymades",
  "Dhërmi",
  "Pezë",
  "Tirana",
  "Tiranë",
  "Skopje",
  "Sochi",
  "Krasnaya Polyana",
  "Rruga e Kavajës",
  "Rruga e Durrësit",
  "Bulevardi Zhan D'Ark",
  "Bulevardi Dëshmorët e Kombit",
  "Sheshi Skënderbej",
  "Skanderbeg Square",
  "Dajti",
  "Durrës",
  "WhatsApp",
  "Instagram",
].sort((a, b) => b.length - a.length);

/** DeepL target codes → site locale (lower-case BCP-47 as used in the URL). */
const TARGET_CODES = { "pt-br": "PT-BR", "pt-pt": "PT-PT", "zh-hans": "ZH-HANS", "zh-hant": "ZH-HANT", "en-gb": "EN-GB", "en-us": "EN-US" };
const FORMALITY_SUPPORTED = new Set(["de", "fr", "it", "es", "nl", "pl", "pt-br", "pt-pt", "ja", "ru"]);

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const positional = args.filter((a) => !a.startsWith("--"));

if (flag("--list")) {
  const files = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((f) => f.endsWith(".json")) : [];
  console.log(files.length ? `Generated locales: ${files.map((f) => f.replace(/\.json$/, "")).join(", ")}` : "No generated locales yet.");
  process.exit(0);
}

const KEY = process.env.DEEPL_API_KEY;
if (!KEY) {
  console.error("Missing DEEPL_API_KEY (free or pro key from https://www.deepl.com/pro-api).");
  process.exit(1);
}
const API_HOST = process.env.DEEPL_API_HOST ?? (KEY.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com");
const lookup = flag("--doh") ? dohLookup : undefined;

const requested = (positional.length ? positional : (process.env.EXTRA_LOCALES ?? DEFAULT_EXTRA.join(",")).split(/[,\s]+/)).map((l) => l.trim().toLowerCase()).filter(Boolean);
const locales = requested.filter((l) => {
  if (CORE.includes(l)) console.warn(`• ${l}: core locale, hand-written – skipped`);
  return !CORE.includes(l);
});

const source = JSON.parse(fs.readFileSync(path.join(DICTS, "en.json"), "utf8"));
const leaves = collect(source);
console.log(`${leaves.length} strings → ${locales.join(", ")} via ${API_HOST}`);

fs.mkdirSync(OUT, { recursive: true });
const done = [];
for (const locale of locales) {
  try {
    const started = Date.now();
    process.stdout.write(`→ ${locale}: translating… `);
    const translated = await translateAll(leaves.map(([, text]) => text), locale);
    const dict = structuredClone(source);
    leaves.forEach(([keyPath], i) => set(dict, keyPath, translated[i]));
    const problems = validate(source, dict);
    if (problems.length) throw new Error(`validation failed (${problems.slice(0, 3).join("; ")})`);
    fs.writeFileSync(path.join(OUT, `${locale}.json`), JSON.stringify(dict, null, 2) + "\n");
    done.push(locale);
    console.log(`ok (${Math.round((Date.now() - started) / 1000)} s)`);
  } catch (error) {
    console.log(`\n✗ ${locale}: ${error.message}`);
  }
}
writeIndex();
console.log(`Registered: ${fs.readdirSync(OUT).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")).join(", ") || "none"}`);

/* ---------------------------------------------------------------------------------------------- */

function collect(node, prefix = [], out = []) {
  if (typeof node === "string") out.push([prefix, node]);
  else if (Array.isArray(node)) node.forEach((v, i) => collect(v, [...prefix, i], out));
  else if (node && typeof node === "object") for (const k of Object.keys(node)) collect(node[k], [...prefix, k], out);
  return out;
}

function set(obj, keyPath, value) {
  let cur = obj;
  for (const k of keyPath.slice(0, -1)) cur = cur[k];
  cur[keyPath.at(-1)] = value;
}

function validate(en, other, prefix = "", problems = []) {
  if (typeof en === "string") {
    if (typeof other !== "string" || !other.trim()) problems.push(`${prefix}: empty`);
    else for (const term of ["Glob3x", "Reeds Towers"]) if (en.includes(term) && !other.includes(term)) problems.push(`${prefix}: lost "${term}"`);
    return problems;
  }
  if (Array.isArray(en)) {
    if (!Array.isArray(other) || other.length !== en.length) problems.push(`${prefix}: array length`);
    else en.forEach((v, i) => validate(v, other[i], `${prefix}[${i}]`, problems));
    return problems;
  }
  for (const k of Object.keys(en)) validate(en[k], other?.[k], prefix ? `${prefix}.${k}` : k, problems);
  return problems;
}

/** Wraps protected terms in <keep> tags; DeepL copies ignored tags verbatim. */
function protect(text) {
  let out = text;
  for (const term of PROTECTED) out = out.split(term).join(`<keep>${term}</keep>`);
  return out;
}
const unprotect = (text) => text.replace(/<\/?keep>/g, "");

async function translateAll(texts, locale) {
  const result = [];
  const BATCH = 40; // DeepL accepts up to 50 texts per call
  for (let i = 0; i < texts.length; i += BATCH) {
    const chunk = texts.slice(i, i + BATCH);
    const body = {
      text: chunk.map(protect),
      source_lang: "EN",
      target_lang: TARGET_CODES[locale] ?? locale.toUpperCase(),
      tag_handling: "xml",
      ignore_tags: ["keep"],
      preserve_formatting: true,
      split_sentences: "nonewlines",
      ...(FORMALITY_SUPPORTED.has(locale) ? { formality: "prefer_more" } : {}),
    };
    const res = await post(`https://${API_HOST}/v2/translate`, body);
    result.push(...res.translations.map((t) => unprotect(t.text)));
    process.stdout.write(".");
  }
  return result;
}

function post(url, body, attempt = 0) {
  const u = new URL(url);
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(
      { host: u.hostname, path: u.pathname, method: "POST", lookup, headers: { Authorization: `DeepL-Auth-Key ${KEY}`, "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", async () => {
          if ((res.statusCode === 429 || res.statusCode >= 500) && attempt < 5) {
            await new Promise((r) => setTimeout(r, 1500 * 2 ** attempt));
            return post(url, body, attempt + 1).then(resolve, reject);
          }
          if (res.statusCode !== 200) return reject(new Error(`DeepL ${res.statusCode}: ${data.slice(0, 200)}`));
          resolve(JSON.parse(data));
        });
      },
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

function writeIndex() {
  const files = fs.existsSync(OUT) ? fs.readdirSync(OUT).filter((f) => f.endsWith(".json")).sort() : [];
  const lines = [
    "// Generated by scripts/translate.mjs – do not edit by hand.",
    'import type { Dictionary } from "@/app/[lang]/dictionaries";',
    "",
    "export const generated: Record<string, () => Promise<Dictionary>> = {",
    ...files.map((f) => {
      const l = f.replace(/\.json$/, "");
      return `  "${l}": () => import("./${f}").then((m) => m.default as unknown as Dictionary),`;
    }),
    "};",
    "",
  ];
  fs.writeFileSync(path.join(OUT, "index.ts"), lines.join("\n"));
}

/** DNS-over-HTTPS (Cloudflare) resolver for machines whose system DNS is blocked. */
const dnsCache = new Map();
function dohLookup(host, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  const finish = (ip) => (options?.all ? callback(null, [{ address: ip, family: 4 }]) : callback(null, ip, 4));
  if (dnsCache.has(host)) return finish(dnsCache.get(host));
  const req = https.request(
    { host: "1.1.1.1", servername: "cloudflare-dns.com", path: `/dns-query?name=${encodeURIComponent(host)}&type=A`, headers: { accept: "application/dns-json", host: "cloudflare-dns.com" } },
    (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        try {
          const answer = (JSON.parse(data).Answer ?? []).find((a) => a.type === 1);
          if (!answer) return callback(new Error(`DoH: no A record for ${host}`));
          dnsCache.set(host, answer.data);
          finish(answer.data);
        } catch (e) {
          callback(e);
        }
      });
    },
  );
  req.on("error", callback);
  req.end();
}
