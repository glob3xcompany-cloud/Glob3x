/**
 * Structural, locale-independent project data. All prose lives in dictionaries/*.json under projects.items[slug];
 * labels for the keys below live under common.*.
 * Source of truth: "Portfolio — September 2026" (Glob3x Group) and the Reeds Towers building-permit drawings.
 */

export const SECTORS = ["towers", "residences", "hospitality", "construction"] as const;
export type Sector = (typeof SECTORS)[number];

/** Typology inside a sector (the portfolio's sub-categories). */
export const TYPES = ["mixed-use", "residential", "villas", "hotel", "retail", "olympic"] as const;
export type ProjectType = (typeof TYPES)[number];

/** The portfolio groups work into completed and ongoing projects. */
export const STATUSES = ["ongoing", "completed"] as const;
export type Status = (typeof STATUSES)[number];

export type Role = "developer" | "developer-contractor" | "contractor";

export type Country = "AL" | "MK" | "RU";

export type FactKey =
  | "height"
  | "floors"
  | "underground"
  | "gfa"
  | "site"
  | "footprint"
  | "units"
  | "villas"
  | "commercial"
  | "parking"
  | "programme"
  | "year"
  | "workers"
  | "professionals"
  | "sites"
  | "permit"
  | "unitSizes"
  | "floorPlate"
  | "area";

export type ProgrammeKey = "residential" | "hotel" | "offices" | "retail" | "restaurant" | "services" | "gardens" | "rooms" | "suites" | "pool" | "spa" | "parking";

export type Fact =
  | { k: Exclude<FactKey, "programme">; v: string }
  | { k: Exclude<FactKey, "programme">; n: number; unit?: string; approx?: boolean }
  | { k: "programme"; items: ProgrammeKey[] };

export type PlaceKey = "skanderbeg" | "airport" | "durres" | "dajti" | "centre" | "boulevard";
export type Distance = { place: PlaceKey; v: string };

export type Media = { src: string; w: number; h: number; position?: string };

export type Project = {
  slug: string;
  sector: Sector;
  type: ProjectType;
  status: Status;
  role: Role;
  country: Country;
  flagship?: boolean;
  /** Units or commercial space currently on sale. */
  forSale?: boolean;
  /** Dedicated website, if any ("reeds" resolves to site.reedsSite). */
  externalUrl?: string;
  logo?: string;
  hero: Media;
  cover: Media;
  gallery: Media[];
  plans?: Media[];
  /** Muted background loop for the hero; `film` is the full-quality cut opened by the "watch film" button. */
  video?: { src: string; poster: string; film?: string };
  facts: Fact[];
  distances?: Distance[];
};

const m = (src: string, w: number, h: number, position?: string): Media => ({ src, w, h, position });
const R = "/media/projects";

