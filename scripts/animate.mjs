#!/usr/bin/env node
/**
 * Higgsfield image-to-video for project renders.
 *
 * Turns a still render into a short, slow camera move (5 s, muted) that the site uses
 * as the hero motion of a project page. Outputs land in public/media/projects/<slug>/motion.mp4.
 *
 * Usage
 *   HF_API_KEY=... HF_API_SECRET=... node scripts/animate.mjs            # every shot in SHOTS that has no output yet
 *   node scripts/animate.mjs glow-tower lorden-residence                 # only these slugs
 *   node scripts/animate.mjs --force glow-tower                          # regenerate
 *   node scripts/animate.mjs --dry-run                                   # print the plan, call nothing
 *   node scripts/animate.mjs --env ../content-social/.env                # read credentials from a dotenv file
 *   node scripts/animate.mjs --doh                                       # resolve DNS over HTTPS (locked-down networks)
 *
 * Credentials never leave the environment: they are read from HF_API_KEY / HF_API_SECRET
 * (or the --env file) and sent only to api.higgsfield.ai.
 */
import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MEDIA = path.join(ROOT, "public", "media", "projects");
const API = "https://api.higgsfield.ai";
/** Image-to-video models exposed by the API; pick with --model kling|hailuo (default kling). */
const MODELS = {
  kling: { route: "/kling-video/v2.5-turbo/standard/image-to-video", body: (shot, imageUrl) => ({ prompt: shot.prompt, negative_prompt: NEGATIVE, image_url: imageUrl, duration: 5, cfg_scale: 0.5 }) },
  hailuo: { route: "/minimax/hailuo-2.3/standard/image-to-video", body: (shot, imageUrl) => ({ prompt: shot.prompt, image_url: imageUrl, duration: 6, prompt_optimizer: false }) },
};

/** One shot per project: the still that gets animated and the camera move we ask for. */
const SHOTS = [
  { slug: "glow-tower", image: "tower-render.webp", prompt: "Slow cinematic drone push-in towards a glass tower at dusk, static architecture, warm interior lights, soft moving clouds, photoreal" },
  { slug: "urban-millefeuille", image: "tower.webp", prompt: "Slow upward tilt along a terraced residential tower, static building, subtle cloud drift, warm afternoon light, photoreal architectural film" },
  { slug: "lorden-residence", image: "render-court.webp", prompt: "Gentle forward dolly through a landscaped residential courtyard, static buildings, leaves moving softly, late afternoon sun, photoreal" },
  { slug: "luxury-hotel-peze", image: "pool-wide.webp", prompt: "Slow lateral drone glide over a hotel pool terrace, still water with light ripples, static architecture, golden hour, photoreal" },
  { slug: "new-corner-residence", image: "render.webp", prompt: "Slow orbit around a corner residential building, static architecture, passing clouds, soft daylight, photoreal architectural film" },
  { slug: "avi-residence-boulevard", image: "render.webp", prompt: "Slow drone push-in towards a boulevard residence with a rooftop garden, static building, subtle cloud movement, clear day, photoreal" },
  { slug: "art-residence", image: "aerial.webp", prompt: "Slow aerial drone descent towards a low-rise residence among trees, static buildings, gentle foliage movement, soft daylight, photoreal" },
];

const NEGATIVE = "people walking, cars, text, watermark, distortion, warping walls, flicker, fast motion, camera shake";

const dnsCache = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const slugs = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--env");

if (option("--env")) loadDotenv(path.resolve(option("--env")));
const KEY_ID = process.env.HF_API_KEY;
const KEY_SECRET = process.env.HF_API_SECRET;

const plan = SHOTS.filter((s) => (slugs.length === 0 || slugs.includes(s.slug)) && (flag("--force") || !fs.existsSync(output(s.slug))));

if (plan.length === 0) {
  console.log("Nothing to do – every selected project already has a motion.mp4 (use --force to regenerate).");
  process.exit(0);
}
console.log(`Plan (${plan.length} shot${plan.length === 1 ? "" : "s"}):`);
for (const s of plan) console.log(`  ${s.slug.padEnd(26)} ${s.image}`);
if (flag("--dry-run")) process.exit(0);
if (!KEY_ID || !KEY_SECRET) {
  console.error("Missing HF_API_KEY / HF_API_SECRET (set them in the environment or pass --env <file>).");
  process.exit(1);
}

