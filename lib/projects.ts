/**
 * Structural project data (locale independent). All copy lives in dictionaries/*.json under projects.items[slug].
 * Sources: glob3x.al (Squarespace, Nov 2026 inventory) and docs/01-REEDS-TOWERS-FACT-SHEET.md.
 */

export const SECTORS = ["towers", "residences", "hospitality", "construction"] as const;
export type Sector = (typeof SECTORS)[number];

export const STATUSES = ["concept", "coming-soon", "in-development", "selling", "completed"] as const;
export type Status = (typeof STATUSES)[number];

export type Role = "developer" | "developer-contractor" | "co-developer" | "contractor";

export type Media = { src: string; w: number; h: number; position?: string };

export type Partner = { name: string; role: "architect" | "local-architect" | "landscape" | "engineering" | "co-developer"; url?: string };

export type Project = {
  slug: string;
  sector: Sector;
  status: Status;
  role: Role;
  flagship?: boolean;
  /** Units or commercial space currently on sale. */
  forSale?: boolean;
  /** Dedicated website, if any. */
  externalUrl?: string;
  logo?: string;
  hero: Media;
  cover: Media;
  gallery: Media[];
  plans?: Media[];
  partners?: Partner[];
  video?: { src: string; poster: string };
};

const m = (src: string, w: number, h: number, position?: string): Media => ({ src, w, h, position });