export const PROJECTS: readonly Project[] = [
  {
    slug: "reeds-towers",
    sector: "towers",
    type: "mixed-use",
    status: "ongoing",
    role: "developer",
    country: "AL",
    flagship: true,
    externalUrl: "reeds",
    hero: m(`${R}/reeds-towers/hero-aerial.webp`, 2560, 1429),
    cover: m(`${R}/reeds-towers/towers-mountains.webp`, 2000, 1407),
    video: { src: `${R}/reeds-towers/hero-loop.mp4`, poster: `${R}/reeds-towers/hero-poster.jpg`, film: `${R}/reeds-towers/film-720.mp4` },
    gallery: [
      m(`${R}/reeds-towers/dusk.webp`, 2400, 1698),
      m(`${R}/reeds-towers/tower-portrait.webp`, 1378, 2000),
      m(`${R}/reeds-towers/plaza-people.webp`, 2000, 1418),
      m(`${R}/reeds-towers/facade-texture.webp`, 2000, 1415),
      m(`${R}/reeds-towers/lobby.webp`, 2000, 1116),
      m(`${R}/reeds-towers/restaurant.webp`, 2000, 1116),
      m(`${R}/reeds-towers/pool.webp`, 2000, 1116),
      m(`${R}/reeds-towers/living.webp`, 2000, 1116),
      m(`${R}/reeds-towers/spa.webp`, 2000, 1116),
      m(`${R}/reeds-towers/terrace.webp`, 2000, 1116),
      m(`${R}/reeds-towers/night-tower.webp`, 2400, 1697),
      m(`${R}/reeds-towers/night-aerial.webp`, 2400, 1340),
    ],
    plans: [
      m(`${R}/reeds-towers/section-long.webp`, 1800, 1582),
      m(`${R}/reeds-towers/section-tower.webp`, 1125, 1800),
      m(`${R}/reeds-towers/plan-typical-a.webp`, 1569, 1693),
      m(`${R}/reeds-towers/plan-typical-b.webp`, 1569, 1693),
      m(`${R}/reeds-towers/plan-typical-c.webp`, 1569, 1693),
    ],
    facts: [
      { k: "height", n: 191.89, unit: "m" },
      { k: "floors", v: "55 + 36" },
      { k: "underground", n: 5 },
      { k: "gfa", n: 83576.33, unit: "m²" },
      { k: "site", n: 5050.7, unit: "m²" },
      { k: "footprint", n: 1786.45, unit: "m²" },
      { k: "programme", items: ["residential", "hotel", "offices", "retail", "restaurant"] },
      { k: "unitSizes", v: "57 – 101 m²" },
      { k: "permit", v: "KKTU 28 · 18.04.2025" },
    ],
    distances: [
      { place: "skanderbeg", v: "10 min" },
      { place: "airport", v: "20 min" },
      { place: "durres", v: "40 min" },
      { place: "dajti", v: "25 min" },
    ],
  },
  {
    slug: "glow-tower",
    sector: "towers",
    type: "mixed-use",
    status: "ongoing",
    role: "developer",
    country: "AL",
    hero: m(`${R}/glow-tower/hero.webp`, 2400, 1743),
    cover: m(`${R}/glow-tower/tower.webp`, 1800, 2250, "object-top"),
    gallery: [
      m(`${R}/glow-tower/tower-render.webp`, 1250, 1791),
      m(`${R}/glow-tower/colonnade.webp`, 2400, 1250),
      m(`${R}/glow-tower/tower-mountains.webp`, 826, 648),
      m(`${R}/glow-tower/facade-detail.webp`, 826, 650),
      m(`${R}/glow-tower/garden-court.webp`, 865, 651),
      m(`${R}/glow-tower/lobby.webp`, 849, 648),
      m(`${R}/glow-tower/atrium.webp`, 864, 1242),
      m(`${R}/glow-tower/facade-close.webp`, 877, 877),
      m(`${R}/glow-tower/restaurant.webp`, 1807, 1811),
      m(`${R}/glow-tower/interior-living.webp`, 844, 1746),
      m(`${R}/glow-tower/interior-lounge.webp`, 844, 1746),
      m(`${R}/glow-tower/interior-restaurant.webp`, 844, 1746),
      m(`${R}/glow-tower/interior-kitchen.webp`, 844, 1746),
      m(`${R}/glow-tower/suite-1.webp`, 1266, 730),
      m(`${R}/glow-tower/suite-2.webp`, 1387, 800),
      m(`${R}/glow-tower/suite-4.webp`, 1266, 732),
    ],
    plans: [m(`${R}/glow-tower/section.webp`, 1466, 1469), m(`${R}/glow-tower/map.webp`, 1600, 1011)],
    facts: [
      { k: "height", n: 95.5, unit: "m" },
      { k: "floors", n: 25 },
      { k: "underground", n: 6 },
      { k: "gfa", n: 28963, unit: "m²" },
      { k: "programme", items: ["residential", "hotel", "retail", "services"] },
    ],
    distances: [{ place: "boulevard", v: "0 m" }],
  },
  {
    slug: "urban-millefeuille",
    sector: "towers",
    type: "mixed-use",
    status: "ongoing",
    role: "developer",
    country: "AL",
    hero: m(`${R}/urban-millefeuille/towers-2.webp`, 2400, 2353, "object-[50%_30%]"),
    cover: m(`${R}/urban-millefeuille/tower.webp`, 1676, 2400, "object-top"),
    gallery: [
      m(`${R}/urban-millefeuille/towers-2.webp`, 2400, 2353),
      m(`${R}/urban-millefeuille/renders.webp`, 1451, 2078),
      m(`${R}/urban-millefeuille/street.webp`, 1010, 1833),
      m(`${R}/urban-millefeuille/detail.webp`, 876, 865),
      m(`${R}/urban-millefeuille/tower.webp`, 1676, 2400),
    ],
    facts: [
      { k: "height", n: 95, unit: "m" },
      { k: "site", n: 10542, unit: "m²" },
      { k: "gfa", n: 67082.7, unit: "m²" },
      { k: "programme", items: ["residential", "offices", "retail", "gardens"] },
    ],
    distances: [
      { place: "boulevard", v: "3 min" },
      { place: "centre", v: "6 min" },
      { place: "airport", v: "20 min" },
    ],
  },
  {
    slug: "lorden-residence",
    sector: "residences",
    type: "residential",
    status: "ongoing",
    role: "developer-contractor",
    country: "AL",
    forSale: true,
    logo: `${R}/lorden-residence/logo.webp`,
    hero: m(`${R}/lorden-residence/hero.webp`, 2400, 1440),
    cover: m(`${R}/lorden-residence/building-1.webp`, 2000, 1200),
    gallery: [
      m(`${R}/lorden-residence/render-court.webp`, 1497, 1690),
      m(`${R}/lorden-residence/aerial-render.webp`, 1646, 1397),
      m(`${R}/lorden-residence/night-aerial.webp`, 1354, 2400),
      m(`${R}/lorden-residence/building-3.webp`, 2000, 1200),
      m(`${R}/lorden-residence/night.webp`, 2000, 1200),
      m(`${R}/lorden-residence/facade.webp`, 2000, 1200),
      m(`${R}/lorden-residence/site-bw.webp`, 1380, 2259),
      m(`${R}/lorden-residence/site-bw-2.webp`, 1837, 1131),
      m(`${R}/lorden-residence/plan-3d-1.webp`, 1080, 1080),
      m(`${R}/lorden-residence/plan-3d-2.webp`, 1200, 1200),
      m(`${R}/lorden-residence/plan-3d-3.webp`, 1200, 1200),
    ],
    plans: [m(`${R}/lorden-residence/unit-1.webp`, 1600, 1143), m(`${R}/lorden-residence/unit-2.webp`, 1600, 1143), m(`${R}/lorden-residence/unit-3.webp`, 1600, 1143)],
    facts: [
      { k: "floors", n: 7 },
      { k: "underground", n: 2 },
      { k: "gfa", n: 11064.54, unit: "m²" },
      { k: "units", n: 80 },
      { k: "commercial", n: 1300, unit: "m²", approx: true },
      { k: "parking", n: 100 },
    ],
    distances: [
      { place: "boulevard", v: "300 m" },
      { place: "skanderbeg", v: "1.6 km" },
    ],
  },
  {
    slug: "new-corner-residence",
    sector: "residences",
    type: "residential",
    status: "completed",
    role: "developer-contractor",
    country: "AL",
    forSale: true,
    logo: `${R}/new-corner-residence/logo.webp`,
    hero: m(`${R}/new-corner-residence/facade-2.webp`, 1800, 1198),
    cover: m(`${R}/new-corner-residence/corner.webp`, 1470, 1470),
    gallery: [
      m(`${R}/new-corner-residence/photo.webp`, 1961, 1876),
      m(`${R}/new-corner-residence/render.webp`, 1510, 2164),
      m(`${R}/new-corner-residence/hero.webp`, 1470, 1470),
      m(`${R}/new-corner-residence/aerial-3.webp`, 1704, 1625),
      m(`${R}/new-corner-residence/aerial.webp`, 1041, 1280),
      m(`${R}/new-corner-residence/aerial-2.webp`, 1600, 1600),
      m(`${R}/new-corner-residence/facade-1.webp`, 1539, 1539),
      m(`${R}/new-corner-residence/lobby.webp`, 1477, 2217),
      m(`${R}/new-corner-residence/artwork.webp`, 1263, 963),
      m(`${R}/new-corner-residence/lobby-2.webp`, 666, 1010),
      m(`${R}/new-corner-residence/elevator.webp`, 694, 1066),
    ],
    plans: [m(`${R}/new-corner-residence/unit-38.webp`, 1600, 1600), m(`${R}/new-corner-residence/unit-41.webp`, 750, 750), m(`${R}/new-corner-residence/unit-6.webp`, 750, 750)],
    facts: [
      { k: "floors", v: "6 + 7" },
      { k: "underground", n: 2 },
      { k: "gfa", n: 5908, unit: "m²" },
      { k: "commercial", n: 77.5, unit: "m²" },
    ],
  },
  {
    slug: "avi-residence-boulevard",
    sector: "residences",
    type: "residential",
    status: "completed",
    role: "developer",
    country: "AL",
    forSale: true,
    logo: `${R}/avi-residence-boulevard/logo.webp`,
    hero: m(`${R}/avi-residence-boulevard/hero.webp`, 2400, 1680),
    cover: m(`${R}/avi-residence-boulevard/facade-2.webp`, 2000, 1400),
    gallery: [
      m(`${R}/avi-residence-boulevard/render.webp`, 2400, 1462),
      m(`${R}/avi-residence-boulevard/garden-aerial.webp`, 1418, 2009),
      m(`${R}/avi-residence-boulevard/facade-photo.webp`, 1098, 1576),
      m(`${R}/avi-residence-boulevard/facade-1.webp`, 2000, 1125),
      m(`${R}/avi-residence-boulevard/facade-3.webp`, 2000, 1400),
      m(`${R}/avi-residence-boulevard/facade-4.webp`, 2000, 1400),
      m(`${R}/avi-residence-boulevard/construction.webp`, 836, 1514),
      m(`${R}/avi-residence-boulevard/construction-2.webp`, 860, 867),
    ],
    plans: [
      m(`${R}/avi-residence-boulevard/unit-6.webp`, 1600, 1600),
      m(`${R}/avi-residence-boulevard/unit-37.webp`, 1600, 1600),
      m(`${R}/avi-residence-boulevard/unit-41.webp`, 1600, 1600),
      m(`${R}/avi-residence-boulevard/unit-43.webp`, 1600, 1600),
    ],
    facts: [
      { k: "floors", v: "8 + 9" },
      { k: "underground", n: 1 },
      { k: "gfa", n: 7220.4, unit: "m²" },
      { k: "programme", items: ["residential", "retail", "services"] },
    ],
  },
  {
    slug: "art-residence",
    sector: "residences",
    type: "residential",
    status: "completed",
    role: "developer-contractor",
    country: "AL",
    logo: `${R}/art-residence/logo.webp`,
    hero: m(`${R}/art-residence/hero.webp`, 2000, 1346),
    cover: m(`${R}/art-residence/corner.webp`, 2000, 1333),
    gallery: [
      m(`${R}/art-residence/aerial.webp`, 1747, 1674),
      m(`${R}/art-residence/facade-tall.webp`, 1675, 2400),
      m(`${R}/art-residence/building.webp`, 1764, 1674),
      m(`${R}/art-residence/street.webp`, 1800, 1220),
      m(`${R}/art-residence/corner-2.webp`, 1800, 1218),
      m(`${R}/art-residence/facade.webp`, 1800, 1080),
      m(`${R}/art-residence/lobby.webp`, 784, 719),
      m(`${R}/art-residence/lobby-2.webp`, 759, 1138),
    ],
    facts: [
      { k: "floors", v: "4 · 6 · 7" },
      { k: "underground", n: 2 },
      { k: "gfa", n: 2844.77, unit: "m²" },
      { k: "programme", items: ["residential", "services"] },
    ],
  },
  {
    slug: "luxury-villas-drymades",
    sector: "hospitality",
    type: "villas",
    status: "ongoing",
    role: "developer-contractor",
    country: "AL",
    hero: m(`${R}/luxury-villas-drymades/render-4.webp`, 1376, 768),
    cover: m(`${R}/luxury-villas-drymades/render-wide.webp`, 2400, 1337),
    video: { src: `${R}/luxury-villas-drymades/hero-loop-720.mp4`, poster: `${R}/luxury-villas-drymades/hero-poster.jpg`, film: `${R}/luxury-villas-drymades/hero-loop.mp4` },
    gallery: [
      m(`${R}/luxury-villas-drymades/render-4.webp`, 1376, 768),
      m(`${R}/luxury-villas-drymades/render-street.webp`, 1418, 2032),
      m(`${R}/luxury-villas-drymades/render-wide.webp`, 2400, 1337),
      m(`${R}/luxury-villas-drymades/render-1.webp`, 1024, 1024),
      m(`${R}/luxury-villas-drymades/render-6.webp`, 2000, 2000),
      m(`${R}/luxury-villas-drymades/detail-1.webp`, 1499, 1499),
      m(`${R}/luxury-villas-drymades/detail-3.webp`, 1499, 1499),
      m(`${R}/luxury-villas-drymades/render-7.webp`, 2400, 2400),
      m(`${R}/luxury-villas-drymades/bedroom.webp`, 2012, 2012),
      m(`${R}/luxury-villas-drymades/detail-2.webp`, 1499, 1499),
    ],
    plans: [
      m(`${R}/luxury-villas-drymades/plans/site-plan.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-a-ground.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-a-first.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-a-second.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-b-ground.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-b-first.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-b-second.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-c-ground.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-c-first.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/villa-c-second.webp`, 2520, 2081),
      m(`${R}/luxury-villas-drymades/plans/parking-plan.webp`, 2520, 2081),
    ],
    facts: [
      { k: "villas", n: 3 },
      { k: "floors", v: "2 – 3" },
      { k: "underground", n: 1 },
    ],
  },
  {
    slug: "luxury-hotel-peze",
    sector: "hospitality",
    type: "hotel",
    status: "ongoing",
    role: "developer-contractor",
    country: "AL",
    hero: m(`${R}/luxury-hotel-peze/pool-wide.webp`, 2400, 1270),
    cover: m(`${R}/luxury-hotel-peze/aerial.webp`, 1466, 2400, "object-[50%_35%]"),
    gallery: [
      m(`${R}/luxury-hotel-peze/pool-wide.webp`, 2400, 1270),
      m(`${R}/luxury-hotel-peze/aerial.webp`, 1466, 2400),
      m(`${R}/luxury-hotel-peze/facade.webp`, 1819, 1132),
      m(`${R}/luxury-hotel-peze/pool.webp`, 1262, 658),
      m(`${R}/luxury-hotel-peze/evening.webp`, 1280, 522),
      m(`${R}/luxury-hotel-peze/hero.webp`, 1280, 588),
    ],
    facts: [
      { k: "floors", n: 2 },
      { k: "underground", n: 1 },
      { k: "programme", items: ["rooms", "suites", "restaurant", "pool", "spa"] },
    ],
    distances: [{ place: "centre", v: "12 km" }],
  },
  {
    slug: "skopje-east-gate",
    sector: "construction",
    type: "retail",
    status: "completed",
    role: "contractor",
    country: "MK",
    hero: m(`${R}/skopje-east-gate/render.webp`, 2400, 1144),
    cover: m(`${R}/skopje-east-gate/hero.webp`, 1766, 1198),
    gallery: [
      m(`${R}/skopje-east-gate/site-aerial.webp`, 2063, 2400),
      m(`${R}/skopje-east-gate/night.webp`, 1383, 1981),
      m(`${R}/skopje-east-gate/site-aerial-2.webp`, 1674, 2400),
      m(`${R}/skopje-east-gate/crew.webp`, 1410, 1109),
      m(`${R}/skopje-east-gate/crew-2.webp`, 1515, 1237),
      m(`${R}/skopje-east-gate/cranes.webp`, 2000, 2000),
      m(`${R}/skopje-east-gate/aerial.webp`, 746, 420),
      m(`${R}/skopje-east-gate/aerial-close.webp`, 746, 420),
    ],
    facts: [
      { k: "year", v: "2019" },
      { k: "area", n: 44000, unit: "m²" },
      { k: "professionals", v: "500+" },
    ],
  },
  {
    slug: "sochi-2014",
    sector: "construction",
    type: "olympic",
    status: "completed",
    role: "contractor",
    country: "RU",
    hero: m(`${R}/sochi-2014/krasnaya-polyana.webp`, 1673, 2400, "object-[50%_40%]"),
    cover: m(`${R}/sochi-2014/station.webp`, 930, 1588, "object-[50%_30%]"),
    gallery: [
      m(`${R}/sochi-2014/krasnaya-polyana.webp`, 1673, 2400),
      m(`${R}/sochi-2014/station.webp`, 930, 1588),
      m(`${R}/sochi-2014/stadium.webp`, 932, 867),
      m("/media/group/workers-rebar.webp", 1800, 1350),
    ],
    facts: [
      { k: "year", v: "2014" },
      { k: "workers", v: "820+" },
      { k: "sites", n: 6 },
    ],
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export const projectsBySector = (sector: Sector) => PROJECTS.filter((p) => p.sector === sector);

export const projectsByStatus = (status: Status) => PROJECTS.filter((p) => p.status === status);

export const FLAGSHIP = PROJECTS.find((p) => p.flagship)!;

export const TOWERS = projectsBySector("towers");

/** Numeric fact value for a project, if present. */
export function factNumber(project: Project, key: FactKey): number | undefined {
  const f = project.facts.find((x) => x.k === key);
  return f && "n" in f ? f.n : undefined;
}

/** Figures derived from the data so they can never drift. */
export const PORTFOLIO = {
  projects: PROJECTS.length,
  ongoing: projectsByStatus("ongoing").length,
  completed: projectsByStatus("completed").length,
  countries: new Set(PROJECTS.map((p) => p.country)).size,
  towers: TOWERS.length,
  /** Gross floor area across all projects with a published figure (m²). */
  gfa: Math.round(PROJECTS.reduce((sum, p) => sum + (factNumber(p, "gfa") ?? factNumber(p, "area") ?? 0), 0)),
  tallest: Math.max(...PROJECTS.map((p) => factNumber(p, "height") ?? 0)),
  since: 2008,
};