const lookup = flag("--doh") ? dohLookup : undefined;
const AUTH = `Key ${KEY_ID}:${KEY_SECRET}`;
const model = MODELS[option("--model") ?? "kling"];
if (!model) {
  console.error(`Unknown --model (use ${Object.keys(MODELS).join(" | ")}).`);
  process.exit(1);
}

for (const shot of plan) {
  const started = Date.now();
  const source = path.join(MEDIA, shot.slug, shot.image);
  if (!fs.existsSync(source)) {
    console.error(`✗ ${shot.slug}: missing ${source}`);
    continue;
  }
  try {
    process.stdout.write(`→ ${shot.slug}: uploading… `);
    const imageUrl = await upload(source);
    process.stdout.write("submitting… ");
    const submitted = await api("POST", model.route, model.body(shot, imageUrl));
    process.stdout.write(`${submitted.request_id.slice(0, 8)} `);
    const result = await poll(submitted.status_url);
    if (result.status !== "completed" || !result.video?.url) throw new Error(`${result.status}${result.error ? `: ${result.error}` : ""}`);
    process.stdout.write("downloading… ");
    const file = await download(result.video.url);
    fs.mkdirSync(path.dirname(output(shot.slug)), { recursive: true });
    fs.writeFileSync(output(shot.slug), file);
    console.log(`done (${(file.length / 1e6).toFixed(1)} MB, ${Math.round((Date.now() - started) / 1000)} s)`);
  } catch (error) {
    console.log(`\n✗ ${shot.slug}: ${error.message}`);
  }
}

function output(slug) {
  return path.join(MEDIA, slug, "motion.mp4");
}

function loadDotenv(file) {
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"]*)"?\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

async function upload(file) {
  const ext = path.extname(file).slice(1).toLowerCase();
  const contentType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
  const ticket = await api("POST", "/files/generate-upload-url", { content_type: contentType });
  const res = await request(ticket.upload_url, { method: "PUT", headers: ticket.upload_headers, body: fs.readFileSync(file) });
  if (res.status < 200 || res.status >= 300) throw new Error(`upload failed (${res.status})`);
  return ticket.public_url;
}

async function poll(statusUrl) {
  let delay = 2000;
  const deadline = Date.now() + 15 * 60 * 1000;
  while (Date.now() < deadline) {
    await sleep(delay + Math.random() * 500);
    delay = Math.min(delay * 1.5, 10000);
    const res = await request(statusUrl, { headers: { Authorization: AUTH } });
    if (res.status >= 500) continue;
    if (res.status !== 200) throw new Error(`status ${res.status}: ${res.body.toString("utf8").slice(0, 200)}`);
    const json = JSON.parse(res.body.toString("utf8"));
    if (["completed", "failed", "nsfw", "canceled"].includes(json.status)) return json;
    process.stdout.write(".");
  }
  throw new Error("timed out");
}

async function download(url) {
  const res = await request(url);
  if (res.status !== 200) throw new Error(`download failed (${res.status})`);
  return res.body;
}

async function api(method, route, body) {
  const res = await request(API + route, { method, headers: { Authorization: AUTH, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const text = res.body.toString("utf8");
  if (res.status < 200 || res.status >= 300) throw new Error(`${method} ${route} → ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

function request(url, { method = "GET", headers = {}, body } = {}) {
  const u = new URL(url);
  // S3-style presigned uploads reject chunked transfer encoding → always send an explicit length.
  if (body) headers = { ...headers, "Content-Length": Buffer.byteLength(body) };
  return new Promise((resolve, reject) => {
    const req = https.request({ host: u.hostname, path: u.pathname + u.search, method, headers, lookup }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

/** DNS-over-HTTPS (Cloudflare) resolver for machines whose system DNS is blocked. */
function dohLookup(host, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  const done = (ip) => (options?.all ? callback(null, [{ address: ip, family: 4 }]) : callback(null, ip, 4));
  if (dnsCache.has(host)) return done(dnsCache.get(host));
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
          done(answer.data);
        } catch (e) {
          callback(e);
        }
      });
    },
  );
  req.on("error", callback);
  req.end();
}