export const PROJECTS: readonly Project[] = [
  {
    slug: "reeds-towers",
    sector: "towers",
    status: "in-development",
    role: "co-developer",
    flagship: true,
    externalUrl: "reeds",
    hero: m("/media/projects/reeds-towers/hero-aerial.webp", 2560, 1429),
    cover: m("/media/projects/reeds-towers/towers-mountains.webp", 2000, 1407),
    video: { src: "/media/projects/reeds-towers/hero-loop.mp4", poster: "/media/projects/reeds-towers/hero-poster.jpg" },
    gallery: [
      m("/media/projects/reeds-towers/dusk.webp", 2400, 1698),
      m("/media/projects/reeds-towers/tower-portrait.webp", 1378, 2000),
      m("/media/projects/reeds-towers/plaza-people.webp", 2000, 1418),
      m("/media/projects/reeds-towers/facade-texture.webp", 2000, 1415),
      m("/media/projects/reeds-towers/lobby.webp", 2000, 1116),
      m("/media/projects/reeds-towers/restaurant.webp", 2000, 1116),
      m("/media/projects/reeds-towers/pool.webp", 2000, 1116),
      m("/media/projects/reeds-towers/living.webp", 2000, 1116),
      m("/media/projects/reeds-towers/terrace.webp", 2000, 1116),
      m("/media/projects/reeds-towers/night-aerial.webp", 2400, 1340),
    ],
    plans: [m("/media/projects/reeds-towers/section-tower.webp", 1125, 1800)],
    partners: [
      { name: "Coldefy", role: "architect", url: "https://coldefy.fr" },
      { name: "Artech Studio", role: "local-architect", url: "https://artech.al" },
      { name: "Sempervirens", role: "landscape", url: "https://sempervirens.fr" },
      { name: "HMS", role: "engineering" },
      { name: "Lojbi Construction", role: "co-developer" },
    ],
  },
  {
    slug: "glow-tower",
    sector: "towers",
    status: "concept",
    role: "developer",
    hero: m("/media/projects/glow-tower/hero.webp", 2400, 1743),
    cover: m("/media/projects/glow-tower/tower.webp", 1800, 2250, "object-top"),
    gallery: [
      m("/media/projects/glow-tower/tower-mountains.webp", 826, 648),
      m("/media/projects/glow-tower/facade-detail.webp", 826, 650),
      m("/media/projects/glow-tower/garden-court.webp", 865, 651),
      m("/media/projects/glow-tower/lobby.webp", 849, 648),
      m("/media/projects/glow-tower/interior-living.webp", 844, 1746),
      m("/media/projects/glow-tower/interior-lounge.webp", 844, 1746),
      m("/media/projects/glow-tower/interior-restaurant.webp", 844, 1746),
      m("/media/projects/glow-tower/interior-kitchen.webp", 844, 1746),
    ],
    plans: [m("/media/projects/glow-tower/section.webp", 1466, 1469), m("/media/projects/glow-tower/map.webp", 1600, 1011)],
  },
  {
    slug: "lorden-residence",
    sector: "residences",
    status: "selling",
    role: "developer-contractor",
    forSale: true,
    logo: "/media/projects/lorden-residence/logo.webp",
    hero: m("/media/projects/lorden-residence/hero.webp", 2400, 1440),
    cover: m("/media/projects/lorden-residence/building-1.webp", 2000, 1200),
    gallery: [
      m("/media/projects/lorden-residence/building-3.webp", 2000, 1200),
      m("/media/projects/lorden-residence/night.webp", 2000, 1200),
      m("/media/projects/lorden-residence/facade.webp", 2000, 1200),
      m("/media/projects/lorden-residence/plan-3d-1.webp", 1080, 1080),
      m("/media/projects/lorden-residence/plan-3d-2.webp", 1200, 1200),
      m("/media/projects/lorden-residence/plan-3d-3.webp", 1200, 1200),
    ],
    plans: [
      m("/media/projects/lorden-residence/unit-1.webp", 1600, 1143),
      m("/media/projects/lorden-residence/unit-2.webp", 1600, 1143),
      m("/media/projects/lorden-residence/unit-3.webp", 1600, 1143),
    ],
  },
  {
    slug: "new-corner-residence",
    sector: "residences",
    status: "completed",
    role: "developer-contractor",
    forSale: true,
    logo: "/media/projects/new-corner-residence/logo.webp",
    hero: m("/media/projects/new-corner-residence/facade-2.webp", 1800, 1198),
    cover: m("/media/projects/new-corner-residence/corner.webp", 1470, 1470),
    gallery: [
      m("/media/projects/new-corner-residence/hero.webp", 1470, 1470),
      m("/media/projects/new-corner-residence/aerial.webp", 1041, 1280),
      m("/media/projects/new-corner-residence/aerial-2.webp", 1600, 1600),
      m("/media/projects/new-corner-residence/facade-1.webp", 1539, 1539),
    ],
    plans: [
      m("/media/projects/new-corner-residence/unit-38.webp", 1600, 1600),
      m("/media/projects/new-corner-residence/unit-41.webp", 750, 750),
      m("/media/projects/new-corner-residence/unit-6.webp", 750, 750),
    ],
  },
  {
    slug: "avi-residence-boulevard",
    sector: "residences",
    status: "in-development",
    role: "developer",
    forSale: true,
    logo: "/media/projects/avi-residence-boulevard/logo.webp",
    hero: m("/media/projects/avi-residence-boulevard/hero.webp", 2400, 1680),
    cover: m("/media/projects/avi-residence-boulevard/facade-2.webp", 2000, 1400),
    gallery: [
      m("/media/projects/avi-residence-boulevard/facade-1.webp", 2000, 1125),
      m("/media/projects/avi-residence-boulevard/facade-3.webp", 2000, 1400),
      m("/media/projects/avi-residence-boulevard/facade-4.webp", 2000, 1400),
    ],
    plans: [
      m("/media/projects/avi-residence-boulevard/unit-6.webp", 1600, 1600),
      m("/media/projects/avi-residence-boulevard/unit-37.webp", 1600, 1600),
      m("/media/projects/avi-residence-boulevard/unit-41.webp", 1600, 1600),
      m("/media/projects/avi-residence-boulevard/unit-43.webp", 1600, 1600),
    ],
  },
  {
    slug: "art-residence",
    sector: "residences",
    status: "coming-soon",
    role: "developer-contractor",
    logo: "/media/projects/art-residence/logo.webp",
    hero: m("/media/projects/art-residence/hero.webp", 2000, 1346),
    cover: m("/media/projects/art-residence/corner.webp", 2000, 1333),
    gallery: [
      m("/media/projects/art-residence/street.webp", 1800, 1220),
      m("/media/projects/art-residence/corner-2.webp", 1800, 1218),
      m("/media/projects/art-residence/facade.webp", 1800, 1080),
    ],
  },
  {
    slug: "hotel-varosh",
    sector: "hospitality",
    status: "in-development",
    role: "developer-contractor",
    hero: m("/media/projects/hotel-varosh/hero.webp", 1280, 588),
    cover: m("/media/projects/hotel-varosh/pool.webp", 1262, 658),
    gallery: [m("/media/projects/hotel-varosh/evening.webp", 1280, 522), m("/media/projects/hotel-varosh/hero.webp", 1280, 588)],
  },
  {
    slug: "skopje-east-gate",
    sector: "construction",
    status: "completed",
    role: "contractor",
    hero: m("/media/group/site-cranes-dusk.webp", 2400, 2400, "object-[50%_60%]"),
    cover: m("/media/projects/skopje-east-gate/hero.webp", 1766, 1198),
    gallery: [
      m("/media/projects/skopje-east-gate/aerial.webp", 746, 420),
      m("/media/projects/skopje-east-gate/workers.webp", 746, 420),
      m("/media/projects/skopje-east-gate/aerial-close.webp", 746, 420),
      m("/media/projects/skopje-east-gate/cranes.webp", 2000, 2000),
    ],
  },
  {
    slug: "sochi-2014",
    sector: "construction",
    status: "completed",
    role: "contractor",
    hero: m("/media/group/workers-rebar.webp", 1800, 1350),
    cover: m("/media/group/workers-rebar.webp", 1800, 1350),
    gallery: [],
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

export const projectsBySector = (sector: Sector) => PROJECTS.filter((p) => p.sector === sector);

export const FLAGSHIP = PROJECTS.find((p) => p.flagship)!;

/** The group's project count and countries, derived so the figures can never drift from the data. */
export const PORTFOLIO = {
  projects: PROJECTS.length,
  countries: 3,
};
